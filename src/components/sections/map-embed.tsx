'use client';

import * as React from 'react';
import { MapPin } from 'lucide-react';

/** Click-to-load map: keeps the heavy Google Maps scripts off the critical path until the visitor asks for them. */
export function MapEmbed({ className = 'h-[360px]' }: { className?: string }) {
  const [on, setOn] = React.useState(false);
  if (on) {
    return <iframe title="Map of Nairobi, Kenya" referrerPolicy="no-referrer-when-downgrade" className={`w-full border-0 ${className}`} src="https://www.google.com/maps?q=Nairobi,+Kenya&output=embed" />;
  }
  return (
    <div className={`bp-grid grid w-full place-items-center bg-surface-alt p-6 text-center ${className}`}>
      <div>
        <MapPin className="mx-auto size-10 text-accent" aria-hidden />
        <p className="mt-3 font-heading text-3xl font-bold uppercase text-ink">Nairobi, Kenya</p>
        <p className="mx-auto mt-1 max-w-xs text-sm text-body">We come to you across Nairobi and nearby. Load the map to see the area.</p>
        <button type="button" onClick={() => setOn(true)} className="fp-button fp-button-outline fp-button-sm mt-4">Load map</button>
      </div>
    </div>
  );
}
