import { NextRequest, NextResponse } from "next/server";

// TODO: Replace with real data source + SAP API client
export async function POST(
  request: NextRequest,
  { params }: { params: { externalId: string } }
) {
  try {
    const { externalId } = params;
    const body = await request.json();
    console.log(`[SAP Write-Back] Would push to SAP for order ${externalId}:`, body);
    return NextResponse.json({ success: true, updatedAt: new Date().toISOString() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
