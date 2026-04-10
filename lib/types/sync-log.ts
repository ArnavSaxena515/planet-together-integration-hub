export interface SyncLogEntry {
  id: number;
  timestamp: string;
  direction: "Inbound" | "Outbound";
  objectType: string;
  recordCount: number;
  status: "Success" | "Failed";
  payload?: string | null;
  errorMsg?: string | null;
}
