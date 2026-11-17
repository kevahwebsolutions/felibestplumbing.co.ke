'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Command } from 'cmdk';
import { BarChart3, ClipboardList, ExternalLink, FolderTree, LogOut, Menu, MessageSquareText, Package, Search, Settings, ShoppingBag, Plus, KeyRound } from 'lucide-react';
import { logoutAction } from '@/app/admin/actions';
import { SheetContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/admin', label: 'Dashboard', Icon: BarChart3 },
  { href: '/admin/products', label: 'Products', Icon: Package },
  { href: '/admin/categories', label: 'Categories', Icon: FolderTree },
  { href: '/admin/orders', label: 'Orders', Icon: ShoppingBag },
  { href: '/admin/enquiries', label: 'Enquiries', Icon: MessageSquareText },
  { href: '/admin/settings', label: 'Settings', Icon: Settings },
];

const ACTIONS = [
  { href: '/admin/products/new', label: 'Create product', Icon: Plus },
  { href: '/admin/orders', label: 'View new orders', Icon: ClipboardList },
  { href: '/admin/enquiries', label: 'View new enquiries', Icon: MessageSquareText },
  { href: '/admin/change-password', label: 'Change password', Icon: KeyRound },
  { href: '/', label: 'Open public site', Icon: ExternalLink },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="grid gap-2">
      {NAV.map(({ href, label, Icon }) => {
        const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
        return (
          <Link key={href} href={href} onClick={onNavigate} aria-current={active ? 'page' : undefined}
            className={cn('flex min-h-12 items-center gap-3 rounded-full px-4 font-heading font-extrabold transition-colors', active ? 'bg-gradient-to-b from-navy-600 to-navy-700 text-white shadow-[inset_3px_4px_8px_rgb(255_255_255/0.3),inset_-3px_-4px_8px_rgb(6_31_61/0.45)]' : 'text-navy-800 hover:bg-white/70')}>
            <Icon className="size-5" aria-hidden /> {label}
          </Link>
        );
      })}
    </nav>
  );
}

function CommandPalette({ open, setOpen }: { open: boolean; setOpen: (b: boolean) => void }) {
  const router = useRouter();
  const [products, setProducts] = React.useState<{ id: number; name: string }[]>([]);
  React.useEffect(() => {
    if (!open || products.length) return;
    fetch('/api/admin/online?products=1').then((r) => r.json()).then((d) => setProducts(d.products ?? [])).catch(() => undefined);
  }, [open, products.length]);
  const go = (href: string) => { setOpen(false); router.push(href); };
  return (
    <Command.Dialog open={open} onOpenChange={setOpen} label="Quick search" className="fixed left-1/2 top-[18%] z-[95] w-[calc(100vw-24px)] max-w-xl -translate-x-1/2 overflow-hidden rounded-[28px] bg-white shadow-[var(--clay-shadow-hover)]" overlayClassName="fp-overlay fixed inset-0 z-[90] bg-navy-950/55 backdrop-blur-sm">
      <div className="flex items-center gap-3 border-b border-sky-200 px-5"><Search className="size-5 text-navy-600" aria-hidden />
        <Command.Input placeholder="Search pages, actions and products..." className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted" /></div>
      <Command.List className="max-h-80 overflow-y-auto p-2">
        <Command.Empty className="p-6 text-center text-muted">No results found.</Command.Empty>
        <Command.Group heading="Go to" className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-muted">
          {NAV.map(({ href, label, Icon }) => <Command.Item key={href} value={label} onSelect={() => go(href)} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-2xl px-3 text-base normal-case tracking-normal text-ink aria-selected:bg-sky-100"><Icon className="size-4" aria-hidden /> {label}</Command.Item>)}
        </Command.Group>
        <Command.Group heading="Actions" className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-muted">
          {ACTIONS.map(({ href, label, Icon }) => <Command.Item key={href + label} value={label} onSelect={() => go(href)} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-2xl px-3 text-base normal-case tracking-normal text-ink aria-selected:bg-sky-100"><Icon className="size-4" aria-hidden /> {label}</Command.Item>)}
        </Command.Group>
        {products.length ? (
          <Command.Group heading="Products" className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-muted">
            {products.map((p) => <Command.Item key={p.id} value={`product ${p.name}`} onSelect={() => go(`/admin/products/${p.id}`)} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-2xl px-3 text-base normal-case tracking-normal text-ink aria-selected:bg-sky-100"><Package className="size-4" aria-hidden /> {p.name}</Command.Item>)}
          </Command.Group>
        ) : null}
      </Command.List>
    </Command.Dialog>
  );
}

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const [menu, setMenu] = React.useState(false);
  const [palette, setPalette] = React.useState(false);
  const pathname = usePathname();
  React.useEffect(() => setMenu(false), [pathname]);
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPalette((o) => !o); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const brand = (
    <Link href="/admin" className="flex items-center gap-3">
      <span className="grid size-12 place-items-center rounded-full bg-[radial-gradient(circle_at_30%_25%,var(--color-navy-600),var(--color-navy-900))]"><Image src="/images/logo-white.webp" alt="" width={36} height={36} /></span>
      <span className="font-heading text-lg font-extrabold leading-tight text-navy-700">Felibest<br /><span className="text-xs tracking-[0.2em] text-cta-500">ADMIN</span></span>
    </Link>
  );
  return (
    <div className="flex min-h-dvh">
      <aside className="no-print sticky top-0 hidden h-dvh w-72 shrink-0 p-4 lg:block">
        <div className="clay-card flex h-full flex-col gap-6 !rounded-[36px] p-5">
          {brand}
          <NavLinks />
          <div className="mt-auto grid gap-3">
            <p className="truncate pl-2 text-sm text-muted" title={email}>{email}</p>
            <form action={logoutAction}><button type="submit" className="clay-button clay-button-ghost clay-button-sm w-full"><LogOut className="size-4" aria-hidden /> Sign out</button></form>
          </div>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="no-print sticky top-0 z-40 flex items-center gap-3 px-4 pb-2 pt-4 lg:px-8">
          <DialogPrimitive.Root open={menu} onOpenChange={setMenu}>
            <DialogPrimitive.Trigger className="clay-chip !min-h-12 w-12 justify-center !px-0 lg:hidden" aria-label="Open menu"><Menu className="size-5" aria-hidden /></DialogPrimitive.Trigger>
            <SheetContent title="Admin menu" side="left" data-lenis-prevent>
              <div className="mb-4">{brand}</div>
              <NavLinks onNavigate={() => setMenu(false)} />
              <form action={logoutAction} className="mt-auto"><button type="submit" className="clay-button clay-button-ghost w-full"><LogOut className="size-4" aria-hidden /> Sign out</button></form>
            </SheetContent>
          </DialogPrimitive.Root>
          <button type="button" onClick={() => setPalette(true)} className="clay-input flex !min-h-12 flex-1 items-center gap-3 text-left text-muted sm:max-w-md">
            <Search className="size-5 text-navy-600" aria-hidden /> <span className="flex-1 truncate">Quick search</span><kbd className="hidden rounded-lg bg-white px-2 py-0.5 text-xs font-bold text-navy-700 shadow sm:block">Ctrl K</kbd>
          </button>
          <Link href="/" target="_blank" className="clay-chip ml-auto hidden sm:inline-flex"><ExternalLink className="size-4" aria-hidden /> View site</Link>
        </header>
        <main id="main" className="px-4 pb-16 pt-4 lg:px-8">{children}</main>
      </div>
      <CommandPalette open={palette} setOpen={setPalette} />
    </div>
  );
}
