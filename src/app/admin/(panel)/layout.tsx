import { AdminShell } from '@/components/admin/shell';
import { requireAdmin } from '@/lib/server/auth';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return <AdminShell email={admin.email}>{children}</AdminShell>;
}
