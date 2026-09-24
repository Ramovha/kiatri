'use client';

import { useState } from 'react';
import Link from 'next/link';
import { residentialPlans, pbxTiers, trunkPlans, Plan } from '@/lib/products';
import { orderProductUrl } from '@/lib/whmcs';
import { formatZAR } from '@/lib/format';
import { submitLead, LeadPayload } from '@/lib/leads';
import CTAButton from './CTAButton';
import { CheckIcon } from './icons';

type Audience = 'personal' | 'business';
type Screen =
  | 'audience'
  | 'personal-usage'
  | 'personal-phone'
  | 'personal-contact'
  | 'personal-result'
  | 'business-seats'
  | 'business-pbx'
  | 'business-volume'
  | 'business-contact'
  | 'business-result'
  | 'callback-confirmed';

type PersonalUsage = 'light' | 'regular' | 'unlimited';
type HasPhone = 'yes' | 'no';
type BizSeats = 'justme' | '2-5' | '6-25' | '26-50' | '50+';
type PbxOwnership = 'has-pbx' | 'no-pbx' | 'not-sure';
type CallVolume = '1-2' | '3-4' | '5-6' | '7+';

// Maps directly to existing residentialPlans ids — no new pricing invented,
// just routing to what's already built (see lib/products.ts).
const PERSONAL_PLAN_BY_USAGE: Record<PersonalUsage, string> = {
  light: 'residential-payg',
  regular: 'residential-200',
  unlimited: 'residential-unlimited',
};

const ALL_PLANS: Plan[] = [...residentialPlans, ...pbxTiers, ...trunkPlans];
function findPlan(id: string): Plan | undefined {
  return ALL_PLANS.find((plan) => plan.id === id);
}

const PERSONAL_STEP_INDEX: Record<Screen, number> = {
  audience: 0,
  'personal-usage': 1,
  'personal-phone': 2,
  'personal-contact': 3,
  'personal-result': 4,
  'business-seats': 0,
  'business-pbx': 0,
  'business-volume': 0,
  'business-contact': 0,
  'business-result': 0,
  'callback-confirmed': 0,
};
const BUSINESS_STEP_INDEX: Record<Screen, number> = {
  audience: 0,
  'personal-usage': 0,
  'personal-phone': 0,
  'personal-contact': 0,
  'personal-result': 0,
  'business-seats': 1,
  'business-pbx': 2,
  'business-volume': 3,
  'business-contact': 4,
  'business-result': 5,
  'callback-confirmed': 0,
};

export default function GetStartedFlow() {
  const [screen, setScreen] = useState<Screen>('audience');
  const [audience, setAudience] = useState<Audience | null>(null);

  const [usage, setUsage] = useState<PersonalUsage | null>(null);
  const [hasPhone, setHasPhone] = useState<HasPhone | null>(null);

  const [seats, setSeats] = useState<BizSeats | null>(null);
  const [pbxOwnership, setPbxOwnership] = useState<PbxOwnership | null>(null);
  const [volume, setVolume] = useState<CallVolume | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [callbackRequested, setCallbackRequested] = useState(false);

  const contactValid =
    name.trim().length > 1 && /\S+@\S+\.\S+/.test(email) && phone.trim().replace(/\D/g, '').length >= 7 && consent;

  function reset() {
    setScreen('audience');
    setAudience(null);
    setUsage(null);
    setHasPhone(null);
    setSeats(null);
    setPbxOwnership(null);
    setVolume(null);
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setConsent(false);
    setCallbackRequested(false);
  }

  function chooseAudience(value: Audience) {
    setAudience(value);
    setScreen(value === 'personal' ? 'personal-usage' : 'business-seats');
  }

  function computeBusinessOutcome():
    | { custom: true }
    | { custom: false; planId: string; secondPlanId?: string } {
    if (seats === '50+' || pbxOwnership === 'not-sure') {
      return { custom: true };
    }
    const trunkId = volume === '1-2' ? 'trunk-3400' : volume === '3-4' ? 'trunk-5400' : 'trunk-8400';
    if (pbxOwnership === 'has-pbx') {
      return { custom: false, planId: trunkId };
    }
    const pbxId = seats === '26-50' ? 'pbx-50' : seats === '6-25' ? 'pbx-10' : 'pbx-5';
    return { custom: false, planId: pbxId, secondPlanId: trunkId };
  }

  async function submitPersonal() {
    setSubmitting(true);
    const planId = usage ? PERSONAL_PLAN_BY_USAGE[usage] : PERSONAL_PLAN_BY_USAGE.light;
    const plan = findPlan(planId);
    const payload: LeadPayload = {
      audience: 'personal',
      answers: { usage: usage ?? '', hasPhone: hasPhone ?? '' },
      name,
      email,
      phone,
      consent,
      outcome: 'order',
      recommendedPlanId: plan?.id,
      recommendedPlanName: plan?.name,
    };
    await submitLead(payload);
    setSubmitting(false);
    setScreen('personal-result');
  }

  async function submitBusiness() {
    setSubmitting(true);
    const outcome = computeBusinessOutcome();
    const payload: LeadPayload = {
      audience: 'business',
      answers: { seats: seats ?? '', pbxOwnership: pbxOwnership ?? '', volume: volume ?? '' },
      name,
      email,
      phone,
      company,
      consent,
      outcome: outcome.custom ? 'custom-quote' : 'order',
      recommendedPlanId: outcome.custom ? undefined : outcome.planId,
      recommendedPlanName: outcome.custom ? undefined : findPlan(outcome.planId)?.name,
    };
    await submitLead(payload);
    setSubmitting(false);
    setScreen('business-result');
  }

  async function requestCallback() {
    setSubmitting(true);
    await submitLead({
      audience: audience ?? 'personal',
      answers:
        audience === 'personal'
          ? { usage: usage ?? '', hasPhone: hasPhone ?? '' }
          : { seats: seats ?? '', pbxOwnership: pbxOwnership ?? '', volume: volume ?? '' },
      name,
      email,
      phone,
      company: audience === 'business' ? company : undefined,
      consent,
      outcome: 'callback',
    });
    setSubmitting(false);
    setCallbackRequested(true);
    setScreen('callback-confirmed');
  }

  const stepIndex = audience === 'business' ? BUSINESS_STEP_INDEX[screen] : PERSONAL_STEP_INDEX[screen];
  const totalSteps = audience === 'business' ? 5 : 4;
  const showProgress = screen !== 'audience' && screen !== 'callback-confirmed';

  return (
    <div className="mx-auto max-w-xl">
      {showProgress && (
        <div className="mb-6 flex items-center gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full ${i < stepIndex ? 'bg-ember-500' : 'bg-navy-100'}`} />
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-navy-900/10 bg-white p-6 shadow-card sm:p-8">
        {screen === 'audience' && (
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-navy-900">What are you looking for?</h1>
            <p className="mt-2 text-navy-700">A couple of quick questions, then we&apos;ll point you at the right plan.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => chooseAudience('personal')}
                className="rounded-2xl border-2 border-navy-900/10 p-6 text-left transition hover:border-ember-500 hover:bg-ember-500/5"
              >
                <span className="text-lg font-bold text-navy-900">A home phone</span>
                <p className="mt-1 text-sm text-navy-700">For myself or my household</p>
              </button>
              <button
                type="button"
                onClick={() => chooseAudience('business')}
                className="rounded-2xl border-2 border-navy-900/10 p-6 text-left transition hover:border-ember-500 hover:bg-ember-500/5"
              >
                <span className="text-lg font-bold text-navy-900">For my business</span>
                <p className="mt-1 text-sm text-navy-700">A team, an office, or a company line</p>
              </button>
            </div>
          </div>
        )}

        {screen === 'personal-usage' && (
          <QuestionStep
            question="How will you mostly use it?"
            options={[
              { value: 'light', label: 'Light or occasional use' },
              { value: 'regular', label: 'Regular calling' },
              { value: 'unlimited', label: 'I talk a lot — want unlimited' },
            ]}
            onSelect={(v: PersonalUsage) => {
              setUsage(v);
              setScreen('personal-phone');
            }}
          />
        )}

        {screen === 'personal-phone' && (
          <QuestionStep
            question="Do you already have a cordless phone you'd like to use?"
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: "No, I'll use the app" },
            ]}
            onSelect={(v: HasPhone) => {
              setHasPhone(v);
              setScreen('personal-contact');
            }}
          />
        )}

        {screen === 'personal-contact' && (
          <ContactForm
            name={name}
            email={email}
            phone={phone}
            consent={consent}
            onName={setName}
            onEmail={setEmail}
            onPhone={setPhone}
            onConsent={setConsent}
            submitting={submitting}
            valid={contactValid}
            onSubmit={submitPersonal}
          />
        )}

        {screen === 'personal-result' && (
          <PersonalResult
            usage={usage ?? 'light'}
            hasPhone={hasPhone}
            onCallback={requestCallback}
            submitting={submitting}
          />
        )}

        {screen === 'business-seats' && (
          <QuestionStep
            question="How many people need their own extension?"
            options={[
              { value: 'justme', label: 'Just me' },
              { value: '2-5', label: '2–5 people' },
              { value: '6-25', label: '6–25 people' },
              { value: '26-50', label: '26–50 people' },
              { value: '50+', label: '50+ people' },
            ]}
            onSelect={(v: BizSeats) => {
              setSeats(v);
              setScreen('business-pbx');
            }}
          />
        )}

        {screen === 'business-pbx' && (
          <QuestionStep
            question="Do you already have your own phone system (PBX)?"
            options={[
              { value: 'has-pbx', label: 'Yes, I just need calling capacity' },
              { value: 'no-pbx', label: 'No, I need the full system' },
              { value: 'not-sure', label: 'Not sure' },
            ]}
            onSelect={(v: PbxOwnership) => {
              setPbxOwnership(v);
              setScreen('business-volume');
            }}
          />
        )}

        {screen === 'business-volume' && (
          <QuestionStep
            question="Roughly how many calls happen at once during busy periods?"
            options={[
              { value: '1-2', label: '1–2 at once' },
              { value: '3-4', label: '3–4 at once' },
              { value: '5-6', label: '5–6 at once' },
              { value: '7+', label: '7+ at once' },
            ]}
            onSelect={(v: CallVolume) => {
              setVolume(v);
              setScreen('business-contact');
            }}
          />
        )}

        {screen === 'business-contact' && (
          <ContactForm
            name={name}
            email={email}
            phone={phone}
            company={company}
            onCompany={setCompany}
            consent={consent}
            onName={setName}
            onEmail={setEmail}
            onPhone={setPhone}
            onConsent={setConsent}
            submitting={submitting}
            valid={contactValid}
            onSubmit={submitBusiness}
          />
        )}

        {screen === 'business-result' && (
          <BusinessResult outcome={computeBusinessOutcome()} onCallback={requestCallback} submitting={submitting} />
        )}

        {screen === 'callback-confirmed' && (
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold text-navy-900">Thanks — we&apos;ll be in touch shortly</h2>
            <p className="mt-2 text-navy-700">
              {callbackRequested
                ? "We've got your details and someone from our team will reach out soon."
                : 'Someone from our team will reach out soon.'}
            </p>
            <Link href="/" className="mt-6 inline-block text-sm font-semibold text-ember-600 hover:text-ember-500">
              Back to kiatri.co.za
            </Link>
          </div>
        )}
      </div>

      {screen !== 'audience' && screen !== 'callback-confirmed' && !screen.endsWith('result') && (
        <button type="button" onClick={reset} className="mt-4 text-sm font-medium text-navy-500 hover:text-navy-700">
          Start over
        </button>
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
    <div className="text-center">
      <h2 className="font-display text-lg font-bold text-navy-900">{question}</h2>
      <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
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

function ContactForm({
  name,
  email,
  phone,
  company,
  consent,
  onName,
  onEmail,
  onPhone,
  onCompany,
  onConsent,
  submitting,
  valid,
  onSubmit,
}: {
  name: string;
  email: string;
  phone: string;
  company?: string;
  consent: boolean;
  onName: (v: string) => void;
  onEmail: (v: string) => void;
  onPhone: (v: string) => void;
  onCompany?: (v: string) => void;
  onConsent: (v: boolean) => void;
  submitting: boolean;
  valid: boolean;
  onSubmit: () => void;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (valid && !submitting) onSubmit();
      }}
    >
      <h2 className="font-display text-lg font-bold text-navy-900">Almost done — how can we reach you?</h2>
      <div className="mt-5 space-y-3">
        <input
          type="text"
          required
          placeholder="Full name"
          value={name}
          onChange={(e) => onName(e.target.value)}
          className="w-full rounded-xl border border-navy-900/15 px-4 py-3 text-sm text-navy-900 outline-none focus:border-ember-500"
        />
        <input
          type="email"
          required
          placeholder="Email address"
          value={email}
          onChange={(e) => onEmail(e.target.value)}
          className="w-full rounded-xl border border-navy-900/15 px-4 py-3 text-sm text-navy-900 outline-none focus:border-ember-500"
        />
        <input
          type="tel"
          required
          placeholder="Phone number"
          value={phone}
          onChange={(e) => onPhone(e.target.value)}
          className="w-full rounded-xl border border-navy-900/15 px-4 py-3 text-sm text-navy-900 outline-none focus:border-ember-500"
        />
        {onCompany && (
          <input
            type="text"
            required
            placeholder="Company name"
            value={company}
            onChange={(e) => onCompany(e.target.value)}
            className="w-full rounded-xl border border-navy-900/15 px-4 py-3 text-sm text-navy-900 outline-none focus:border-ember-500"
          />
        )}
      </div>

      <label className="mt-4 flex items-start gap-2.5 text-sm text-navy-700">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => onConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 flex-none rounded border-navy-900/30 text-ember-500 focus:ring-ember-500"
          required
        />
        <span>I agree to be contacted by kiatri about this enquiry.</span>
      </label>

      <button
        type="submit"
        disabled={!valid || submitting}
        className="mt-6 w-full rounded-full bg-ember-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-ember-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {submitting ? 'Submitting…' : 'Continue'}
      </button>
    </form>
  );
}

function PersonalResult({
  usage,
  hasPhone,
  onCallback,
  submitting,
}: {
  usage: PersonalUsage;
  hasPhone: HasPhone | null;
  onCallback: () => void;
  submitting: boolean;
}) {
  const plan = findPlan(PERSONAL_PLAN_BY_USAGE[usage]);
  if (!plan) return null;

  return (
    <div className="text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-ember-600">Your match</p>
      <h2 className="mt-1 font-display text-2xl font-bold text-navy-900">{plan.name}</h2>
      <p className="mt-2 text-navy-700">{plan.tagline}</p>
      <p className="mt-4 flex items-baseline justify-center gap-1">
        <span className="text-3xl font-extrabold text-navy-900">{formatZAR(plan.priceZAR!)}</span>
        <span className="text-sm text-navy-700">/month</span>
      </p>
      <p className="text-xs text-navy-400">Illustrative — see pricing page for details</p>

      <p className="mx-auto mt-4 max-w-sm text-sm text-navy-700">
        {hasPhone === 'yes'
          ? 'Since you already have a cordless phone, just connect it — see how on our '
          : "You'll call, video, and message straight from our app — no hardware needed. See more on our "}
        <Link href="/voice" className="font-semibold text-ember-600 hover:text-ember-500">
          Home Voice page
        </Link>
        .
      </p>

      <div className="mt-6 space-y-3">
        <CTAButton href={orderProductUrl(plan.whmcsPid!)} external className="w-full">
          Order Now
        </CTAButton>
        <button
          type="button"
          onClick={onCallback}
          disabled={submitting}
          className="w-full rounded-full border border-navy-900/15 px-6 py-3 text-sm font-semibold text-navy-900 transition hover:border-navy-900/40 disabled:opacity-40"
        >
          Not ready to order? Have us call you instead
        </button>
      </div>
    </div>
  );
}

function BusinessResult({
  outcome,
  onCallback,
  submitting,
}: {
  outcome: { custom: true } | { custom: false; planId: string; secondPlanId?: string };
  onCallback: () => void;
  submitting: boolean;
}) {
  if (outcome.custom) {
    return (
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-ember-600">Custom setup</p>
        <h2 className="mt-1 font-display text-2xl font-bold text-navy-900">
          This sounds like a custom setup
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-navy-700">
          One of our team will reach out with a tailored quote — we&apos;ve already got your details.
        </p>
      </div>
    );
  }

  const plan = findPlan(outcome.planId);
  const secondPlan = outcome.secondPlanId ? findPlan(outcome.secondPlanId) : null;
  if (!plan) return null;

  return (
    <div className="text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-ember-600">Your match</p>
      <h2 className="mt-1 font-display text-2xl font-bold text-navy-900">{plan.name}</h2>
      <p className="mt-2 text-navy-700">{plan.tagline}</p>
      <p className="mt-4 flex items-baseline justify-center gap-1">
        <span className="text-3xl font-extrabold text-navy-900">{formatZAR(plan.priceZAR!)}</span>
        <span className="text-sm text-navy-700">/month</span>
      </p>
      <p className="text-xs text-navy-400">Illustrative — see pricing page for details</p>

      <ul className="mx-auto mt-5 max-w-xs space-y-2 text-left text-sm text-navy-800">
        {plan.features.slice(0, 3).map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <CheckIcon className="mt-0.5 h-4 w-4 flex-none text-ember-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 space-y-2">
        <CTAButton href={orderProductUrl(plan.whmcsPid!)} external className="w-full">
          Order {plan.name}
        </CTAButton>
        {secondPlan && (
          <a
            href={orderProductUrl(secondPlan.whmcsPid!)}
            className="block text-center text-xs font-semibold text-ember-600 hover:text-ember-500"
          >
            + Add {secondPlan.name} for calling capacity
          </a>
        )}
        <button
          type="button"
          onClick={onCallback}
          disabled={submitting}
          className="mt-3 w-full rounded-full border border-navy-900/15 px-6 py-3 text-sm font-semibold text-navy-900 transition hover:border-navy-900/40 disabled:opacity-40"
        >
          Not ready to order? Have us call you instead
        </button>
      </div>
    </div>
  );
}
