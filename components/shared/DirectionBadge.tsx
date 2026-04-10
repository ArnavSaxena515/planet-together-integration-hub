import { MaterialIcon } from "./MaterialIcon";

interface DirectionBadgeProps {
  direction: "Inbound" | "Outbound";
}

export function DirectionBadge({ direction }: DirectionBadgeProps) {
  const isInbound = direction === "Inbound";
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
        isInbound
          ? "text-blue-600 bg-blue-50"
          : "text-slate-500 bg-slate-100"
      }`}
    >
      <MaterialIcon
        icon={isInbound ? "arrow_forward" : "arrow_back"}
        className="!text-[12px]"
      />
      {direction}
    </span>
  );
}
