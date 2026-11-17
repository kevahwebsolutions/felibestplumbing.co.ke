import * as React from 'react';
import {
  Bath, Building2, CloudRain, Cylinder, Droplets, Flame, Gauge, House, MessageSquareText, PanelTop, Pipette, ShieldCheck, ShowerHead,
  Siren, Sofa, Sun, Toilet, Waves, Wind, Wrench, Zap, ClipboardList, CookingPot, Drill,
} from 'lucide-react';
import type { IconKey } from '@/data/services';
import { cn } from '@/lib/utils';

const MAP: Record<IconKey, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  drain: Waves, siren: Siren, bath: Bath, gutter: CloudRain, glass: PanelTop, pipe: Pipette, shower: ShowerHead, sink: CookingPot,
  gauge: Gauge, house: House, building: Building2, consult: ClipboardList, pump: Drill, toilet: Toilet, tap: Droplets, burst: Flame,
  smell: Wind, bolt: Zap, sun: Sun, tank: Cylinder, sofa: Sofa, shield: ShieldCheck, wrench: Wrench, droplet: Droplets,
};

export const ICON_FALLBACK = MessageSquareText;

const TONES = {
  blue: '',
  orange: 'clay-icon-orange',
  navy: '[background:radial-gradient(circle_at_30%_25%,var(--color-navy-600),var(--color-navy-900)_75%)]',
  sky: '[background:radial-gradient(circle_at_30%_25%,#fff,var(--color-sky-400)_80%)] !text-navy-800',
} as const;

/** 3D clay icon bubble: gradient sphere with inner highlight and shade. */
export function ClayIcon({ name, size = 64, tone = 'blue', className }: { name: IconKey; size?: number; tone?: keyof typeof TONES; className?: string }) {
  const Icon = MAP[name] ?? Wrench;
  return (
    <span className={cn('clay-icon', TONES[tone], className)} style={{ width: size, height: size }} aria-hidden>
      <Icon className="drop-shadow-[0_3px_3px_rgb(6_31_61/0.45)]" strokeWidth={2.2} {...({ style: { width: size * 0.5, height: size * 0.5 } } as object)} />
    </span>
  );
}

export function toneForGroup(group: string): keyof typeof TONES {
  switch (group) {
    case 'Emergency and repairs': return 'orange';
    case 'Drains and sewer': return 'navy';
    case 'Bathrooms and showers': return 'blue';
    case 'Water systems': return 'sky';
    default: return 'blue';
  }
}
