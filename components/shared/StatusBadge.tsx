import { statusMap, type StatusCode } from "@/lib/utils/status";

interface StatusBadgeProps {
  code: StatusCode;
}

export function StatusBadge({ code }: StatusBadgeProps) {
  const config = statusMap[code] || statusMap[""];
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}
