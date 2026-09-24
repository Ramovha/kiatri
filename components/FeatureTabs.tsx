'use client';

import { ReactNode, useState } from 'react';
import { CheckIcon } from './icons';

export interface FeatureTab {
  id: string;
  label: string;
  title: string;
  description: string;
  bullets: string[];
  // Replaces the default abstract panel with a page-specific visual.
  visual?: ReactNode;
  // Optional link shown under the bullets.
  link?: { href: string; label: string };
}

// A tabbed feature showcase for the platform capabilities behind a Kiatri
// account (client portal, voicemail, caller ID, etc.) — structurally similar
// to how a lot of hosted-PBX vendors lay out a feature tour, but with an
// original abstract "panel" mockup on the right instead of a real product
// screenshot, since we don't have (and shouldn't fabricate) one.
export default function FeatureTabs({ tabs }: { tabs: FeatureTab[] }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id);
  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  if (!active) return null;

  return (
    <div>
      <div className="flex flex-wrap gap-2 rounded-2xl bg-white/5 p-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveId(tab.id)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              tab.id === active.id ? 'bg-white text-navy-900' : 'text-navy-200 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <h3 className="text-2xl font-bold text-white">{active.title}</h3>
          <p className="mt-3 text-navy-200">{active.description}</p>
          <ul className="mt-5 space-y-2.5 text-sm text-navy-100">
            {active.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2">
                <CheckIcon className="mt-0.5 h-4 w-4 flex-none text-ember-400" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          {active.link && (
            <a href={active.link.href} className="mt-5 inline-block text-sm font-semibold text-ember-400 hover:text-ember-300">
              {active.link.label}
            </a>
          )}
        </div>
        {active.visual ?? <PanelMockup />}
      </div>
    </div>
  );
}

// Original abstract dashboard mockup (skeleton-style blocks) — deliberately
// not a screenshot of any real product, ours or anyone else's.
function PanelMockup() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl">
      <div className="flex items-center gap-1.5 border-b border-navy-900/10 bg-navy-100 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-navy-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-navy-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-navy-300" />
        <span className="ml-3 h-2 w-28 rounded-full bg-navy-300" />
      </div>
      <div className="grid grid-cols-[70px_1fr]">
        <div className="space-y-3 border-r border-navy-900/10 bg-navy-950/[0.03] p-4">
          {[70, 50, 50, 50, 50].map((w, i) => (
            <div key={i} className="h-2 rounded-full bg-navy-200" style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="space-y-4 p-5">
          <div className="h-3 w-1/2 rounded-full bg-navy-900/10" />
          <div className="grid grid-cols-3 gap-3">
            <div className="h-14 rounded-lg bg-ember-500/10" />
            <div className="h-14 rounded-lg bg-navy-900/5" />
            <div className="h-14 rounded-lg bg-navy-900/5" />
          </div>
          <div className="space-y-2">
            {[92, 80, 68, 56].map((w, i) => (
              <div key={i} className="h-2.5 rounded-full bg-navy-900/10" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
