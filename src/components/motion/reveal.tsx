import * as React from 'react';

/*
  Scroll-triggered fade and scale-up done in pure CSS (animation-timeline: view()), so these
  wrappers cost no JavaScript. Browsers without support, and reduced-motion users, get static layouts.
*/
type Tag = 'div' | 'section' | 'li' | 'article' | 'ul' | 'ol';

export function Reveal({ children, delay = 0, className, as = 'div' }: { children: React.ReactNode; delay?: number; y?: number; scale?: number; className?: string; as?: 'div' | 'section' | 'li' | 'article' }) {
  const Comp = as as Tag;
  return <Comp className={`fp-reveal ${className ?? ''}`} style={delay ? ({ animationDelay: `${delay}s` } as React.CSSProperties) : undefined}>{children}</Comp>;
}

export function Stagger({ children, className, as = 'div' }: { children: React.ReactNode; className?: string; as?: 'div' | 'ul' | 'ol' }) {
  const Comp = as as Tag;
  return <Comp className={className}>{children}</Comp>;
}

export function StaggerItem({ children, className, as = 'div' }: { children: React.ReactNode; className?: string; as?: 'div' | 'li' | 'article' }) {
  const Comp = as as Tag;
  return <Comp className={`fp-reveal ${className ?? ''}`}>{children}</Comp>;
}
