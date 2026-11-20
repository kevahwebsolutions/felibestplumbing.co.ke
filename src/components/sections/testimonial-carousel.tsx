'use client';

import * as React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { TESTIMONIALS } from '@/data/content';
import { cn } from '@/lib/utils';

export function TestimonialCarousel() {
  const reduce = useReducedMotion();
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: 'start', slidesToScroll: 1 }, reduce ? [] : [Autoplay({ delay: 6500, stopOnInteraction: true, stopOnMouseEnter: true })]);
  const [index, setIndex] = React.useState(0);
  React.useEffect(() => {
    if (!embla) return;
    const on = () => setIndex(embla.selectedScrollSnap());
    on();
    embla.on('select', on);
    return () => { embla.off('select', on); };
  }, [embla]);
  return (
    <div className="relative" role="region" aria-roledescription="carousel" aria-label="Customer testimonials">
      <div className="overflow-hidden px-1 pb-10 pt-2" ref={emblaRef}>
        <div className="flex">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="min-w-0 shrink-0 grow-0 basis-full pl-5 md:basis-1/2 lg:basis-1/3" role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${TESTIMONIALS.length}`}>
              <figure className="fp-card flex h-full flex-col gap-4 p-7">
                <span className="fp-icon !size-12"><Quote className="size-6" aria-hidden /></span>
                <div className="flex gap-1 text-accent" role="img" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }, (_, s) => <Star key={s} className="size-5 fill-current" aria-hidden />)}
                </div>
                <figcaption className="font-heading text-2xl font-bold text-ink">{t.title}</figcaption>
                <blockquote className="flex-1 text-body">{t.text}</blockquote>
                <p className="font-bold text-brand">- {t.name}, {t.role}</p>
              </figure>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <button type="button" onClick={() => embla?.scrollPrev()} aria-label="Previous testimonial" className="fp-chip !min-h-12 w-12 justify-center !px-0"><ChevronLeft className="size-5" aria-hidden /></button>
        <div className="flex gap-2" role="tablist" aria-label="Choose testimonial">
          {TESTIMONIALS.map((_, i) => (
            <button key={i} type="button" role="tab" aria-selected={i === index} aria-label={`Testimonial ${i + 1}`} onClick={() => embla?.scrollTo(i)} className="grid size-11 place-items-center">
              <span className={cn('block h-3 rounded-full transition-all', i === index ? 'w-8 bg-brand-soft' : 'w-3 bg-line-strong')} />
            </button>
          ))}
        </div>
        <button type="button" onClick={() => embla?.scrollNext()} aria-label="Next testimonial" className="fp-chip !min-h-12 w-12 justify-center !px-0"><ChevronRight className="size-5" aria-hidden /></button>
      </div>
    </div>
  );
}
