'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Clock, Mail, Menu, MessageCircle, Phone, ShoppingCart, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { SITE, whatsappLink } from '@/lib/site';
import { ButtonAnchor } from '@/components/ui/button';
import { SOCIAL_ICONS } from '@/components/plumb/brand-icons';
import { selectCount, useCart } from '@/store/cart';
import { cn } from '@/lib/utils';

const HEADER_NAV = [
  { href: '/services', label: 'Services' },
  { href: '/shop', label: 'Shop' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

const MORE_NAV = [
  { href: '/', label: 'Home' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/blog', label: 'Plumbing tips' },
  { href: '/faq', label: 'FAQ' },
  { href: '/coverage', label: 'Areas we cover' },
] as const;

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
}

/** The logo has a white wordmark, so it always sits on navy. */
export function Logo({ className, priority = false, size = 52 }: { className?: string; priority?: boolean; size?: number }) {
  return (
    <Link href="/" aria-label="Felibest Plumbing home" className={cn('group flex items-center gap-3', className)}>
      <Image src="/images/logo-white.webp" alt="" width={size} height={size} priority={priority} className="shrink-0 object-contain transition-[width,height] duration-200" style={{ width: size, height: size }} />
      <span className="leading-none">
        <span className="block font-heading text-[1.65rem] font-bold uppercase tracking-wide text-white">Felibest</span>
        <span className="block font-heading text-sm font-semibold uppercase tracking-[0.32em] text-sky-400">Plumbing</span>
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
      className={cn('relative inline-grid size-11 place-items-center rounded-lg border border-white/30 text-white transition-colors hover:bg-white/10', className)}
    >
      <span data-cart-icon className="grid place-items-center">
        <ShoppingCart className="size-5" aria-hidden />
      </span>
      {mounted && count > 0 ? (
        <motion.span key={count} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ duration: 0.15 }} className="fp-pill fp-pill-orange absolute -right-2 -top-2 min-w-6 justify-center !px-1.5 !py-0.5 !text-xs">
          {count}
        </motion.span>
      ) : null}
    </button>
  );
}

export function UtilityBar({ phone, email, hours }: { phone: string; email: string; hours: string }) {
  const tel = `tel:${phone.replace(/[^\d+]/g, '')}`;
  return (
    <div className="no-print hidden bg-navy-950 text-sky-200 lg:block">
      <div className="container-fp flex items-center justify-between gap-6 py-2 text-sm">
        <a href={tel} className="flex items-center gap-3 text-white" aria-label={`24/7 emergency line ${phone}`}>
          <span className="fp-pill fp-pill-orange !py-0.5">24/7 Emergency</span>
          <span className="font-heading text-2xl font-bold tracking-wide">{phone}</span>
        </a>
        <ul className="flex items-center gap-6">
          <li className="flex items-center gap-2"><Mail className="size-4 text-sky-400" aria-hidden /><a className="hover:text-white hover:underline" href={`mailto:${email}`}>{email}</a></li>
          <li className="flex items-center gap-2"><Clock className="size-4 text-sky-400" aria-hidden />{hours}</li>
          <li className="flex items-center gap-1">
            {SITE.socials.map((s) => {
              const Icon = SOCIAL_ICONS[s.id]!;
              return (
                <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.label} (opens in a new tab)`} className="grid size-9 place-items-center rounded text-sky-200 hover:bg-white/10 hover:text-white">
                  <Icon className="size-[18px]" />
                </a>
              );
            })}
          </li>
        </ul>
      </div>
    </div>
  );
}

export function Header({ phone, whatsappNumber }: { phone: string; whatsappNumber: string }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  React.useEffect(() => setOpen(false), [pathname]);
  const tel = `tel:${phone.replace(/[^\d+]/g, '')}`;

  return (
    <header className={cn('no-print sticky top-0 z-50 border-b border-white/10 bg-navy-900 transition-shadow', scrolled && 'shadow-[0_6px_20px_-8px_rgb(5_29_56/0.7)]')}>
      <div className={cn('container-fp flex items-center justify-between gap-3 transition-[padding] duration-200', scrolled ? 'py-1.5' : 'py-2.5')}>
        <Logo priority size={scrolled ? 42 : 52} />
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {HEADER_NAV.map((n) => {
            const active = isActive(pathname, n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative px-3.5 py-2.5 font-heading text-lg font-semibold uppercase tracking-wider text-white/90 transition-colors hover:text-white',
                  active && 'text-white after:absolute after:inset-x-3.5 after:bottom-0.5 after:h-[3px] after:rounded-sm after:bg-orange-brand',
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <CartButton />
          <ButtonAnchor href={tel} size="sm" className="hidden sm:inline-flex" aria-label={`Call now ${phone}`}>
            <Phone className="size-4" aria-hidden /> Call now
          </ButtonAnchor>
          <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
            <DialogPrimitive.Trigger className="inline-grid size-11 place-items-center rounded-lg border border-white/30 text-white lg:hidden" aria-label="Open menu">
              <Menu className="size-6" aria-hidden />
            </DialogPrimitive.Trigger>
            <DialogPrimitive.Portal>
              <DialogPrimitive.Overlay className="fp-overlay fixed inset-0 z-[80] bg-navy-950/70" />
              <DialogPrimitive.Content
                data-lenis-prevent
                className="bp-grid fixed inset-y-0 right-0 z-[90] flex h-dvh w-full max-w-md flex-col bg-navy-900 p-5 text-white data-[state=open]:animate-[sheet-in-right_0.28s_cubic-bezier(0.22,1,0.36,1)]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <DialogPrimitive.Title className="font-heading text-2xl font-bold uppercase tracking-wide !text-white">Menu</DialogPrimitive.Title>
                  <DialogPrimitive.Close aria-label="Close menu" className="inline-grid size-11 place-items-center rounded-lg border border-white/30">
                    <X className="size-6" aria-hidden />
                  </DialogPrimitive.Close>
                </div>
                <DialogPrimitive.Description className="sr-only">Site navigation and contact options</DialogPrimitive.Description>
                <div className="grid gap-3 pb-4">
                  <ButtonAnchor href={tel} size="lg" className="w-full">
                    <Phone className="size-5" aria-hidden /> Call {phone}
                  </ButtonAnchor>
                  <ButtonAnchor href={whatsappLink(undefined, whatsappNumber)} target="_blank" rel="noopener noreferrer" variant="outline" size="lg" className="w-full">
                    <MessageCircle className="size-5" aria-hidden /> WhatsApp us
                  </ButtonAnchor>
                </div>
                <nav aria-label="Mobile" className="flex flex-1 flex-col overflow-y-auto border-t border-white/15 pt-2">
                  {[...HEADER_NAV, ...MORE_NAV].map((n) => (
                    <Link
                      key={n.href}
                      href={n.href}
                      aria-current={isActive(pathname, n.href) ? 'page' : undefined}
                      className={cn('flex min-h-12 items-center justify-between border-b border-white/10 font-heading text-xl font-semibold uppercase tracking-wider text-white/90', isActive(pathname, n.href) && 'text-sky-400')}
                    >
                      {n.label}
                      <span aria-hidden className="text-orange-brand">&rsaquo;</span>
                    </Link>
                  ))}
                </nav>
                <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-4 text-sm text-sky-200">
                  <span className="flex items-center gap-2"><Clock className="size-4" aria-hidden /> {SITE.hours}</span>
                  <span className="flex gap-1">
                    {SITE.socials.map((s) => {
                      const Icon = SOCIAL_ICONS[s.id]!;
                      return (
                        <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.label} (opens in a new tab)`} className="grid size-11 place-items-center rounded text-white hover:bg-white/10">
                          <Icon />
                        </a>
                      );
                    })}
                  </span>
                </div>
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          </DialogPrimitive.Root>
        </div>
      </div>
    </header>
  );
}
