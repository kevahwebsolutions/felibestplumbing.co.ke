'use client';

import * as React from 'react';
import Link from 'next/link';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AlertTriangle, ArrowDownRight, ArrowUpRight, CalendarDays, Minus } from 'lucide-react';
import { CountUp } from '@/components/motion/count-up';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/field';
import { cn, formatKES } from '@/lib/utils';
import type { Dashboard } from '@/lib/server/analytics';

const COLORS = ['var(--t-chart-1)', 'var(--t-chart-2)', 'var(--t-chart-3)', 'var(--t-chart-4)', 'var(--t-chart-5)', 'var(--t-chart-6)', 'var(--t-chart-7)', 'var(--t-chart-8)'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function useMounted() {
  const [m, setM] = React.useState(false);
  React.useEffect(() => setM(true), []);
  return m;
}

function Delta({ value, invert = false }: { value: number | null; invert?: boolean }) {
  if (value === null) return <span className="text-xs font-bold text-ink-muted">new</span>;
  if (value === 0) return <span className="inline-flex items-center gap-1 text-xs font-bold text-ink-muted"><Minus className="size-3" aria-hidden /> 0%</span>;
  const good = invert ? value < 0 : value > 0;
  const Icon = value > 0 ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-bold', good ? 'text-success' : 'text-accent-strong')}>
      <Icon className="size-4" aria-hidden /> {Math.abs(value)}%<span className="sr-only"> {value > 0 ? 'increase' : 'decrease'} versus the previous period</span>
    </span>
  );
}

function Kpi({ label, value, delta, invert, format, suffix }: { label: string; value: number; delta: number | null; invert?: boolean; format?: (n: number) => string; suffix?: string }) {
  return (
    <div className="fp-card flex flex-col gap-1 p-5">
      <p className="text-sm font-bold text-ink-muted">{label}</p>
      <p className="font-heading text-4xl font-bold text-brand"><CountUp to={value} format={format} suffix={suffix} duration={1.2} /></p>
      <Delta value={delta} invert={invert} />
    </div>
  );
}

function Panel({ title, children, table, className, empty }: { title: string; children: React.ReactNode; table: React.ReactNode; className?: string; empty?: boolean }) {
  return (
    <section className={cn('fp-card flex flex-col p-5 sm:p-6', className)} aria-label={title}>
      <h2 className="mb-4 font-heading text-xl font-bold">{title}</h2>
      {empty ? <p className="grid min-h-48 flex-1 place-items-center rounded-lg bg-surface-alt p-6 text-center text-ink-muted">No data for this period yet.</p> : <div className="min-h-48 flex-1">{children}</div>}
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer font-bold text-brand-soft">View as table</summary>
        <div className="mt-2 max-h-56 overflow-auto rounded-lg bg-surface-alt p-2">{table}</div>
      </details>
    </section>
  );
}

function SimpleTable({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return (
    <table className="w-full text-left">
      <thead><tr>{head.map((h) => <th key={h} scope="col" className="px-2 py-1 text-xs uppercase tracking-wider text-ink-muted">{h}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i} className="border-t border-line">{r.map((c, j) => (j === 0 ? <th key={j} scope="row" className="px-2 py-1 font-semibold">{c}</th> : <td key={j} className="px-2 py-1">{c}</td>))}</tr>)}</tbody>
    </table>
  );
}

function ChartBox({ height = 260, children }: { height?: number; children: React.ReactElement }) {
  const mounted = useMounted();
  if (!mounted) return <div className="skeleton w-full" style={{ height }} aria-label="Loading chart" />;
  return <div style={{ height }} role="img" aria-label="Chart, see the table below for the data"><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div>;
}

const tooltipStyle = { borderRadius: 8, border: '1px solid var(--t-border)', background: 'var(--t-surface)', color: 'var(--t-ink)', boxShadow: 'var(--shadow-lift)', padding: '8px 12px' };

function Heatmap({ grid }: { grid: number[][] }) {
  const max = Math.max(1, ...grid.flat());
  return (
    <div className="overflow-x-auto" role="img" aria-label="Heatmap of pageviews by weekday and hour">
      <div className="min-w-[520px]">
        <div className="ml-10 grid grid-cols-24 gap-[3px] text-[10px] text-ink-muted" style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}>
          {Array.from({ length: 24 }, (_, h) => <span key={h} className="text-center">{h % 3 === 0 ? h : ''}</span>)}
        </div>
        {grid.map((row, d) => (
          <div key={d} className="mt-[3px] flex items-center gap-2">
            <span className="w-8 text-xs font-bold text-ink-muted">{DAYS[d]}</span>
            <div className="grid flex-1 gap-[3px]" style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}>
              {row.map((v, h) => (
                <span key={h} title={`${DAYS[d]} ${h}:00, ${v} pageviews`} className="aspect-square rounded-sm" style={{ background: v === 0 ? 'var(--t-tint)' : `color-mix(in srgb, var(--t-chart-1) ${Math.round(15 + (v / max) * 85)}%, transparent)` }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OnlineBadge({ initial }: { initial: number }) {
  const [n, setN] = React.useState(initial);
  React.useEffect(() => {
    const t = window.setInterval(() => {
      fetch('/api/admin/online', { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)).then((d) => d && setN(d.online)).catch(() => undefined);
    }, 20000);
    return () => window.clearInterval(t);
  }, []);
  return (
    <p className="fp-pill fp-pill-green !py-2 !text-sm" role="status" aria-live="polite">
      <span className="relative flex size-3"><span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" /><span className="relative inline-flex size-3 rounded-full bg-success" /></span>
      {n} online now
    </p>
  );
}

export function DashboardView({ d, preset, placeholderCount }: { d: Dashboard; preset: string; placeholderCount: number }) {
  const k = d.kpis;
  const sources = d.sources.map((s) => ({ ...s }));
  const hasTraffic = k.pageviews > 0;
  const funnelMax = Math.max(1, d.funnel[0]?.sessions ?? 1);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-4xl font-bold sm:text-5xl">Dashboard</h1>
          <p className="text-ink-muted">{d.range.from} to {d.range.to} ({d.days} days), compared with the previous {d.days} days.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <OnlineBadge initial={d.online} />
          <div className="flex gap-2" role="group" aria-label="Date range">
            {['7', '30', '90'].map((p) => <Link key={p} href={`/admin?range=${p}`} className="fp-chip" data-active={preset === p} aria-current={preset === p ? 'true' : undefined}>{p} days</Link>)}
          </div>
        </div>
      </div>

      <form method="get" action="/admin" className="fp-card flex flex-wrap items-end gap-3 p-4">
        <CalendarDays className="mb-3 size-5 text-brand-soft" aria-hidden />
        <div><label htmlFor="from" className="mb-1 block pl-2 text-xs font-bold">From</label><Input id="from" name="from" type="date" defaultValue={d.range.from} className="!min-h-11" /></div>
        <div><label htmlFor="to" className="mb-1 block pl-2 text-xs font-bold">To</label><Input id="to" name="to" type="date" defaultValue={d.range.to} className="!min-h-11" /></div>
        <Button type="submit" size="sm" variant="blue">Apply custom range</Button>
      </form>

      {placeholderCount > 0 ? (
        <div className="fp-card-peach flex flex-wrap items-center gap-3 p-4 font-semibold" role="status">
          <AlertTriangle className="size-6 shrink-0 text-accent-strong" aria-hidden />
          <p className="flex-1">{placeholderCount} products still use placeholder prices. Confirm them before going live.</p>
          <Link href="/admin/products?filter=placeholder" className="fp-button fp-button-sm">Review prices</Link>
        </div>
      ) : null}

      <section aria-label="Key figures" className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <Kpi label="Visitors" value={k.visitors} delta={d.deltas.visitors} />
        <Kpi label="Pageviews" value={k.pageviews} delta={d.deltas.pageviews} />
        <Kpi label="Pages per session" value={k.pagesPerSession} delta={d.deltas.pagesPerSession} format={(n) => n.toFixed(2)} />
        <Kpi label="Bounce rate" value={k.bounceRate * 100} delta={d.deltas.bounceRate} invert format={(n) => n.toFixed(1)} suffix="%" />
        <Kpi label="Orders" value={k.orders} delta={d.deltas.orders} />
        <Kpi label="Revenue" value={k.revenue} delta={d.deltas.revenue} format={(n) => formatKES(n)} />
        <Kpi label="Conversion rate" value={k.conversionRate * 100} delta={d.deltas.conversionRate} format={(n) => n.toFixed(2)} suffix="%" />
        <Kpi label="Call clicks" value={k.calls} delta={d.deltas.calls} />
        <Kpi label="WhatsApp clicks" value={k.whatsapp} delta={d.deltas.whatsapp} />
        <Kpi label="New enquiries" value={k.enquiries} delta={d.deltas.enquiries} />
      </section>

      <Panel title="Visitors and pageviews" empty={!hasTraffic} table={<SimpleTable head={['Day', 'Visitors', 'Pageviews']} rows={d.series.map((s) => [s.day, s.visitors, s.pageviews])} />}>
        <ChartBox height={300}>
          <AreaChart data={d.series} margin={{ left: -10, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--t-chart-2)" stopOpacity={0.7} /><stop offset="1" stopColor="var(--t-chart-2)" stopOpacity={0.05} /></linearGradient>
              <linearGradient id="gp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--t-chart-1)" stopOpacity={0.45} /><stop offset="1" stopColor="var(--t-chart-1)" stopOpacity={0.03} /></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="var(--t-border)" />
            <XAxis dataKey="day" tickFormatter={(v: string) => v.slice(5)} tick={{ fontSize: 11 }} minTickGap={24} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Area type="monotone" dataKey="pageviews" name="Pageviews" stroke="var(--t-chart-1)" strokeWidth={3} fill="url(#gp)" animationDuration={900} />
            <Area type="monotone" dataKey="visitors" name="Visitors" stroke="var(--t-chart-2)" strokeWidth={3} fill="url(#gv)" animationDuration={900} />
          </AreaChart>
        </ChartBox>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Top pages" empty={d.topPages.length === 0} table={<SimpleTable head={['Page', 'Views']} rows={d.topPages.map((p) => [p.name, p.value])} />}>
          <ChartBox height={300}>
            <BarChart data={d.topPages} layout="vertical" margin={{ left: 10, right: 16 }}>
              <CartesianGrid strokeDasharray="2 4" horizontal={false} stroke="var(--t-border)" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} tickFormatter={(v: string) => (v.length > 18 ? v.slice(0, 17) + '...' : v)} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" name="Views" fill="var(--t-chart-1)" radius={[0, 3, 3, 0]} animationDuration={900} />
            </BarChart>
          </ChartBox>
        </Panel>
        <Panel title="Traffic sources" empty={sources.length === 0} table={<SimpleTable head={['Source', 'Sessions']} rows={sources.map((s) => [s.name, s.value])} />}>
          <ChartBox height={300}>
            <PieChart>
              <Pie data={sources} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="85%" paddingAngle={4} cornerRadius={10} animationDuration={900}>
                {sources.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} /><Legend />
            </PieChart>
          </ChartBox>
        </Panel>
        <Panel title="Devices" empty={d.devices.length === 0} table={<SimpleTable head={['Device', 'Sessions']} rows={d.devices.map((s) => [s.name, s.value])} />}>
          <ChartBox height={240}>
            <PieChart>
              <Pie data={d.devices} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="85%" paddingAngle={4} cornerRadius={10}>
                {d.devices.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} /><Legend />
            </PieChart>
          </ChartBox>
        </Panel>
        <Panel title="Browsers" empty={d.browsers.length === 0} table={<SimpleTable head={['Browser', 'Sessions']} rows={d.browsers.map((s) => [s.name, s.value])} />}>
          <ChartBox height={240}>
            <BarChart data={d.browsers} margin={{ left: -10, right: 8 }}>
              <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="var(--t-border)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" name="Sessions" fill="var(--t-chart-2)" radius={[3, 3, 0, 0]}>{d.browsers.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Bar>
            </BarChart>
          </ChartBox>
        </Panel>
      </div>

      <Panel title="Busiest hours (pageviews by weekday and hour, East Africa Time)" empty={!hasTraffic} table={<SimpleTable head={['Weekday', ...Array.from({ length: 24 }, (_, h) => String(h))]} rows={d.heatmap.map((r, i) => [DAYS[i]!, ...r])} />}>
        <Heatmap grid={d.heatmap} />
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Top products: views versus add to cart" empty={d.products.length === 0} table={<SimpleTable head={['Product', 'Views', 'Added to cart']} rows={d.products.map((p) => [p.name, p.views, p.addToCart])} />}>
          <ChartBox height={320}>
            <BarChart data={d.products} margin={{ left: -10, right: 8 }}>
              <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="var(--t-border)" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} tickFormatter={(v: string) => (v.length > 10 ? v.slice(0, 9) + '...' : v)} interval={0} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} /><Legend />
              <Bar dataKey="views" name="Views" fill="var(--t-chart-1)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="addToCart" name="Added to cart" fill="var(--t-chart-3)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ChartBox>
        </Panel>
        <Panel title="Conversion funnel" empty={!hasTraffic} table={<SimpleTable head={['Step', 'Sessions']} rows={d.funnel.map((f) => [f.step, f.sessions])} />}>
          <ol className="space-y-3">
            {d.funnel.map((f, i) => {
              const pct = Math.max(4, Math.round((f.sessions / funnelMax) * 100));
              const prev = i > 0 ? d.funnel[i - 1]!.sessions : null;
              return (
                <li key={f.step}>
                  <div className="mb-1 flex justify-between text-sm font-bold"><span>{f.step}</span><span>{f.sessions.toLocaleString('en-KE')}{prev ? <span className="ml-2 font-semibold text-ink-muted">{prev ? Math.round((f.sessions / prev) * 100) : 0}% of previous</span> : null}</span></div>
                  <div className="h-6 overflow-hidden rounded-sm bg-tint"><div className="h-full rounded-sm bg-brand" style={{ width: `${pct}%` }} /></div>
                </li>
              );
            })}
          </ol>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Best-selling categories (KES)" empty={d.categorySales.length === 0} table={<SimpleTable head={['Category', 'Sales']} rows={d.categorySales.map((c) => [c.name, formatKES(c.value)])} />}>
          <ChartBox height={260}>
            <BarChart data={d.categorySales} layout="vertical" margin={{ left: 10, right: 16 }}>
              <CartesianGrid strokeDasharray="2 4" horizontal={false} stroke="var(--t-border)" />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${Math.round(v / 1000)}k`} />
              <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatKES(Number(v))} />
              <Bar dataKey="value" name="Sales" fill="var(--t-chart-2)" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ChartBox>
        </Panel>
        <Panel title="Low-stock alerts" empty={d.lowStock.length === 0} table={<SimpleTable head={['Product', 'In stock']} rows={d.lowStock.map((p) => [p.name, p.stock])} />}>
          <ul className="space-y-2">
            {d.lowStock.map((p) => <li key={p.id} className="flex items-center justify-between gap-3 rounded-lg bg-surface-alt px-4 py-3"><Link href={`/admin/products/${p.id}`} className="font-semibold text-brand underline-offset-4 hover:underline">{p.name}</Link><span className={cn('fp-pill', p.stock === 0 ? 'fp-pill-orange' : '')}>{p.stock === 0 ? 'Out of stock' : `${p.stock} left`}</span></li>)}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="fp-card p-5 sm:p-6" aria-label="Recent orders">
          <div className="mb-4 flex items-center justify-between"><h2 className="font-heading text-xl font-bold">Recent orders</h2><Link href="/admin/orders" className="font-bold text-brand-soft underline">View all</Link></div>
          {d.recentOrders.length === 0 ? <p className="rounded-lg bg-surface-alt p-6 text-center text-ink-muted">No orders yet.</p> : (
            <ul className="space-y-2">{d.recentOrders.map((o) => <li key={o.id}><Link href={`/admin/orders/${o.id}`} className="flex items-center justify-between gap-3 rounded-lg bg-surface-alt px-4 py-3 hover:bg-tint"><span><span className="block font-bold text-ink">{o.ref}</span><span className="text-sm text-ink-muted">{o.customerName}</span></span><span className="text-right"><span className="block font-bold text-brand">{formatKES(o.total)}</span><span className="fp-pill">{o.status.replace(/_/g, ' ')}</span></span></Link></li>)}</ul>
          )}
        </section>
        <section className="fp-card p-5 sm:p-6" aria-label="Recent enquiries">
          <div className="mb-4 flex items-center justify-between"><h2 className="font-heading text-xl font-bold">Recent enquiries</h2><Link href="/admin/enquiries" className="font-bold text-brand-soft underline">View all</Link></div>
          {d.recentEnquiries.length === 0 ? <p className="rounded-lg bg-surface-alt p-6 text-center text-ink-muted">No enquiries yet.</p> : (
            <ul className="space-y-2">{d.recentEnquiries.map((e) => <li key={e.id} className="flex items-center justify-between gap-3 rounded-lg bg-surface-alt px-4 py-3"><span><span className="block font-bold text-ink">{e.name}</span><span className="text-sm text-ink-muted">{e.service || e.kind}</span></span><span className="fp-pill">{e.status}</span></li>)}</ul>
          )}
        </section>
      </div>
    </div>
  );
}
