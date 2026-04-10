import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { externalId: string } }
) {
  try {
    const { externalId } = params;
    const body = await request.json();

    const updateData: Record<string, any> = {};
    if (body.requestedDeliveryDate) updateData.requestedDeliveryDate = new Date(body.requestedDeliveryDate);
    if (body.status) updateData.status = body.status;
    if (body.requestedQty) updateData.requestedQty = Number(body.requestedQty);

    const updated = await prisma.salesOrder.update({
      where: { externalId },
      data: updateData,
    });

    // TODO: Forward to real SAP API client here
    console.log(`[SAP Write-Back] Would push to SAP for order ${externalId}:`, updateData);

    await prisma.syncLog.create({
      data: {
        direction: "Outbound",
        objectType: "Sales Orders",
        recordCount: 1,
        status: "Success",
        payload: JSON.stringify({ externalId, fields: Object.keys(updateData) }),
      },
    });

    return NextResponse.json({ success: true, updatedAt: updated.updatedAt });
  } catch (error: any) {
    await prisma.syncLog.create({
      data: {
        direction: "Outbound",
        objectType: "Sales Orders",
        recordCount: 1,
        status: "Failed",
        errorMsg: error.message,
      },
    });
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
