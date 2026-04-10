import { MaterialIcon } from "@/components/shared/MaterialIcon";

export default function SettingsPage() {
  return (
    <section className="p-8">
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-12 text-center">
        <MaterialIcon icon="settings" className="text-6xl text-slate-300 mb-4" />
        <h3 className="text-lg font-semibold text-on-surface mb-2">Settings</h3>
        <p className="text-sm text-on-surface-variant">System settings and configuration options will be available here.</p>
      </div>
    </section>
  );
}
