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
 *   /kiatri-cart.php?items=bid:2[addons:4,6]&cycle=monthly
 * A plan can carry Product Addons in [addons:ID,ID]; they are attached to that
 * plan's cart item, never added as separate products. For a product (pid) the
 * addon rides on the add link (addons[ID]=on). For a bundle (bid) the addon is
 * attached to the bundle's PBX product (pid 3, 16, 19, 25) once the bundle is
 * in the cart, by submitting that cart item's configure form — the same
 * request the cart's own "Continue" button makes.
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

// Which products each Product Addon may be attached to (mirrors what billing
// allows). 4 = CallerID Block/Blacklist, 5 = Virtual Receptionist (IVR),
// 6 = Virtual Fax. A combination not listed here is dropped, never sent.
const ADDON_PIDS = [
    4 => [1, 4, 5, 8, 9, 10, 17, 18],
    5 => [8, 9, 10, 17, 18],
    6 => [8, 9, 10, 17, 18, 26, 27, 28],
];
// Addons that may attach to a bundle's PBX product (IVR is already included).
const BUNDLE_ADDONS = [4, 6];
// The PBX product inside each bundle, as it is titled in the cart.
const BUNDLE_PBX_TITLE = [1 => 'PBX 5', 2 => 'PBX 10', 3 => 'PBX 25', 4 => 'PBX 50', 5 => 'PBX 10', 6 => 'PBX 25'];
// Names as they appear on a cart line, used to confirm an addon really attached.
const ADDON_NAMES = [4 => 'CallerID Block/Blacklist', 5 => 'Virtual Receptionist (IVR)', 6 => 'Virtual Fax'];
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
    if (isset($m[3])) {
        foreach (explode(',', $m[3]) as $addonId) {
            $addonId = (int) $addonId;
            $fits = $m[1] === 'pid'
                ? in_array($id, ADDON_PIDS[$addonId] ?? [], true)
                : in_array($addonId, BUNDLE_ADDONS, true);
            if (in_array($addonId, ALLOWED_ADDON, true) && $fits && !in_array($addonId, $addons, true)) {
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
        // A bundle's addons are attached afterwards (see $attach below).
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

// Bundles with addons: after the bundle is in the cart, the addons are
// attached to its PBX product. Each entry names that product's cart title.
$attach = [];
foreach ($items as $item) {
    if ($item['type'] === 'bid' && $item['addons']) {
        $attach[] = ['title' => BUNDLE_PBX_TITLE[$item['id']], 'addons' => $item['addons']];
    }
}

$fallback = $addUrls ? $addUrls[0] : '/cart.php?a=view';
$tokens = array_map(function ($item) {
    return $item['type'] . ':' . $item['id'] . ($item['addons'] ? '[' . implode(',', $item['addons']) . ']' : '');
}, $items);
$payload = json_encode(
    ['urls' => $addUrls, 'attach' => $attach, 'names' => ADDON_NAMES, 'key' => implode(',', $tokens) . '|' . $cycle],
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

  // Attaches addons to a bundle's PBX product that is already in the cart, by
  // submitting that cart item's configure form. Throws (so the visitor is
  // shown the problem screen, never a silently addon-less order) if the item,
  // the addon or the result can't be confirmed.
  async function attach(entry) {
    var view = await (await get('/cart.php?a=view')).text();
    var doc = new DOMParser().parseFromString(view, 'text/html');
    var index = null;
    // Each cart line's title element holds the product name as its own text,
    // followed by its Edit / Remove controls.
    doc.querySelectorAll('.item-title').forEach(function (title) {
      var link = title.querySelector('a[href*="a=confproduct"]');
      var match = link && link.getAttribute('href').match(/[?&]i=(\d+)/);
      var name = title.firstChild ? title.firstChild.textContent.trim() : '';
      if (match && name === entry.title) index = match[1]; // the latest one
    });
    if (index === null) throw new Error('find');

    var conf = await (await get('/cart.php?a=confproduct&i=' + index)).text();
    var token = (conf.match(/name="token"\s+value="([^"]+)"/) || [])[1];
    if (!token) throw new Error('token');
    entry.addons.forEach(function (id) {
      if (conf.indexOf('name="addons[' + id + ']"') === -1) throw new Error('addon not offered');
    });

    var body = new URLSearchParams();
    body.set('token', token);
    body.set('configure', 'true');
    body.set('i', index);
    entry.addons.forEach(function (id) { body.set('addons[' + id + ']', 'on'); });
    var res = await fetch('/cart.php?a=confproduct&i=' + index, {
      method: 'POST',
      body: body,
      credentials: 'same-origin',
      redirect: 'follow',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    if (!res.ok) throw new Error('attach');

    var after = await (await get('/cart.php?a=view')).text();
    entry.addons.forEach(function (id) {
      if (after.indexOf(cfg.names[id]) === -1) throw new Error('not attached');
    });
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

    for (var j = 0; j < cfg.attach.length; j++) await attach(cfg.attach[j]);

    try { sessionStorage.setItem(STORE, JSON.stringify({ at: Date.now(), configUrl: configUrl })); } catch (e) {}
    location.replace(configUrl || CART);
  }

  run().catch(fail);
})();
</script>
</body>
</html>
