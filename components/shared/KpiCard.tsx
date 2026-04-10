import { MaterialIcon } from "./MaterialIcon";

interface KpiCardProps {
  label: string;
  value: string | number;
  subtext: string;
  icon: string;
  accentColor?: string;
  borderLeft?: string;
}

export function KpiCard({ label, value, subtext, icon, accentColor = "bg-blue-500", borderLeft }: KpiCardProps) {
  return (
    <div className={`bg-surface-container-lowest p-6 rounded-xl shadow-sm relative overflow-hidden group ${borderLeft ? `border-l-4 ${borderLeft}` : ""}`}>
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
        <MaterialIcon icon={icon} className="text-4xl" />
      </div>
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <h3 className="text-3xl font-bold text-on-surface">{value}</h3>
      <div className="mt-4 flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${accentColor}`} />
        <span className="text-[10px] font-medium text-slate-500">{subtext}</span>
      </div>
    </div>
  );
}
