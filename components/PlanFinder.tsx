'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRightIcon } from './icons';

type Audience = 'home' | 'business';

// Kiatri doesn't sell fibre, so there's no address/coverage check to run —
// the equivalent quick-start question for a phone system is "how many
// people need a line". The tabbed tier browser lives on /business, so every
// option below just deep-links to the right tab there.
const SIZE_OPTIONS = [
  { value: 'small', label: '2–5 people', href: '/business#voip' },
  { value: 'medium', label: '6–15 people', href: '/business#voip' },
  { value: 'large', label: '16+ people', href: '/business#voip' },
];

export default function PlanFinder() {
  const router = useRouter();
  const [audience, setAudience] = useState<Audience>('home');
  const [size, setSize] = useState(SIZE_OPTIONS[0].value);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (audience === 'home') {
      router.push('/voice');
      return;
    }
    const target = SIZE_OPTIONS.find((option) => option.value === size);
    router.push(target ? target.href : '/business#voip');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-card sm:flex-row sm:items-center"
    >
      <div className="flex flex-none rounded-xl bg-navy-100 p-1 text-sm font-semibold">
        <button
          type="button"
          onClick={() => setAudience('home')}
          className={`rounded-lg px-4 py-2 transition ${
            audience === 'home' ? 'bg-white text-navy-900 shadow-sm' : 'text-navy-700'
          }`}
        >
          Home / Solo
        </button>
        <button
          type="button"
          onClick={() => setAudience('business')}
          className={`rounded-lg px-4 py-2 transition ${
            audience === 'business' ? 'bg-white text-navy-900 shadow-sm' : 'text-navy-700'
          }`}
        >
          Business
        </button>
      </div>

      <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2 sm:px-4">
        {audience === 'home' ? (
          <span className="text-sm text-navy-700">A single line for a home office or small setup</span>
        ) : (
          <>
            <span className="hidden text-sm text-navy-700 sm:inline">How many people need a line?</span>
            <select
              value={size}
              onChange={(event) => setSize(event.target.value)}
              className="ml-auto flex-1 bg-transparent text-sm font-medium text-navy-900 outline-none sm:ml-0 sm:flex-none"
              aria-label="Team size"
            >
              {SIZE_OPTIONS.map((option) => (
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
    </form>
  );
}
