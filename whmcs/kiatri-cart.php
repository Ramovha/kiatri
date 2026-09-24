<?php
/**
 * Kiatri one-click cart.
 *
 * Deploy: upload this file to the WHMCS web root (next to cart.php), so it is
 * served at https://calling.kiatri.com/kiatri-cart.php. It is NOT part of the
 * marketing-site build (Cloudflare only publishes the `out` folder).
 *
 * Link format (built by the pricing page):
 *   /kiatri-cart.php?items=bid:2,pid:26&cycle=monthly
 *   /kiatri-cart.php?items=pid:9[addons:5,6]&cycle=monthly
 * A plan can carry Product Addons in [addons:ID,ID]; they are attached to that
 * plan's cart item (addons[ID]=on), not added as separate products. Only
 * products can carry addons — bundles ignore them.
 *
 * What it does: empties the visitor's cart, adds every item with monthly
 * billing using WHMCS's own add URLs (products with pid, bundles with bid),
 * then sends the visitor to review their order (the Review & Checkout page,
 * /cart.php?a=view). The adds run in the visitor's own
 * browser, sequentially, on this domain — so they share the visitor's cart
 * session, come from the visitor's own IP, and go through exactly the same
 * WHMCS code path as clicking "Order" on each product by hand.
 *
 * If an item stops at a configure step (a product with required fields), the
 * visitor is sent to that step first; WHMCS then continues to the cart, and
 * they proceed to checkout from there.
 *
 * Only the IDs listed below can be added. Hidden and retired products are
 * never allowed — bundles pull their own parts in by themselves, and addons
 * are only ever attached to a plan (addons[ID]=on), never added on their own.
 */

const ALLOWED_PID = [1, 4, 5, 8, 9, 10, 13, 17, 18, 26, 27, 28];
const ALLOWED_ADDON = [4, 5, 6];
const ALLOWED_BID = [1, 2, 3, 4, 5, 6];
// Monthly only for now: yearly pricing isn't set up in billing yet. Add
// 'annually' back together with the yearly bundles.
const ALLOWED_CYCLES = ['monthly'];
const MAX_ITEMS = 8;

$cycle = isset($_GET['cycle']) && in_array($_GET['cycle'], ALLOWED_CYCLES, true) ? $_GET['cycle'] : 'monthly';

// Parse and validate items; drop anything unknown and any repeat.
$items = [];
$raw = isset($_GET['items']) && is_string($_GET['items']) ? $_GET['items'] : '';
preg_match_all('/(pid|bid):(\d{1,3})(?:\[addons:([\d,]{1,20})\])?/', $raw, $matches, PREG_SET_ORDER);
foreach ($matches as $m) {
    $id = (int) $m[2];
    $allowed = $m[1] === 'pid' ? ALLOWED_PID : ALLOWED_BID;
    $key = $m[1] . ':' . $id;
    if (!in_array($id, $allowed, true) || isset($items[$key]) || count($items) >= MAX_ITEMS) {
        continue;
    }
    $addons = [];
    if ($m[1] === 'pid' && isset($m[3])) {
        foreach (explode(',', $m[3]) as $addonId) {
            $addonId = (int) $addonId;
            if (in_array($addonId, ALLOWED_ADDON, true) && !in_array($addonId, $addons, true)) {
                $addons[] = $addonId;
            }
        }
    }
    $items[$key] = ['type' => $m[1], 'id' => $id, 'addons' => $addons];
}
$items = array_values($items);

header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');
header('Referrer-Policy: same-origin');

// Add URL for one item. Products skip the configure step when they have no
// required fields; bundles use bid only.
function add_url(array $item, string $cycle): string
{
    if ($item['type'] === 'bid') {
        return '/cart.php?a=add&bid=' . $item['id'];
    }
    $url = '/cart.php?a=add&pid=' . $item['id'] . '&billingcycle=' . $cycle . '&skipconfig=1';
    foreach ($item['addons'] as $addonId) {
        $url .= '&addons%5B' . $addonId . '%5D=on';
    }
    return $url;
}

$addUrls = array_map(function ($item) use ($cycle) {
    return add_url($item, $cycle);
}, $items);

$fallback = $addUrls ? $addUrls[0] : '/cart.php?a=view';
$tokens = array_map(function ($item) {
    return $item['type'] . ':' . $item['id'] . ($item['addons'] ? '[' . implode(',', $item['addons']) . ']' : '');
}, $items);
$payload = json_encode(
    ['urls' => $addUrls, 'key' => implode(',', $tokens) . '|' . $cycle],
    JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT
);
?>
<!doctype html>
<html lang="en-ZA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Setting up your order | Kiatri</title>
<style>
  body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #F7F8FA; color: #0B1B33; font: 16px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
  main { max-width: 26rem; padding: 2rem; text-align: center; }
  .spin { width: 2.5rem; height: 2.5rem; margin: 0 auto 1.25rem; border: 4px solid #D9DEE7; border-top-color: #FF8A3D; border-radius: 50%; animation: s 0.9s linear infinite; }
  @keyframes s { to { transform: rotate(360deg); } }
  a.btn { display: inline-block; margin-top: 1rem; padding: 0.75rem 1.5rem; border-radius: 999px; background: #FF8A3D; color: #fff; font-weight: 600; text-decoration: none; }
  [hidden] { display: none !important; }
</style>
</head>
<body>
<main>
  <div id="working">
    <div class="spin" aria-hidden="true"></div>
    <h1 style="font-size:1.25rem;margin:0 0 .5rem">Setting up your order</h1>
    <p style="margin:0;color:#3B4A63">One moment. We're adding your items and taking you to review your order.</p>
  </div>
  <div id="problem" hidden>
    <h1 style="font-size:1.25rem;margin:0 0 .5rem">We couldn't finish setting up your order</h1>
    <p style="margin:0;color:#3B4A63">Your cart may already have some of your items. You can review it and continue from there.</p>
    <a class="btn" href="/cart.php?a=view">Go to my cart</a>
  </div>
  <noscript>
    <p>JavaScript is needed to add several items at once. <a class="btn" href="<?= htmlspecialchars($fallback, ENT_QUOTES) ?>">Add the first item to my cart</a></p>
  </noscript>
</main>
<script>
(function () {
  var cfg = <?= $payload ?>;
  var CART = '/cart.php?a=view';
  var STORE = 'kiatriCart:' + cfg.key;

  function fail() {
    document.getElementById('working').hidden = true;
    document.getElementById('problem').hidden = false;
  }

  function get(url) {
    return fetch(url, { credentials: 'same-origin', redirect: 'follow', cache: 'no-store' });
  }

  async function run() {
    if (!cfg.urls.length) { location.replace(CART); return; }

    var configUrl = null;
    var recent = null;
    try { recent = JSON.parse(sessionStorage.getItem(STORE) || 'null'); } catch (e) {}

    // A reload within a minute must not add everything a second time.
    if (recent && Date.now() - recent.at < 60000) {
      location.replace(recent.configUrl || CART);
      return;
    }

    // Start from a clean cart so every item appears exactly once.
    var cleared = await get('/cart.php?a=empty');
    if (!cleared.ok) throw new Error('empty');

    // One at a time: the adds share one cart session.
    for (var i = 0; i < cfg.urls.length; i++) {
      var res = await get(cfg.urls[i]);
      if (!res.ok) throw new Error('add');
      // A finished add ends on the cart. Anything else is a configure step
      // (required fields) — remember the first one and send the visitor there.
      if (!configUrl && res.url.indexOf('a=view') === -1) configUrl = res.url;
    }

    try { sessionStorage.setItem(STORE, JSON.stringify({ at: Date.now(), configUrl: configUrl })); } catch (e) {}
    location.replace(configUrl || CART);
  }

  run().catch(fail);
})();
</script>
</body>
</html>
