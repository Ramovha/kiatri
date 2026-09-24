'use client';

import { useEffect, useState } from 'react';
import { residentialPlans, phoneHardwareOptions } from '@/lib/products';
import type { AppImages } from '@/lib/appImages';
import PricingCard from './PricingCard';
import PhoneOptionCard from './PhoneOptionCard';
import FeatureTabs, { FeatureTab } from './FeatureTabs';
import PillTabs from './PillTabs';
import { LaptopFrame, PhoneFrame, AppShot } from './voice/Frames';
import {
  IllustrationCard,
  VoicemailIllustration,
  PortingIllustration,
  IncomingCallScreen,
  AppDesktopScreen,
  AppDialerScreen,
  DectPhoneIllustration,
  SetupStepsIllustration,
  RangeIllustration,
} from './voice/Illustrations';

type TopTab = 'residential' | 'connect-phone';

const TOP_TABS: { id: TopTab; label: string }[] = [
  { id: 'residential', label: 'Residential' },
  { id: 'connect-phone', label: 'Connect a Phone' },
];

// Home Unlimited has no billing product yet, so it isn't shown.
const homePlans = residentialPlans.filter((plan) => plan.id !== 'residential-unlimited');

const ALT = {
  app: 'Kiatri calling app on desktop and mobile phone',
  dialer: 'Kiatri dialer screen on a mobile phone',
  history: 'Kiatri call history screen on a mobile phone',
  voicemail: 'Voicemail delivered to email as an audio file',
  callerId: 'Incoming call showing caller ID on the Kiatri app',
  porting: 'Porting an existing South African number to Kiatri',
  dect: 'Cordless DECT handset and base station',
  setup: 'Three steps to connect a cordless phone: plug in the base station, enter your Kiatri line details, make a test call',
  range: 'Home floor plan with range rings around the cordless phone base station',
};

// The real screenshots are used when they've been added (see
// scripts/optimize-app-images.py); until then an original illustration of the
// same screen fills the frame, so there's never an empty box.
function residentialTabs(images: AppImages): FeatureTab[] {
  const desktop = images['desktop-app'];
  const dialer = images['mobile-dialer'];
  const history = images['mobile-call-history'];
  const incoming = images['mobile-incoming-call'];

  return [
    {
      id: 'portal',
      label: 'Simple App',
      title: 'Your home line on your phone and computer',
      description:
        'Make and take calls from our app on iPhone, Android, Windows and Mac. Check your balance, see your call history and top up, all in one place.',
      bullets: ['Calls on mobile and desktop', 'See your call history', 'Top up your balance', 'No technical setup'],
      visual: (
        <div className="relative pb-8 pr-[6%]">
          <LaptopFrame>{desktop ? <AppShot image={desktop} alt={ALT.app} /> : <AppDesktopScreen label={ALT.app} />}</LaptopFrame>
          {/* Call history sits beside the dialer once its screenshot has been added. */}
          {history && (
            <PhoneFrame className="absolute bottom-3 right-[25%] w-[22%] min-w-[70px]">
              <AppShot image={history} alt={ALT.history} />
            </PhoneFrame>
          )}
          <PhoneFrame className="absolute bottom-0 right-0 w-[24%] min-w-[76px]">
            {dialer ? <AppShot image={dialer} alt={ALT.dialer} /> : <AppDialerScreen label={ALT.dialer} />}
          </PhoneFrame>
        </div>
      ),
    },
    {
      id: 'voicemail',
      label: 'Voicemail to Email',
      title: 'Never miss a message',
      description: 'Voicemails arrive in your inbox as audio files, so you can listen anywhere.',
      bullets: ['Delivered as an audio file', 'No extra app to check'],
      visual: (
        <IllustrationCard>
          <VoicemailIllustration label={ALT.voicemail} />
        </IllustrationCard>
      ),
    },
    {
      id: 'callerid',
      label: 'Caller ID',
      title: "Know who's calling",
      description: "See the caller's number before you answer, and present your own local number when you call out.",
      bullets: ['Works on any phone app', 'No extra setup needed'],
      visual: (
        <div className="mx-auto w-full max-w-[220px]">
          <PhoneFrame>{incoming ? <AppShot image={incoming} alt={ALT.callerId} /> : <IncomingCallScreen label={ALT.callerId} />}</PhoneFrame>
        </div>
      ),
    },
    {
      id: 'porting',
      label: 'Keep Your Number',
      title: 'Bring your number with you',
      description: 'Switch to Kiatri and keep the number your family and friends already know.',
      bullets: ['Bring your existing number across', 'No downtime during the switch'],
      link: { href: '/numbers', label: 'Numbers & porting →' },
      visual: (
        <IllustrationCard>
          <PortingIllustration label={ALT.porting} />
        </IllustrationCard>
      ),
    },
  ];
}

const PHONE_FEATURE_TABS: FeatureTab[] = [
  {
    id: 'compatible',
    label: 'Compatible Phones',
    title: 'Works with the cordless phone you already have',
    description: 'Gigaset, Yealink, Panasonic, Snom and similar SIP-compatible cordless phones work out of the box.',
    bullets: ['Gigaset, Yealink, Panasonic, Snom and similar', 'Standard SIP registration', 'No proprietary lock-in'],
    visual: (
      <IllustrationCard>
        <DectPhoneIllustration label={ALT.dect} />
      </IllustrationCard>
    ),
  },
  {
    id: 'setup',
    label: 'Setup Steps',
    title: 'Plug in and register — that’s it',
    description: 'Enter your SIP details into your phone once, and it registers to your line automatically.',
    bullets: ['Enter your SIP credentials once', 'Works over your existing WiFi/LAN', 'No technician visit needed'],
    visual: (
      <IllustrationCard>
        <SetupStepsIllustration label={ALT.setup} />
      </IllustrationCard>
    ),
  },
  {
    id: 'coverage',
    label: 'Coverage & Range',
    title: 'Know your handset’s real range',
    description: 'Most cordless phones cover a typical home; larger homes can add a repeater.',
    bullets: ['Range depends on your specific handset', 'Works anywhere with power + internet', 'Multiple handsets can share one line where supported'],
    visual: (
      <IllustrationCard>
        <RangeIllustration label={ALT.range} />
      </IllustrationCard>
    ),
  },
];

export default function VoiceTabsSection({ images }: { images: AppImages }) {
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
            Call and message straight from our app — no hardware required. Simple plans, priced
            honestly.
          </p>
          <div className="mx-auto mt-8 grid max-w-5xl gap-6 md:grid-cols-3">
            {homePlans.map((plan) => (
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
          <FeatureTabs key={tab} tabs={tab === 'residential' ? residentialTabs(images) : PHONE_FEATURE_TABS} />
        </div>
      </section>
    </>
  );
}
