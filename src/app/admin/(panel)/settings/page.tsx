import { SettingsForm } from '@/components/admin/settings-form';
import { getSettings } from '@/lib/server/settings';

export const metadata = { title: 'Settings' };

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-black sm:text-4xl">Settings</h1>
      <SettingsForm initial={getSettings()} />
    </div>
  );
}
