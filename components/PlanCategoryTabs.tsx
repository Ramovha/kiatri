'use client';

import { useEffect, useState } from 'react';
import { Plan } from '@/lib/products';
import PricingCard from './PricingCard';
import ChannelVisualizer from './ChannelVisualizer';
import { parseChannelCount } from '@/lib/format';

export interface PlanCategory {
  id: string;
  label: string;
  description: string;
  plans: Plan[];
  // Shows the interactive channels-vs-seats widget below this category's
  // cards, using the given plan's capacity as the channel count — only set
  // for SIP Trunk Plans and Line Plans, where the channels/seats
  // distinction genuinely confuses people.
  visualizerPlan?: Plan;
}

// A pill-style segmented switcher (one category visible at a time) instead
// of stacking every product line on the page — keeps the page short while
// still showing each plan as one self-contained card.
export default function PlanCategoryTabs({ categories }: { categories: PlanCategory[] }) {
  const [activeId, setActiveId] = useState(categories[0]?.id);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  // Deep-linking: #trunks (etc.) on whichever page renders this component
  // preselects that tab instead of just scrolling past whichever tab
  // happens to be first — used by links from the homepage, footer, and
  // other pages that point at one specific category (currently /business).
  useEffect(() => {
    // ?users=5|10|25|50 (from the homepage plan finder) highlights the
    // matching PBX tier and opens the Cloud PBX tab; anything else is ignored.
    const users = new URLSearchParams(window.location.search).get('users');
    const match = users && ['5', '10', '25', '50'].includes(users) ? `pbx-${users}` : null;
    const matchCategory = match ? categories.find((category) => category.plans.some((plan) => plan.id === match)) : undefined;
    if (match && matchCategory) {
      setHighlightId(match);
      setActiveId(matchCategory.id);
      document.getElementById('plans')?.scrollIntoView();
    }

    const syncHash = () => {
      let hash = window.location.hash.replace('#', '');
      // Old links to #voip land on the Cloud PBX tab; tidy the address bar too.
      if (hash === 'voip') {
        hash = 'cloud-pbx';
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#cloud-pbx`);
      }
      if (categories.some((category) => category.id === hash)) {
        setActiveId(hash);
        // The hash (e.g. "#trunks") isn't a real DOM id anywhere on the page —
        // it only drives which tab is selected — so the browser's own
        // hash-scroll won't land here on its own. Scroll it into view manually.
        document.getElementById('plans')?.scrollIntoView();
      }
    };
    syncHash();
    // Links to another tab from elsewhere on the same page (footer, menus).
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
    // Set up once on mount; later hash changes are handled by the listener above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = categories.find((category) => category.id === activeId) ?? categories[0];

  if (!active) return null;

  return (
    <div>
      <div className="flex justify-center">
        <div className="inline-flex flex-wrap justify-center gap-1 rounded-full border border-navy-900/10 bg-navy-950 p-1 shadow-card">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveId(category.id)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                category.id === active.id ? 'bg-white text-navy-900' : 'text-navy-200 hover:text-white'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mx-auto mt-6 max-w-2xl text-center text-navy-700">{active.description}</p>

      <div
        className={`mt-8 grid gap-6 ${
          active.plans.length >= 5
            ? 'md:grid-cols-3 lg:grid-cols-5'
            : active.plans.length === 4
              ? 'md:grid-cols-4'
              : 'md:grid-cols-3'
        }`}
      >
        {active.plans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} highlighted={plan.id === highlightId} />
        ))}
      </div>

      {active.visualizerPlan && (
        <div className="mx-auto mt-8 max-w-xl">
          <ChannelVisualizer
            channels={parseChannelCount(active.visualizerPlan.capacity)}
            label={active.visualizerPlan.name}
          />
        </div>
      )}
    </div>
  );
}
