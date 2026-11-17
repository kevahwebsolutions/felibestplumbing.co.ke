'use client';

import * as React from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

/** Animated number that counts up once when it scrolls into view. */
export function CountUp({ to, suffix = '', prefix = '', duration = 1.6, format }: { to: number; suffix?: string; prefix?: string; duration?: number; format?: (n: number) => string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();
  const fmt = React.useMemo(() => format ?? ((n: number) => Math.round(n).toLocaleString('en-KE')), [format]);
  const [value, setValue] = React.useState(to);
  React.useEffect(() => {
    if (reduce || !inView) return;
    const controls = animate(0, to, { duration, ease: [0.22, 1, 0.36, 1], onUpdate: setValue });
    return () => controls.stop();
  }, [inView, to, duration, reduce]);
  return (
    <span ref={ref}>
      <span className="sr-only">{`${prefix}${fmt(to)}${suffix}`}</span>
      <span aria-hidden>
        {prefix}
        {fmt(value)}
        {suffix}
      </span>
    </span>
  );
}
