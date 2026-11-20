'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Grid2x2, List, Search, SlidersHorizontal, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button, ButtonLink } from '@/components/ui/button';
import { Dialog, DialogContent, SheetContent } from '@/components/ui/dialog';
import { Input, Select } from '@/components/ui/field';
import { RangeSlider } from '@/components/ui/misc';
import { AddToCartButton, CATEGORY_GLYPH, PriceTag, ProductArt, ProductCard, ProductSkeleton, StockBadge } from './product-parts';
import { PlumbGlyph } from '@/components/plumb/icons';
import { cn, formatKES } from '@/lib/utils';
import type { ProductView } from '@/lib/server/products';

type Cat = { id: number; slug: string; name: string; count: number };
const PAGE = 12;

type Sort = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'name';

function QuickView({ p, onClose }: { p: ProductView | null; onClose: () => void }) {
  return (
    <Dialog open={!!p} onOpenChange={(o) => !o && onClose()}>
      {p ? (
        <DialogContent title={p.name} description={p.categoryName} data-lenis-prevent>
          <div className="mt-5 grid gap-6 md:grid-cols-2">
            <div className="relative aspect-square overflow-hidden rounded-lg border border-line">
              {p.images[0] ? <Image src={p.images[0].url} alt={p.images[0].alt || p.name} fill sizes="(min-width:768px) 380px, 90vw" className="object-cover" /> : <ProductArt category={p.categorySlug} />}
            </div>
            <div className="flex flex-col gap-4">
              <PriceTag p={p} size="lg" />
              <StockBadge stock={p.stock} />
              <p className="line-clamp-6 text-body">{p.description}</p>
              <div className="mt-auto grid gap-3">
                <AddToCartButton product={p} size="lg" className="w-full" />
                <ButtonLink href={`/shop/${p.slug}`} variant="ghost" onClick={onClose}>View full details</ButtonLink>
              </div>
            </div>
          </div>
        </DialogContent>
      ) : null}
    </Dialog>
  );
}

function Filters({ price, setPrice, bounds, tags, tag, setTag }: {
  price: [number, number]; setPrice: (p: [number, number]) => void;
  bounds: [number, number]; tags: string[]; tag: string; setTag: (t: string) => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-1 font-heading text-2xl font-semibold uppercase">Price range</h2>
        <RangeSlider min={bounds[0]} max={bounds[1]} step={50} value={price} onValueChange={(v) => setPrice([v[0]!, v[1]!])} minStepsBetweenThumbs={1} />
        <p className="mt-1 flex justify-between text-sm font-bold text-brand"><span>{formatKES(price[0])}</span><span>{formatKES(price[1])}</span></p>
      </div>
      {tags.length ? (
        <div>
          <h2 className="mb-3 font-heading text-2xl font-semibold uppercase">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <button key={t} type="button" className="fp-chip text-sm" aria-pressed={tag === t} onClick={() => setTag(tag === t ? '' : t)}>{t}</button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function ShopClient({ products, categories, initialCategory = '' }: { products: ProductView[]; categories: Cat[]; initialCategory?: string }) {
  const prices = products.map((p) => p.finalPrice);
  const bounds: [number, number] = [Math.floor(Math.min(...prices, 0) / 50) * 50, Math.ceil(Math.max(...prices, 50) / 50) * 50];
  const [mounted, setMounted] = React.useState(false);
  const [q, setQ] = React.useState('');
  const [sort, setSort] = React.useState<Sort>('featured');
  const [category, setCategory] = React.useState(initialCategory);
  const [price, setPrice] = React.useState<[number, number]>(bounds);
  const [tag, setTag] = React.useState('');
  const [view, setView] = React.useState<'grid' | 'list'>('grid');
  const [shown, setShown] = React.useState(PAGE);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [quick, setQuick] = React.useState<ProductView | null>(null);
  const [sheet, setSheet] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const allTags = React.useMemo(() => Array.from(new Set(products.flatMap((p) => p.tags))).sort(), [products]);
  const filtered = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = products.filter((p) =>
      (!category || p.categorySlug === category) && p.finalPrice >= price[0] && p.finalPrice <= price[1] && (!tag || p.tags.includes(tag)) &&
      (!needle || `${p.name} ${p.categoryName} ${p.tags.join(' ')} ${p.sku}`.toLowerCase().includes(needle)),
    );
    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'price-asc': return a.finalPrice - b.finalPrice;
        case 'price-desc': return b.finalPrice - a.finalPrice;
        case 'name': return a.name.localeCompare(b.name);
        case 'newest': return b.createdAt - a.createdAt || b.id - a.id;
        default: return Number(b.featured) - Number(a.featured) || Number(b.isNew) - Number(a.isNew) || a.id - b.id;
      }
    });
    return list;
  }, [products, q, category, price, tag, sort]);

  React.useEffect(() => setShown(PAGE), [q, category, price, tag, sort]);
  const visible = filtered.slice(0, shown);
  const filterProps = { price, setPrice, bounds, tags: allTags, tag, setTag };
  const activeFilters = (category ? 1 : 0) + (tag ? 1 : 0) + (price[0] !== bounds[0] || price[1] !== bounds[1] ? 1 : 0) + (q ? 1 : 0);
  const reset = () => { setQ(''); setCategory(''); setTag(''); setPrice(bounds); setSort('featured'); };

  return (
    <div>
      <nav aria-label="Product categories" className="mb-8 -mx-1 overflow-x-auto pb-2">
        <ul className="flex min-w-max gap-2 px-1">
          {[{ id: 0, slug: '', name: 'All products', count: products.length }, ...categories].map((c) => {
            const on = category === c.slug;
            return (
              <li key={c.id}>
                <button type="button" aria-pressed={on} onClick={() => setCategory(c.slug)} className={cn('flex min-h-[88px] w-28 flex-col items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-center transition-colors', on ? 'border-brand bg-brand text-on-brand' : 'border-line-strong bg-surface text-brand-strong hover:border-brand')}>
                  <span className={cn('grid size-10 place-items-center rounded-md', on ? 'bg-on-brand/15' : 'bg-brand')} aria-hidden><PlumbGlyph name={c.slug ? (CATEGORY_GLYPH[c.slug] ?? 'wrench') : 'tee'} size={26} /></span>
                  <span className="font-heading text-base font-semibold uppercase leading-none tracking-wide">{c.name}</span>
                  <span className={cn('text-xs font-semibold', on ? 'text-on-brand' : 'text-ink-muted')}>{c.count} items</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="hidden lg:block">
        <div className="fp-card sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto p-6">
          <Filters {...filterProps} />
        </div>
      </aside>

      <div>
        <div className="fp-card mb-6 grid gap-3 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-brand-soft" aria-hidden />
            <Input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search taps, valves, heaters..." aria-label="Search products" className="pl-12" />
          </div>
          <label className="flex items-center gap-2">
            <span className="sr-only">Sort products</span>
            <Select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sort products" className="min-w-48">
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name">Name A to Z</option>
            </Select>
          </label>
          <div className="flex items-center gap-2">
            <DialogPrimitive.Root open={sheet} onOpenChange={setSheet}>
              <DialogPrimitive.Trigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden"><SlidersHorizontal className="size-4" aria-hidden /> Filters{activeFilters ? ` (${activeFilters})` : ''}</Button>
              </DialogPrimitive.Trigger>
              <SheetContent title="Filters" side="left" data-lenis-prevent>
                <div className="flex-1 overflow-y-auto pr-1"><Filters {...filterProps} /></div>
                <Button className="mt-4" onClick={() => setSheet(false)}>Show {filtered.length} products</Button>
              </SheetContent>
            </DialogPrimitive.Root>
            <div className="ml-auto flex gap-2" role="group" aria-label="Layout">
              <button type="button" className="fp-chip !min-h-11 w-11 justify-center !px-0" aria-pressed={view === 'grid'} aria-label="Grid view" onClick={() => setView('grid')}><Grid2x2 className="size-5" aria-hidden /></button>
              <button type="button" className="fp-chip !min-h-11 w-11 justify-center !px-0" aria-pressed={view === 'list'} aria-label="List view" onClick={() => setView('list')}><List className="size-5" aria-hidden /></button>
            </div>
          </div>
        </div>

        <h2 className="sr-only">Products</h2>
        <p className="mb-4 pl-2 font-semibold text-ink-muted" aria-live="polite">
          {mounted ? `Showing ${Math.min(visible.length, filtered.length)} of ${filtered.length} products` : 'Loading products...'}
          {activeFilters ? <button type="button" onClick={reset} className="ml-3 inline-flex items-center gap-1 font-bold text-brand-soft underline"><X className="size-4" aria-hidden /> Clear filters</button> : null}
        </p>

        {!mounted ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <ProductSkeleton key={i} />)}</div>
        ) : filtered.length === 0 ? (
          <div className="fp-card grid place-items-center gap-4 p-12 text-center">
            <span className="fp-icon !size-20"><Search className="size-9" aria-hidden /></span>
            <h2 className="font-heading text-3xl font-bold">No products match your filters</h2>
            <p className="text-ink-muted">Try a different search, widen the price range or clear the filters.</p>
            <Button onClick={reset}>Clear filters</Button>
          </div>
        ) : (
          <>
            <motion.div layout className={cn('grid gap-6', view === 'grid' ? 'sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1')}>
              <AnimatePresence mode="popLayout">
                {visible.map((p, i) => <ProductCard key={p.id} p={p} view={view} onQuickView={setQuick} priority={i < 3} />)}
              </AnimatePresence>
              {loadingMore ? Array.from({ length: 3 }, (_, i) => <ProductSkeleton key={`s${i}`} view={view} />) : null}
            </motion.div>
            {shown < filtered.length ? (
              <div className="mt-10 text-center">
                <Button variant="blue" size="lg" onClick={() => { setLoadingMore(true); window.setTimeout(() => { setShown((s) => s + PAGE); setLoadingMore(false); }, 350); }}>
                  Load more products
                </Button>
              </div>
            ) : null}
          </>
        )}
      </div>
      <QuickView p={quick} onClose={() => setQuick(null)} />
    </div>
    </div>
  );
}
