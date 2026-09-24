'use client';

import { useState } from 'react';
import { addons } from '@/lib/products';
import { PLAN_FAMILIES, PlanFamily } from '@/lib/addons';
import PillTabs from './PillTabs';
import AddonCard from './AddonCard';

// "Which plan do you have?" — each card below shows whether that addon is
// available, already included, or not available on the chosen plan.
export default function AddonsExplorer() {
  const [family, setFamily] = useState<PlanFamily>('business');

  return (
    <section id="addons" className="scroll-mt-24">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-navy-900">Which plan do you have?</h2>
        <p className="mt-2 text-sm text-navy-700">Pick your plan to see which addons work with it.</p>
      </div>
      <div className="mt-5">
        <PillTabs
          options={PLAN_FAMILIES.map((f) => ({ id: f.family, label: f.label }))}
          activeId={family}
          onChange={(id) => setFamily(id as PlanFamily)}
        />
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {addons.map((addon) => (
          <AddonCard key={addon.id} addon={addon} family={family} />
        ))}
      </div>
    </section>
  );
}
