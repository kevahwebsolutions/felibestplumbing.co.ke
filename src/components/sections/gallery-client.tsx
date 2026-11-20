'use client';

import * as React from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import type { GalleryItem } from '@/data/gallery';

const STEP = 24;

export function GalleryClient({ items, categories }: { items: GalleryItem[]; categories: string[] }) {
  const [cat, setCat] = React.useState('All');
  const [shown, setShown] = React.useState(STEP);
  const [index, setIndex] = React.useState(-1);
  const filtered = React.useMemo(() => (cat === 'All' ? items : items.filter((i) => i.category === cat)), [items, cat]);
  const visible = filtered.slice(0, shown);
  return (
    <>
      <div className="mb-10 flex flex-wrap justify-center gap-3" role="group" aria-label="Filter by category">
        {categories.map((c) => (
          <button key={c} type="button" className="fp-chip" aria-pressed={cat === c} onClick={() => { setCat(c); setShown(STEP); }}>
            {c}
          </button>
        ))}
      </div>
      <p className="mb-6 text-center font-semibold text-ink-muted" aria-live="polite">{filtered.length} photos</p>
      <motion.ul layout className="columns-2 gap-4 sm:gap-6 md:columns-3 lg:columns-4 [&>li]:mb-4 sm:[&>li]:mb-6">
        <AnimatePresence mode="popLayout">
          {visible.map((im, i) => (
            <motion.li key={im.src} layout initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.35 }} className="break-inside-avoid">
              <button type="button" onClick={() => setIndex(i)} aria-label={`Open photo: ${im.alt}`} className="fp-card fp-card-hover block w-full overflow-hidden rounded-lg p-1.5">
                <Image src={im.src} alt={im.alt} width={im.w} height={im.h} sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw" className="h-auto w-full rounded-md" loading={i < 8 ? 'eager' : 'lazy'} />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      {shown < filtered.length ? <div className="mt-10 text-center"><Button variant="blue" size="lg" onClick={() => setShown((s) => s + STEP)}>Load more photos</Button></div> : null}
      <Lightbox open={index >= 0} close={() => setIndex(-1)} index={index} plugins={[Captions]} slides={visible.map((im) => ({ src: im.src, width: im.w, height: im.h, alt: im.alt, title: im.category }))} controller={{ closeOnBackdropClick: true }} />
    </>
  );
}
