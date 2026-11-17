'use client';

import * as React from 'react';
import { ServiceCard } from './common';
import { getService, type Service } from '@/data/services';

export const HOME_SERVICE_GROUPS: { label: string; slugs: string[] }[] = [
  { label: 'Emergency', slugs: ['emergency-plumbing', 'burst-pipes-repair', 'blocked-toilet-repair', 'sewer-smell-removal'] },
  { label: 'Repairs', slugs: ['leaking-taps-and-mixers', 'low-water-pressure', 'sink-and-tap-repair', 'drain-lines'] },
  { label: 'Installations', slugs: ['piping-and-repiping', 'tank-installation-and-repair', 'shower-head-installation', 'gutter-installations'] },
  { label: 'Bathrooms and heating', slugs: ['bathroom-renovations', 'solar-water-heater', 'electric-instant-shower', 'glass-shower-cubicles'] },
  { label: 'Commercial', slugs: ['commercial-plumbing', 'fire-and-safety', 'sump-pump-repair', 'plumbing-consultation'] },
];

/** Services grouped by need. Radio-style tab group, keyboard operable. */
export function ServiceTabs() {
  const [active, setActive] = React.useState(0);
  const group = HOME_SERVICE_GROUPS[active]!;
  const items = group.slugs.map((s) => getService(s)).filter(Boolean) as Service[];
  return (
    <div>
      <div role="group" aria-label="Service categories" className="mb-8 flex flex-wrap justify-center gap-2">
        {HOME_SERVICE_GROUPS.map((g, i) => (
          <button key={g.label} type="button" className="fp-chip" aria-pressed={i === active} onClick={() => setActive(i)}>
            {g.label}
          </button>
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" aria-live="polite">
        {items.map((s) => <ServiceCard key={s.slug} s={s} sizes="(min-width:1024px) 24vw, (min-width:640px) 45vw, 92vw" />)}
      </div>
    </div>
  );
}
