import { ChangePasswordForm } from '@/components/admin/auth-forms';
import { requireAdmin } from '@/lib/server/auth';

export const metadata = { title: 'Change password' };

export default async function ChangePasswordPage() {
  const admin = await requireAdmin({ allowPasswordChange: true });
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="fp-card w-full max-w-md p-8 sm:p-10">
        <h1 className="font-heading text-4xl font-bold">{admin.mustChangePassword ? 'Set a new password' : 'Change password'}</h1>
        <p className="mb-7 mt-2 text-ink-muted">{admin.mustChangePassword ? 'For security you must choose a new password before continuing.' : 'Choose a strong, unique password.'}</p>
        <ChangePasswordForm />
      </div>
    </main>
  );
}
