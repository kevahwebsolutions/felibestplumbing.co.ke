import { DashboardView } from '@/components/admin/dashboard';
import { getDashboard, resolveRange } from '@/lib/server/analytics';
import { placeholderPriceCount } from '@/lib/server/products';

export const metadata = { title: 'Dashboard' };

export default async function AdminHome({ searchParams }: { searchParams: Promise<{ range?: string; from?: string; to?: string }> }) {
  const sp = await searchParams;
  const custom = !!(sp.from && sp.to);
  const range = resolveRange(sp.range, sp.from, sp.to);
  const preset = custom ? 'custom' : sp.range === '7' || sp.range === '90' ? sp.range : '30';
  return <DashboardView d={getDashboard(range)} preset={preset} placeholderCount={placeholderPriceCount()} />;
}
