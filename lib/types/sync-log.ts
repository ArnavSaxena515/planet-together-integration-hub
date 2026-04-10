export type SyncLogEntry = {
  id: string
  timestamp: string
  direction: 'Inbound' | 'Outbound'
  objectType: string
  recordCount: number
  status: 'Success' | 'Failed'
  errorMsg?: string
}
