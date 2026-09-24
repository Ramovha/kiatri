'use client';

import { useState } from 'react';
import { HandsetIcon } from './icons';

// Makes the channels-vs-seats distinction tangible instead of just
// explained in text — this genuinely confused a technically fluent person
// during internal review, so it's worth a small interactive moment, not
// just another paragraph.
export default function ChannelVisualizer({ channels, label }: { channels: number; label: string }) {
  const [active, setActive] = useState(0);
  const [busy, setBusy] = useState(false);

  function simulateCall() {
    if (active < channels) {
      setActive((n) => n + 1);
      setBusy(false);
    } else {
      setBusy(true);
    }
  }

  function reset() {
    setActive(0);
    setBusy(false);
  }

  return (
    <div className="rounded-2xl border border-navy-900/10 bg-white p-6 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Try it — {label}</p>
      <h4 className="mt-1 font-display text-base font-bold text-navy-900">
        What &ldquo;{channels} channel{channels === 1 ? '' : 's'}&rdquo; actually means
      </h4>
      <p className="mt-1 text-sm text-navy-700">Click to simulate calls coming in at once.</p>

      <div className="mt-5 flex flex-wrap gap-3" role="img" aria-label={`${active} of ${channels} channels in use`}>
        {Array.from({ length: channels }).map((_, i) => (
          <span
            key={i}
            className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 transition-colors ${
              i < active ? 'border-ember-500 bg-ember-500/10 text-ember-600' : 'border-navy-200 text-navy-300'
            }`}
          >
            <HandsetIcon className="h-5 w-5" />
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-4">
        <button
          type="button"
          onClick={simulateCall}
          className="rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-800"
        >
          Simulate a call
        </button>
        {active > 0 && (
          <button type="button" onClick={reset} className="text-sm font-semibold text-navy-500 hover:text-navy-700">
            Reset
          </button>
        )}
      </div>

      {busy ? (
        <p className="mt-4 rounded-lg border border-ember-500/30 bg-ember-500/5 p-3 text-sm text-navy-800">
          <strong className="text-ember-600">Busy.</strong> One more call can&apos;t get through — channels are
          shared across your whole account, not per number. Need more at once? Size up your trunk.
        </p>
      ) : active === channels && channels > 0 ? (
        <p className="mt-4 text-sm text-navy-700">
          All {channels} lines are busy. Click once more to see what the next caller would hit.
        </p>
      ) : null}
    </div>
  );
}
