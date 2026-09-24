import { buildOrderLink } from '../lib/addons';
const errors: string[] = [];
const orig = console.error; console.error = (m: string) => errors.push(m);
const pid = (n: number) => ({ whmcsPid: n }), bid = (n: number) => ({ whmcsBid: n });
const CB = 'addon-callerid-block', IVR = 'addon-virtual-receptionist', FAX = 'addon-virtual-fax';
const cases: [string, ReturnType<typeof buildOrderLink>, string | null][] = [
  ['home + ivr (refused)',        buildOrderLink(pid(4), 'home', [IVR]), null],
  ['home + fax (refused)',        buildOrderLink(pid(4), 'home', [FAX]), null],
  ['trunk + callblock (refused)', buildOrderLink(pid(26), 'trunk', [CB]), null],
  ['trunk + ivr (refused)',       buildOrderLink(pid(26), 'trunk', [IVR]), null],
  ['trunk + fax (soon, refused)', buildOrderLink(pid(26), 'trunk', [FAX]), null],
  ['pbx + callblock (soon, refused)', buildOrderLink(bid(2), 'pbx', [CB]), null],
  ['pbx + fax (soon, refused)',   buildOrderLink(bid(2), 'pbx', [FAX]), null],
  ['business + callblock + ivr + fax', buildOrderLink(pid(10), 'business', [FAX, IVR, CB]), 'https://calling.kiatri.com/kiatri-cart.php?items=pid:10[addons:4,5,6]&cycle=monthly'],
  ['business + ivr',              buildOrderLink(pid(9), 'business', [IVR]), 'https://calling.kiatri.com/kiatri-cart.php?items=pid:9[addons:5]&cycle=monthly'],
  ['home + callblock',            buildOrderLink(pid(4), 'home', [CB]), 'https://calling.kiatri.com/kiatri-cart.php?items=pid:4[addons:4]&cycle=monthly'],
  ['pbx + ivr (included: no addon in cart)', buildOrderLink(bid(2), 'pbx', [IVR]), 'https://calling.kiatri.com/kiatri-cart.php?items=bid:2&cycle=monthly'],
  ['no addons',                   buildOrderLink(pid(8), 'business', []), 'https://calling.kiatri.com/kiatri-cart.php?items=pid:8&cycle=monthly'],
  ['business + ivr + a ineligible mix is refused as a whole? (home cb + ivr)', buildOrderLink(pid(1), 'home', [CB, IVR]), null],
];
let bad = 0;
for (const [label, got, want] of cases) { const ok = got === want; if (!ok) bad++; console.log(ok ? 'PASS' : 'FAIL', label, '->', got); }
const refused = cases.filter(([, , w]) => w === null).length;
console.log(`refusals logged an error each: ${errors.length === refused ? 'PASS' : 'FAIL'} (${errors.length}/${refused})`);
console.log(errors[0]);
if (bad || errors.length !== refused) process.exit(1);
