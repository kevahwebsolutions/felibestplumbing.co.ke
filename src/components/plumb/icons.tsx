import * as React from 'react';
import {
  Bath, Building2, ClipboardList, CloudRain, CookingPot, Drill, Droplets, House, PanelTop, ShieldCheck, Siren, Sofa, Sun, Toilet, Wind, Zap,
} from 'lucide-react';
import type { IconKey } from '@/data/services';
import { cn } from '@/lib/utils';

/*
  Custom plumbing icon set. One consistent duotone style: white outlines, brand-blue
  (sky) fills and a copper highlight on fittings. Drawn on a 48 x 48 grid.
*/
const W = '#ffffff';
const BLUE = '#51acfb';
const COPPER = '#dba26a';

type G = (p: { cu?: string }) => React.ReactElement;

/** A pipe run: white outline with a blue core, so it reads as a tube. */
function Pipe({ d }: { d: string }) {
  return (
    <g fill="none" strokeLinejoin="round">
      <path d={d} stroke={W} strokeWidth={11} />
      <path d={d} stroke={BLUE} strokeWidth={6} />
    </g>
  );
}
function Nut({ x, y, w, h, cu = COPPER }: { x: number; y: number; w: number; h: number; cu?: string }) {
  return <rect x={x} y={y} width={w} height={h} rx={1.5} fill={cu} stroke={W} strokeWidth={1.5} />;
}

const GLYPHS: Record<string, G> = {
  elbow: ({ cu }) => (<><Pipe d="M7 16H28Q36 16 36 24V41" /><Nut x={3} y={9} w={6} h={14} cu={cu} /><Nut x={29} y={39} w={14} h={6} cu={cu} /></>),
  tee: ({ cu }) => (<><Pipe d="M5 17H43" /><Pipe d="M24 17V40" /><Nut x={2} y={10} w={6} h={14} cu={cu} /><Nut x={40} y={10} w={6} h={14} cu={cu} /><Nut x={17} y={38} w={14} h={6} cu={cu} /></>),
  coupling: ({ cu }) => (
    <>
      <Pipe d="M3 24H45" />
      <rect x={14} y={14} width={20} height={20} rx={3} fill={cu ?? COPPER} stroke={W} strokeWidth={2} />
      <path d="M20 14V34M28 14V34" stroke={W} strokeWidth={1.6} />
    </>
  ),
  valve: ({ cu }) => (
    <>
      <Pipe d="M3 34H45" />
      <path d="M24 26V14" stroke={W} strokeWidth={3} strokeLinecap="round" />
      <rect x={16} y={24} width={16} height={18} rx={2.5} fill={BLUE} stroke={W} strokeWidth={2} />
      <ellipse cx={24} cy={11} rx={12} ry={4.5} fill={cu ?? COPPER} stroke={W} strokeWidth={2} />
    </>
  ),
  tap: () => (
    <>
      <path d="M14 41V19Q14 10 23 10H35V21" fill="none" stroke={W} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 41V19Q14 10 23 10H35V21" fill="none" stroke={BLUE} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 6H22" stroke={COPPER} strokeWidth={4} strokeLinecap="round" />
      <path d="M35 29c-4 5-5 8-5 10a5 5 0 0 0 10 0c0-2-1-5-5-10Z" fill={BLUE} stroke={W} strokeWidth={1.8} />
    </>
  ),
  wrench: () => (
    <path d="M33 5a10 10 0 0 0-9 14L7 36a4.5 4.5 0 0 0 6.400 6.400L30 25a10 10 0 0 0 14-9l-6.500 6.500-5-1-1-5L38 9a10 10 0 0 0-5-4Z" fill={BLUE} stroke={W} strokeWidth={2.2} strokeLinejoin="round" />
  ),
  drain: ({ cu }) => (
    <>
      <circle cx={24} cy={24} r={17} fill={BLUE} stroke={W} strokeWidth={2.2} />
      <circle cx={24} cy={24} r={20.500} fill="none" stroke={cu ?? COPPER} strokeWidth={2} />
      <path d="M13 24H35M24 13V35M16.500 16.500 31.500 31.500M31.500 16.500 16.500 31.500" stroke={W} strokeWidth={2.4} strokeLinecap="round" />
      <circle cx={24} cy={24} r={3.500} fill={W} />
    </>
  ),
  geyser: ({ cu }) => (
    <>
      <path d="M18 9V3M30 9V3" stroke={cu ?? COPPER} strokeWidth={4} strokeLinecap="round" />
      <rect x={11} y={8} width={26} height={34} rx={7} fill={BLUE} stroke={W} strokeWidth={2.2} />
      <path d="M11 17H37" stroke={W} strokeWidth={2} />
      <circle cx={24} cy={27} r={5} fill={W} />
      <path d="M24 27l3-3" stroke="#0c4c93" strokeWidth={2} strokeLinecap="round" />
    </>
  ),
  tank: ({ cu }) => (
    <>
      <path d="M8 14Q24 6 40 14V38a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3Z" fill={BLUE} stroke={W} strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M8 27q4-4 8 0t8 0 8 0 8 0" fill="none" stroke={W} strokeWidth={2.200} strokeLinecap="round" />
      <path d="M40 34H46" stroke={cu ?? COPPER} strokeWidth={4} strokeLinecap="round" />
    </>
  ),
  shower: ({ cu }) => (
    <>
      <path d="M8 18Q8 4 24 4t16 14Z" fill={BLUE} stroke={W} strokeWidth={2.200} strokeLinejoin="round" />
      <circle cx={24} cy={4} r={3.500} fill={cu ?? COPPER} stroke={W} strokeWidth={1.500} />
      <path d="M13 25v6M24 25v10M35 25v6M18.500 37v5M29.500 37v5" stroke={W} strokeWidth={2.600} strokeLinecap="round" />
    </>
  ),
  burst: ({ cu }) => (
    <>
      <Pipe d="M3 34H18" />
      <Pipe d="M30 34H45" />
      <Nut x={16} y={27} w={5} h={14} cu={cu} />
      <Nut x={27} y={27} w={5} h={14} cu={cu} />
      <path d="M24 28V10M19 29 11 14M29 29 37 14" stroke={W} strokeWidth={2.800} strokeLinecap="round" />
      <circle cx={24} cy={6} r={2.500} fill={BLUE} />
      <circle cx={9} cy={10} r={2.500} fill={BLUE} />
      <circle cx={39} cy={10} r={2.500} fill={BLUE} />
    </>
  ),
  gauge: ({ cu }) => (
    <>
      <circle cx={24} cy={24} r={18} fill={BLUE} stroke={W} strokeWidth={2.200} />
      <path d="M10 24h4M34 24h4M24 10v4M14.500 14.500l2.800 2.800M33.500 14.500l-2.800 2.800" stroke={W} strokeWidth={2} strokeLinecap="round" />
      <path d="M24 26 33 15" stroke={W} strokeWidth={3} strokeLinecap="round" />
      <circle cx={24} cy={26} r={3.500} fill={cu ?? COPPER} stroke={W} strokeWidth={1.500} />
    </>
  ),
};

const LUCIDE: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  siren: Siren, bath: Bath, glass: PanelTop, sink: CookingPot, house: House, building: Building2, consult: ClipboardList, pump: Drill,
  toilet: Toilet, smell: Wind, bolt: Zap, sun: Sun, sofa: Sofa, shield: ShieldCheck, droplet: Droplets, gutter: CloudRain,
};

const KEY_TO_GLYPH: Record<IconKey, string> = {
  drain: 'drain', siren: 'siren', bath: 'bath', gutter: 'elbow', glass: 'glass', pipe: 'tee', shower: 'shower', sink: 'sink', gauge: 'gauge', house: 'house',
  building: 'building', consult: 'consult', pump: 'pump', toilet: 'toilet', tap: 'tap', burst: 'burst', smell: 'smell', bolt: 'bolt', sun: 'sun', tank: 'tank',
  sofa: 'sofa', shield: 'shield', wrench: 'wrench', droplet: 'droplet',
};

export type GlyphName = keyof typeof GLYPHS;

/** Bare glyph (no tile). Glyphs are white with copper and sky details, so place them on a brand-coloured tile. */
export function PlumbGlyph({ name, size = 32, className }: { name: IconKey | GlyphName; size?: number; className?: string }) {
  const key = (KEY_TO_GLYPH as Record<string, string>)[name] ?? name;
  const Custom = GLYPHS[key];
  if (Custom) {
    return (
      <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-hidden fill="none">
        <Custom />
      </svg>
    );
  }
  const L = LUCIDE[key] ?? Droplets;
  return <L className={className} strokeWidth={2.100} {...({ style: { width: size, height: size } } as object)} />;
}

const TONES = { blue: '', orange: 'fp-icon-orange', navy: '[background:var(--color-brand-strong)]', sky: '[background:var(--color-brand-soft)]' } as const;

/** Square tile with a plumbing glyph: navy plate with a copper edge. */
export function PlumbIcon({ name, size = 56, tone = 'blue', className }: { name: IconKey | GlyphName; size?: number; tone?: keyof typeof TONES; className?: string }) {
  return (
    <span className={cn('fp-icon', TONES[tone], className)} style={{ width: size, height: size }} aria-hidden>
      <PlumbGlyph name={name} size={Math.round(size * 0.62)} />
    </span>
  );
}

export function toneForGroup(group: string): keyof typeof TONES {
  return group === 'Emergency and repairs' ? 'orange' : 'blue';
}
