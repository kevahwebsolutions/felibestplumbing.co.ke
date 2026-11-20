'use client';

import * as React from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

/** Blue water drop: used only as the logo mark and tiny accents. */
export function DropMark({ className, size = 20 }: { className?: string; size?: number }) {
  return (
    <svg className={className} width={size} height={size * 1.25} viewBox="0 0 24 30" aria-hidden fill="none">
      <path d="M12 1.500C12 1.500 3 12 3 19a9 9 0 0 0 18 0C21 12 12 1.500 12 1.500Z" className="fill-sky" />
      <path d="M8 19c0-3 1.500-6 3.500-8.500" stroke="#fff" strokeOpacity={0.8} strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

/** Thin animated flowing-water line used as a divider. Static for reduced-motion users (CSS). */
export function WaterLine({ className }: { className?: string }) {
  return <div aria-hidden className={cn('water-line', className)} />;
}

/** Gate-valve wheel node. The wheel turns when the parent has the `group` class and is hovered. */
export function ValveNode({ label, size = 64, className }: { label: React.ReactNode; size?: number; className?: string }) {
  return (
    <span className={cn('relative inline-grid place-items-center', className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 64 64" width={size} height={size} className="absolute inset-0 transition-transform duration-500 group-hover:rotate-90 motion-reduce:transition-none" aria-hidden fill="none">
        <circle cx={32} cy={32} r={29} className="fill-brand stroke-copper" strokeWidth={3} />
        <path d="M32 3V12M32 52V61M3 32H12M52 32H61M11.500 11.500 18 18M46 46l6.500 6.500M52.500 11.500 46 18M18 46l-6.500 6.500" className="stroke-sky-soft" strokeWidth={3.500} strokeLinecap="round" />
      </svg>
      <span className="relative font-heading text-2xl font-bold text-on-brand">{label}</span>
    </span>
  );
}

/**
 * A pipe that draws itself as the section scrolls into view (SVG pathLength tied to scroll).
 * `orientation` picks a horizontal or vertical run that stretches to its container.
 */
export function PipeRun({ orientation = 'h', className }: { orientation?: 'h' | 'v'; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 90%', 'end 55%'] });
  const spring = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const h = orientation === 'h';
  const d = h ? 'M0 5H100' : 'M5 0V100';
  return (
    <div ref={ref} aria-hidden className={cn(className)}>
    <svg className="size-full overflow-visible" viewBox={h ? '0 0 100 10' : '0 0 10 100'} preserveAspectRatio="none">
      <path d={d} className="stroke-line" strokeWidth={8} vectorEffect="non-scaling-stroke" fill="none" />
      <motion.path d={d} className="stroke-brand" strokeWidth={4} vectorEffect="non-scaling-stroke" fill="none" style={reduce ? undefined : { pathLength: spring }} />
    </svg>
    </div>
  );
}

/** A short vertical pipe with a copper coupling that links two sections and draws when it enters the viewport. */
export function PipeConnector({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className={cn('pointer-events-none relative mx-auto h-20 w-4', className)}>
      <svg viewBox="0 0 10 100" className="size-full overflow-visible" preserveAspectRatio="none" fill="none">
        <path d="M5 0V100" className="stroke-line" strokeWidth={10} vectorEffect="non-scaling-stroke" />
        <motion.path
          d="M5 0V100"
          className="stroke-brand"
          strokeWidth={5}
          vectorEffect="non-scaling-stroke"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        />
      </svg>
      <span className="absolute left-1/2 top-1/2 h-3 w-6 -translate-x-1/2 -translate-y-1/2 rounded-sm border border-surface bg-copper" />
    </div>
  );
}

export function SectionHeading({ eyebrow, title, intro, align = 'center', as: Tag = 'h2', className }: { eyebrow?: string; title: React.ReactNode; intro?: React.ReactNode; align?: 'center' | 'left'; as?: 'h1' | 'h2' | 'h3'; className?: string }) {
  return (
    <div className={cn('mb-10 max-w-3xl md:mb-14', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
      <Tag className="text-4xl font-bold leading-[1.02] sm:text-5xl md:text-6xl">{title}</Tag>
      {intro ? <p className="mt-4 text-lg text-ink-muted">{intro}</p> : null}
    </div>
  );
}
