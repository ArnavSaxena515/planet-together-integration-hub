import { getStatus } from '@/lib/utils/status'

interface StatusBadgeProps {
  code: string
}

export function StatusBadge({ code }: StatusBadgeProps) {
  const config = getStatus(code)
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase"
      style={{ backgroundColor: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  )
}
