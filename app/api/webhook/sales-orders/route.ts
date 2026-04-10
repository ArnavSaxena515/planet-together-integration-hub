import { NextRequest, NextResponse } from "next/server";

// TODO: Replace with real data source
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const orders = body.bulk_sales_orders || (body.single_sales_order ? [body.single_sales_order] : []);
    console.log(`[Webhook] Received ${orders.length} sales orders`);
    return NextResponse.json({ success: true, upserted: orders.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
