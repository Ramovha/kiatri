'use client';

import { useEffect, useState } from 'react';
import { residentialPlans, phoneHardwareOptions } from '@/lib/products';
import PricingCard from './PricingCard';
import PhoneOptionCard from './PhoneOptionCard';
import FeatureTabs, { FeatureTab } from './FeatureTabs';
import PillTabs from './PillTabs';

type TopTab = 'residential' | 'connect-phone';

const TOP_TABS: { id: TopTab; label: string }[] = [
  { id: 'residential', label: 'Residential' },
  { id: 'connect-phone', label: 'Connect a Phone' },
];

// Two entirely different bottom feature tours depending on which top-level
// tab is active — app software features for Residential, hardware/setup
// info for Connect a Phone. Swapped as a whole block, not just restyled.
const RESIDENTIAL_FEATURE_TABS: FeatureTab[] = [
  {
    id: 'portal',
    label: 'Simple App',
    title: 'Manage everything from one simple app',
    description: 'No technical setup — manage your number, check your balance, and see your call history from one place.',
    bullets: ['See your call history', 'Top up your balance', 'No technical setup required'],
  },
  {
    id: 'voicemail',
    label: 'Voicemail to Email',
    title: 'Never miss a message',
    description: 'Voicemails are delivered straight to your inbox as an audio attachment.',
    bullets: ['Delivered as an email attachment', 'No extra app to check'],
  },
  {
    id: 'callerid',
    label: 'Caller ID',
    title: "Know who's calling",
    description: "See who's calling before you pick up, on any phone you use.",
    bullets: ['Works on any phone app', 'No extra setup needed'],
  },
  {
    id: 'porting',
    label: 'Keep Your Number',
    title: 'Bring the number you already have',
    description: 'Switch to Kiatri without changing your number or telling everyone you know.',
    bullets: ['Free porting on every plan', 'No downtime during the switch'],
  },
];

const PHONE_FEATURE_TABS: FeatureTab[] = [
  {
    id: 'compatible',
    label: 'Compatible Phones',
    title: 'Works with the cordless phone you already have',
    description: 'Most SIP-compatible cordless handsets work out of the box — no need to buy a specific brand.',
    bullets: ['Gigaset, Yealink, Panasonic, Snom, and similar', 'Standard SIP registration', 'No proprietary lock-in'],
  },
  {
    id: 'setup',
    label: 'Setup Steps',
    title: 'Plug in and register — that’s it',
    description: 'Enter your SIP details into your phone once, and it registers to your line automatically.',
    bullets: ['Enter your SIP credentials once', 'Works over your existing WiFi/LAN', 'No technician visit needed'],
  },
  {
    id: 'coverage',
    label: 'Coverage & Range',
    title: 'Know your handset’s real range',
    description:
      'Cordless range depends on your handset and home layout, not on Kiatri — check your phone’s spec sheet for its rated range.',
    bullets: ['Range depends on your specific handset', 'Works anywhere with power + internet', 'Multiple handsets can share one line where supported'],
  },
];

export default function VoiceTabsSection() {
  const [tab, setTab] = useState<TopTab>('residential');

  // Deep-linking, matching the same pattern as PlanCategoryTabs elsewhere
  // on the site: /voice#connect-phone preselects that tab on load.
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'residential' || hash === 'connect-phone') {
      setTab(hash);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PillTabs options={TOP_TABS} activeId={tab} onChange={(id) => setTab(id as TopTab)} />

      {tab === 'residential' ? (
        <>
          <p className="mx-auto mt-6 max-w-2xl text-center text-navy-700">
            Call, video, and message straight from our app — no hardware required. Simple plans, priced
            honestly.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {residentialPlans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="mx-auto mt-6 max-w-2xl text-center text-navy-700">
            Prefer an actual handset over the app? Here&apos;s what&apos;s available today, and what&apos;s
            coming next.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {phoneHardwareOptions.map((option) => (
              <PhoneOptionCard
                key={option.id}
                option={option}
                onSeeResidential={option.status === 'available' ? () => setTab('residential') : undefined}
              />
            ))}
          </div>
        </>
      )}

      <section className="mt-16 rounded-3xl bg-navy-950 px-6 py-16 text-white sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-ember-400">
          {tab === 'residential' ? 'Every home plan includes' : 'Connecting your own phone'}
        </p>
        <h2 className="mt-2 text-3xl font-bold">
          {tab === 'residential' ? 'Simple, out of the box' : 'What to know before you connect'}
        </h2>
        <p className="mt-3 max-w-2xl text-navy-200">
          {tab === 'residential'
            ? 'Click through to see what your line can do from day one.'
            : 'Click through for compatibility, setup, and range details.'}
        </p>
        <div className="mt-10">
          {/* key={tab} forces a clean remount when the top-level tab changes,
              so the sub-tabs reset to their first item instead of carrying
              over whatever index was selected on the other tab's tab set. */}
          <FeatureTabs key={tab} tabs={tab === 'residential' ? RESIDENTIAL_FEATURE_TABS : PHONE_FEATURE_TABS} />
        </div>
      </section>
    </>
  );
}
