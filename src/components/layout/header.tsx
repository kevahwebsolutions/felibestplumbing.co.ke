'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Menu, Phone, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { NAV, SITE, whatsappLink } from '@/lib/site';
import { SERVICES } from '@/data/services';
import { SheetContent } from '@/components/ui/dialog';
import { ButtonAnchor } from '@/components/ui/button';
import { SOCIAL_ICONS } from '@/components/clay/brand-icons';
import { selectCount, useCart } from '@/store/cart';
import { cn } from '@/lib/utils';

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
}

export function Logo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Link href="/" aria-label="Felibest Plumbing home" className={cn('group flex items-center gap-3', className)}>
      <span className="grid size-14 shrink-0 place-items-center rounded-full bg-[radial-gradient(circle_at_30%_25%,var(--color-navy-600),var(--color-navy-900))] shadow-[0_12px_20px_-8px_rgb(8_47_92/0.6),inset_4px_5px_9px_rgb(255_255_255/0.35),inset_-5px_-6px_10px_rgb(6_31_61/0.5)] transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-105">
        <Image src="/images/logo-white.webp" alt="" width={44} height={44} priority={priority} className="size-11 object-contain" />
      </span>
      <span className="hidden leading-tight sm:block">
        <span className="block font-heading text-xl font-extrabold text-navy-700">Felibest</span>
        <span className="block font-heading text-sm font-bold tracking-[0.18em] text-cta-500">PLUMBING</span>
      </span>
    </Link>
  );
}

export function CartButton({ className }: { className?: string }) {
  const count = useCart(selectCount);
  const setOpen = useCart((s) => s.setOpen);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={mounted && count > 0 ? `Open cart, ${count} items` : 'Open cart'}
      className={cn('clay-chip relative !min-h-12 w-12 justify-center !px-0', className)}
    >
      <span data-cart-icon className="grid place-items-center">
        <ShoppingBag className="size-5" aria-hidden />
      </span>
      {mounted && count > 0 ? (
        <motion.span
          key={count}
          initial={{ scale: 0.4 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 14 }}
          className="clay-pill clay-pill-orange absolute -right-1.5 -top-1.5 !min-w-6 justify-center !px-1.5 !py-0.5 text-xs"
        >
          {count}
        </motion.span>
      ) : null}
    </button>
  );
}

export function Header({ phone, whatsappNumber }: { phone: string; whatsappNumber: string }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  React.useEffect(() => setOpen(false), [pathname]);
  const tel = `tel:${phone.replace(/[^\d+]/g, '')}`;

  return (
    <header className="no-print sticky top-0 z-50 px-3 pt-3 sm:px-5">
      <div
        className={cn(
          'clay-card mx-auto flex max-w-7xl items-center justify-between gap-3 !rounded-[36px] px-3 py-2.5 transition-shadow sm:px-5',
          scrolled ? 'shadow-[var(--clay-shadow-hover)]' : '',
        )}
      >
        <Logo priority />
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => {
            const active = isActive(pathname, n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative rounded-full px-4 py-2.5 font-heading text-[0.95rem] font-extrabold text-navy-800 transition-colors hover:text-cta-600',
                  active && 'text-white',
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-gradient-to-b from-navy-600 to-navy-700 shadow-[inset_3px_4px_8px_rgb(255_255_255/0.3),inset_-3px_-4px_8px_rgb(6_31_61/0.45),0_8px_14px_-6px_rgb(8_47_92/0.6)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                ) : null}
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <CartButton />
          <ButtonAnchor href={tel} size="sm" className="hidden sm:inline-flex" aria-label={`Call ${phone}`}>
            <Phone className="size-4" aria-hidden />
            <span className="hidden xl:inline">{phone}</span>
            <span className="xl:hidden">Call now</span>
          </ButtonAnchor>
          <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
            <DialogPrimitive.Trigger className="clay-chip !min-h-12 w-12 justify-center !px-0 lg:hidden" aria-label="Open menu">
              <Menu className="size-5" aria-hidden />
            </DialogPrimitive.Trigger>
            <SheetContent title="Menu" side="left" data-lenis-prevent>
              <nav aria-label="Mobile" className="flex flex-1 flex-col gap-2 overflow-y-auto pb-4">
                {NAV.map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    aria-current={isActive(pathname, n.href) ? 'page' : undefined}
                    className={cn('clay-card flex min-h-14 items-center rounded-3xl px-5 font-heading text-lg font-extrabold text-navy-800', isActive(pathname, n.href) && '!bg-none !bg-navy-700 !text-white')}
                  >
                    {n.label}
                  </Link>
                ))}
                <p className="mt-4 pl-2 text-sm font-extrabold uppercase tracking-widest text-muted">Popular services</p>
                <div className="flex flex-wrap gap-2">
                  {SERVICES.slice(0, 8).map((s) => (
                    <Link key={s.slug} href={`/services/${s.slug}`} className="clay-chip text-sm">
                      {s.title.length > 26 ? s.title.slice(0, 24) + '...' : s.title}
                    </Link>
                  ))}
                </div>
              </nav>
              <div className="grid gap-3 border-t border-sky-200 pt-4">
                <ButtonAnchor href={tel}>
                  <Phone className="size-5" aria-hidden /> Call {phone}
                </ButtonAnchor>
                <ButtonAnchor variant="blue" href={whatsappLink(undefined, whatsappNumber)} target="_blank" rel="noopener noreferrer">
                  WhatsApp us
                </ButtonAnchor>
                <div className="mt-1 flex justify-center gap-2">
                  {SITE.socials.map((s) => {
                    const Icon = SOCIAL_ICONS[s.id]!;
                    return (
                      <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="clay-chip !min-h-11 w-11 justify-center !px-0">
                        <Icon />
                      </a>
                    );
                  })}
                </div>
              </div>
            </SheetContent>
          </DialogPrimitive.Root>
        </div>
      </div>
    </header>
  );
}

