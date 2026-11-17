'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { PipeRun, ValveNode } from '@/components/plumb/decor';

type Step = { title: string; text: string };

/**
 * How it works as a pipe run with valve nodes: horizontal on desktop, vertical on mobile.
 * The pipe draws as the section scrolls into view.
 */
export function HowItWorks({ steps }: { steps: Step[] }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative">
      <div aria-hidden className="absolute left-0 right-0 top-8 hidden h-3 lg:block">
        <PipeRun orientation="h" tone="dark" className="h-full w-full" />
      </div>
      <div aria-hidden className="absolute bottom-8 left-8 top-8 w-3 -translate-x-1/2 lg:hidden">
        <PipeRun orientation="v" tone="dark" className="h-full w-full" />
      </div>
      <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-6">
        {steps.map((st, i) => (
          <motion.li
            key={st.title}
            className="group relative flex gap-5 lg:flex-col lg:gap-6"
            initial={reduce ? false : { y: 24 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <ValveNode label={i + 1} size={64} className="shrink-0" />
            <div>
              <h3 className="text-2xl font-bold uppercase !text-white">{st.title}</h3>
              <p className="mt-2 text-sky-200">{st.text}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
