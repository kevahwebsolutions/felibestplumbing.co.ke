'use client';

import * as React from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import type { Img } from '@/lib/images';
import { Reveal } from '@/components/motion/reveal';

export function ServiceGallery({ images, columns = 3 }: { images: Img[]; columns?: 3 | 4 }) {
  const [index, setIndex] = React.useState(-1);
  return (
    <>
      <ul className={`grid grid-cols-2 gap-4 sm:gap-6 ${columns === 4 ? 'lg:grid-cols-4' : 'md:grid-cols-3'}`}>
        {images.map((im, i) => (
          <Reveal as="li" key={im.src} delay={(i % 3) * 0.06}>
            <button type="button" onClick={() => setIndex(i)} aria-label={`Open photo ${i + 1} of ${images.length}`} className="clay-card clay-card-hover block w-full overflow-hidden !rounded-[28px] p-1.5">
              <span className="relative block aspect-[4/3] overflow-hidden rounded-[22px]">
                <Image src={im.src} alt={`${im.alt} (photo ${i + 1})`} fill sizes="(min-width:1024px) 30vw, 50vw" className="object-cover transition-transform duration-500 hover:scale-105" />
              </span>
            </button>
          </Reveal>
        ))}
      </ul>
      <Lightbox open={index >= 0} close={() => setIndex(-1)} index={index} slides={images.map((im) => ({ src: im.src, width: im.w, height: im.h, alt: im.alt }))} controller={{ closeOnBackdropClick: true }} />
    </>
  );
}
