export const SAP_STATUS_MAP = {
  A: { label: 'Not Started', bg: '#E8EDF5', color: '#5B7499' },
  B: { label: 'In Progress', bg: '#FFF3CD', color: '#A0760A' },
  C: { label: 'Complete',    bg: '#D4EDDA', color: '#1E7E3B' },
  '': { label: 'Unknown',    bg: '#F1F1F1', color: '#999999' },
} as const

export type StatusCode = keyof typeof SAP_STATUS_MAP

export function getStatus(code: string) {
  return SAP_STATUS_MAP[code as StatusCode] ?? SAP_STATUS_MAP['']
}
