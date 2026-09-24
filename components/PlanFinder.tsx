'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRightIcon } from './icons';

type Audience = 'business' | 'home' | 'call-center';

const TABS: { id: Audience; label: string }[] = [
  { id: 'business', label: 'Business' },
  { id: 'home', label: 'Home / Solo' },
  { id: 'call-center', label: 'Call Center' },
];

// Kiatri doesn't sell fibre, so there's no address/coverage check to run —
// the quick-start question for a phone system is "how many people". The value
// is the seat/agent ceiling of the bracket; 50+ is past the self-service
// tiers, so it goes to the business team instead of a plan.
const BUSINESS_ACCOUNT_HREF = '/contact?topic=business-account';

const USER_OPTIONS = [
  { value: '5', label: '1–5 users' },
  { value: '10', label: '6–10 users' },
  { value: '25', label: '11–25 users' },
  { value: '50', label: '26–50 users' },
  { value: '50+', label: '50+ users' },
];

const AGENT_OPTIONS = [
  { value: '5', label: '1–5' },
  { value: '10', label: '6–10' },
  { value: '25', label: '11–25' },
  { value: '50', label: '26–50' },
  { value: '50+', label: '50+' },
];

export default function PlanFinder() {
  const router = useRouter();
  const [audience, setAudience] = useState<Audience>('business');
  const [users, setUsers] = useState(USER_OPTIONS[0].value);
  const [agents, setAgents] = useState(AGENT_OPTIONS[0].value);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (audience === 'home') {
      router.push('/voice');
    } else if (audience === 'business') {
      router.push(users === '50+' ? BUSINESS_ACCOUNT_HREF : `/business?users=${users}#voip`);
    } else {
      router.push(agents === '50+' ? BUSINESS_ACCOUNT_HREF : `/call-center?agents=${agents}`);
    }
  }

  const selectClasses =
    'min-h-[44px] w-full rounded-lg bg-navy-100/60 px-3 text-sm font-medium text-navy-900 outline-none focus:ring-2 focus:ring-ember-500 sm:w-auto';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-card">
      <div role="tablist" aria-label="Who is this for?" className="flex rounded-xl bg-navy-100 p-1 text-sm font-semibold">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={audience === tab.id}
            onClick={() => setAudience(tab.id)}
            className={`min-h-[44px] flex-1 rounded-lg px-2 py-2 transition sm:px-4 ${
              audience === tab.id ? 'bg-white text-navy-900 shadow-sm' : 'text-navy-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex flex-1 flex-col gap-2 px-2 py-1 sm:flex-row sm:items-center sm:gap-3 sm:px-3">
          {audience === 'home' && (
            <span className="text-sm text-navy-700">
              A home line on pay-as-you-go: top up anytime, no surprise bills.
            </span>
          )}
          {audience === 'business' && (
            <>
              <label htmlFor="finder-users" className="text-sm text-navy-700">
                How many users need an extension?
              </label>
              <select
                id="finder-users"
                value={users}
                onChange={(event) => setUsers(event.target.value)}
                className={selectClasses}
              >
                {USER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </>
          )}
          {audience === 'call-center' && (
            <>
              <label htmlFor="finder-agents" className="text-sm text-navy-700">
                How many agents?
              </label>
              <select
                id="finder-agents"
                value={agents}
                onChange={(event) => setAgents(event.target.value)}
                className={selectClasses}
              >
                {AGENT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>

        <button
          type="submit"
          aria-label="Find my plan"
          className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-ember-500 text-white transition hover:bg-ember-600"
        >
          <ArrowRightIcon className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
}
