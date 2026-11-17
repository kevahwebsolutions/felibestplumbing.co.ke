import * as React from 'react';
import { cn } from '@/lib/utils';

type BubbleSpec = { size: number; left?: string; right?: string; top?: string; bottom?: string; delay?: number; slow?: boolean; opacity?: number };

/** Floating clay bubbles and droplets for hero and section backgrounds. Pure CSS animation. */
export function Bubbles({ items, className }: { items: BubbleSpec[]; className?: string }) {
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {items.map((b, i) => (
        <span
          key={i}
          className={cn('bubble', b.slow ? 'animate-float-slow' : 'animate-float')}
          style={{ width: b.size, height: b.size, left: b.left, right: b.right, top: b.top, bottom: b.bottom, animationDelay: `${b.delay ?? 0}s`, opacity: b.opacity ?? 1 }}
        />
      ))}
    </div>
  );
}

export const HERO_BUBBLES: BubbleSpec[] = [
  { size: 90, left: '4%', top: '18%' },
  { size: 46, left: '14%', top: '62%', delay: 1.4, slow: true },
  { size: 130, right: '6%', top: '8%', delay: 0.6, slow: true },
  { size: 58, right: '30%', bottom: '10%', delay: 2.2 },
  { size: 28, left: '40%', top: '8%', delay: 3 },
  { size: 70, right: '2%', bottom: '24%', delay: 1.1 },
];

export function ClayDrop({ className, size = 220 }: { className?: string; size?: number }) {
  const id = React.useId().replace(/:/g, '');
  return (
    <svg className={className} width={size} height={size * 1.25} viewBox="0 0 200 250" fill="none" aria-hidden>
      <defs>
        <radialGradient id={`d${id}`} cx="32%" cy="30%" r="80%">
          <stop offset="0" stopColor="#d8edff" />
          <stop offset="0.45" stopColor="#51acfb" />
          <stop offset="1" stopColor="#0c4c93" />
        </radialGradient>
        <filter id={`s${id}`} x="-30%" y="-20%" width="160%" height="150%">
          <feDropShadow dx="0" dy="18" stdDeviation="14" floodColor="#0c4c93" floodOpacity="0.4" />
        </filter>
      </defs>
      <path filter={`url(#s${id})`} fill={`url(#d${id})`} d="M100 12C100 12 24 100 24 156a76 76 0 0 0 152 0C176 100 100 12 100 12Z" />
      <path d="M62 150c0-22 14-46 30-68" stroke="#fff" strokeOpacity="0.85" strokeWidth="12" strokeLinecap="round" />
      <ellipse cx="70" cy="188" rx="14" ry="8" fill="#fff" fillOpacity="0.35" transform="rotate(-30 70 188)" />
    </svg>
  );
}

export function ClayWrench({ className, size = 180 }: { className?: string; size?: number }) {
  const id = React.useId().replace(/:/g, '');
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 200 200" fill="none" aria-hidden>
      <defs>
        <linearGradient id={`w${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff8a63" />
          <stop offset="1" stopColor="#bf3208" />
        </linearGradient>
        <filter id={`ws${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="12" stdDeviation="9" floodColor="#8a2406" floodOpacity="0.4" />
        </filter>
      </defs>
      <g filter={`url(#ws${id})`}>
        <path
          d="M142 22a42 42 0 0 0-39 58L30 153a16 16 0 0 0 22 22l73-73a42 42 0 0 0 58-39c0-5-1-9-2-13l-27 27-23-6-6-23 27-27a42 42 0 0 0-10-1Z"
          fill={`url(#w${id})`}
        />
      </g>
      <path d="M46 160l60-60" stroke="#fff" strokeOpacity="0.55" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

/** Wave divider that sits between sections. `from` is the colour above the wave. */
export function WaveDivider({ color = '#e3f1ff', flip = false, animated = true, className }: { color?: string; flip?: boolean; animated?: boolean; className?: string }) {
  const path = 'M0 40 C 180 90 360 0 540 40 C 720 80 900 0 1080 40 C 1260 80 1440 10 1440 40 L1440 120 L0 120 Z';
  const wave = (
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="h-14 sm:h-20 md:h-24" aria-hidden>
      <path d={path} fill={color} />
    </svg>
  );
  return (
    <div aria-hidden className={cn('relative w-full overflow-hidden leading-[0]', flip && 'rotate-180', className)}>
      {animated ? (
        <div className="wave-track">
          {wave}
          {wave}
        </div>
      ) : (
        wave
      )}
    </div>
  );
}

export function SectionHeading({ eyebrow, title, intro, align = 'center', as: Tag = 'h2', className }: { eyebrow?: string; title: React.ReactNode; intro?: React.ReactNode; align?: 'center' | 'left'; as?: 'h1' | 'h2' | 'h3'; className?: string }) {
  return (
    <div className={cn('mb-10 max-w-3xl md:mb-14', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow ? (
        <div className={cn('pipe-heading mb-4', align === 'center' && 'justify-center')}>
          <span className="pipe" />
          <span className="valve" />
          <span className="clay-pill">{eyebrow}</span>
          <span className="valve" />
          <span className="pipe" />
        </div>
      ) : null}
      <Tag className="font-heading text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">{title}</Tag>
      {intro ? <p className="mt-4 text-lg text-muted">{intro}</p> : null}
    </div>
  );
}
