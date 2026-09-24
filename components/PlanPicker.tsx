'use client';

import { useState } from 'react';
import CTAButton from './CTAButton';

type SeatAnswer = '1' | '2-5' | '6-25' | '26-50' | '50+';
type NeedAnswer = 'line' | 'routing';
type VolumeAnswer = '1-2' | '3-4' | '5-6' | '7+';

const SEAT_OPTIONS: { value: SeatAnswer; label: string }[] = [
  { value: '1', label: 'Just me' },
  { value: '2-5', label: '2–5 people' },
  { value: '6-25', label: '6–25 people' },
  { value: '26-50', label: '26–50 people' },
  { value: '50+', label: '50+ people' },
];

const NEED_OPTIONS: { value: NeedAnswer; label: string }[] = [
  { value: 'line', label: 'Just a working phone line' },
  { value: 'routing', label: 'Call routing / an IVR menu' },
];

const VOLUME_OPTIONS: { value: VolumeAnswer; label: string }[] = [
  { value: '1-2', label: '1–2 at once' },
  { value: '3-4', label: '3–4 at once' },
  { value: '5-6', label: '5–6 at once' },
  { value: '7+', label: '7+ at once' },
];

interface Recommendation {
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

// Deterministic routing to existing tiers only — no new pricing invented
// here, just a shortcut to the right anchor on /business (where the tier
// browser lives), or /contact for Enterprise-territory answers.
function getRecommendation(seats: SeatAnswer, need: NeedAnswer, volume: VolumeAnswer | null): Recommendation {
  if (seats === '50+') {
    return {
      title: 'Enterprise',
      description:
        "At 50+ people you're past our self-service tiers — we size seats, trunk capacity, and SLA together with you.",
      href: '/contact',
      ctaLabel: 'Talk to us',
    };
  }

  if (seats === '1') {
    if (need === 'line') {
      return {
        title: 'Line 200',
        description: 'A single line with bundled minutes — no PBX needed.',
        href: '/business#line',
        ctaLabel: 'See Line Plans',
      };
    }
    return {
      title: 'Line 200 + Virtual Receptionist addon',
      description: 'A single line, plus the Virtual Receptionist switched on when you choose your plan, so it still sounds like a real business.',
      href: '/business#line',
      ctaLabel: 'See Line Plans',
    };
  }

  const pbxLabel = seats === '2-5' ? 'PBX 5' : seats === '6-25' ? 'PBX 10' : 'PBX 50';
  const trunkLabel = volume === '1-2' ? 'Metro 3400' : volume === '3-4' ? 'Metro 5400' : 'Metro 8400';

  return {
    title: `${pbxLabel} + ${trunkLabel}`,
    description:
      seats === '6-25'
        ? `${pbxLabel} covers most teams that size — size up to PBX 25 if you're near the top end.`
        : seats === '26-50'
          ? `${pbxLabel} covers your whole team in one tier.`
          : `${pbxLabel} for seats, ${trunkLabel} for calling capacity to match your busy-period call volume.`,
    href: '/business#voip',
    ctaLabel: 'See VoIP Plans',
    secondaryHref: '/business#trunks',
    secondaryLabel: `See the ${trunkLabel} trunk tier`,
  };
}

export default function PlanPicker() {
  const [step, setStep] = useState(0);
  const [seats, setSeats] = useState<SeatAnswer | null>(null);
  const [need, setNeed] = useState<NeedAnswer | null>(null);
  const [volume, setVolume] = useState<VolumeAnswer | null>(null);

  function chooseSeats(value: SeatAnswer) {
    setSeats(value);
    setStep(1);
  }

  function chooseNeed(value: NeedAnswer) {
    setNeed(value);
    // Solo users never need the concurrency question — their recommendation
    // doesn't depend on it — so skip straight to the result.
    setStep(seats === '1' ? 3 : 2);
  }

  function chooseVolume(value: VolumeAnswer) {
    setVolume(value);
    setStep(3);
  }

  function reset() {
    setStep(0);
    setSeats(null);
    setNeed(null);
    setVolume(null);
  }

  if (step === 3 && seats && need) {
    const rec = getRecommendation(seats, need, volume);
    return (
      <div className="rounded-2xl bg-navy-950 p-8 text-center text-white">
        <p className="text-sm font-semibold uppercase tracking-wide text-ember-400">Our recommendation</p>
        <h3 className="mt-2 font-display text-2xl font-bold">{rec.title}</h3>
        <p className="mx-auto mt-2 max-w-md text-navy-200">{rec.description}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <CTAButton href={rec.href}>{rec.ctaLabel}</CTAButton>
          {rec.secondaryHref && (
            <CTAButton href={rec.secondaryHref} variant="ghost" className="border-white/25 text-white hover:border-white/60">
              {rec.secondaryLabel}
            </CTAButton>
          )}
        </div>
        <button type="button" onClick={reset} className="mt-6 text-sm font-medium text-navy-300 underline hover:text-white">
          Start over
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-navy-900/10 bg-white p-8 shadow-card">
      <div className="mx-auto flex max-w-xs items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-ember-500' : 'bg-navy-100'}`} />
        ))}
      </div>

      {step === 0 && (
        <QuestionStep
          question="How many people need their own extension?"
          options={SEAT_OPTIONS}
          onSelect={chooseSeats}
        />
      )}
      {step === 1 && (
        <QuestionStep
          question="Do you need call routing/IVR, or just a working phone line?"
          options={NEED_OPTIONS}
          onSelect={chooseNeed}
        />
      )}
      {step === 2 && (
        <QuestionStep
          question="Roughly how many calls happen at once during busy periods?"
          options={VOLUME_OPTIONS}
          onSelect={chooseVolume}
        />
      )}
    </div>
  );
}

function QuestionStep<T extends string>({
  question,
  options,
  onSelect,
}: {
  question: string;
  options: { value: T; label: string }[];
  onSelect: (value: T) => void;
}) {
  return (
    <div className="mt-6 text-center">
      <h3 className="font-display text-lg font-bold text-navy-900">{question}</h3>
      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className="rounded-xl border border-navy-900/10 px-4 py-3 text-sm font-semibold text-navy-800 transition hover:border-ember-500 hover:bg-ember-500/5 hover:text-ember-600"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
