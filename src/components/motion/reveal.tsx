'use client';

import * as React from 'react';
import { animate, motion, useInView, useReducedMotion, type Variants } from 'framer-motion';

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  scale?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'article';
};

/** Scroll-triggered fade and scale-up. Renders a plain element for reduced-motion users. */
export function Reveal({ children, delay = 0, y = 28, scale = 0.97, className, as = 'div' }: RevealProps) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y, scale }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 160, damping: 20 } },
};

export function Stagger({ children, className, as = 'div' }: { children: React.ReactNode; className?: string; as?: 'div' | 'ul' | 'ol' }) {
  const reduce = useReducedMotion();
  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  const Comp = motion[as];
  return (
    <Comp className={className} variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -8% 0px' }}>
      {children}
    </Comp>
  );
}

export function StaggerItem({ children, className, as = 'div' }: { children: React.ReactNode; className?: string; as?: 'div' | 'li' | 'article' }) {
  const reduce = useReducedMotion();
  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  const Comp = motion[as];
  return (
    <Comp className={className} variants={item}>
      {children}
    </Comp>
  );
}

/** Animated number that counts up once when it scrolls into view. */
export function CountUp({ to, suffix = '', prefix = '', duration = 1.6, format }: { to: number; suffix?: string; prefix?: string; duration?: number; format?: (n: number) => string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();
  const fmt = React.useMemo(() => format ?? ((n: number) => Math.round(n).toLocaleString('en-KE')), [format]);
  const [value, setValue] = React.useState(reduce ? to : 0);
  React.useEffect(() => {
    if (reduce) {
      setValue(to);
      return;
    }
    if (!inView) return;
    const controls = animate(0, to, { duration, ease: [0.22, 1, 0.36, 1], onUpdate: setValue });
    return () => controls.stop();
  }, [inView, to, duration, reduce]);
  return (
    <span ref={ref} aria-label={`${prefix}${fmt(to)}${suffix}`}>
      <span aria-hidden>
        {prefix}
        {fmt(value)}
        {suffix}
      </span>
    </span>
  );
}
