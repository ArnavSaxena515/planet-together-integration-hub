import { getSyncLog } from '@/lib/sync-log'

export async function GET() {
  const entries = await getSyncLog(50)
  return Response.json({ entries })
}
