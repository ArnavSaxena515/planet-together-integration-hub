import { NextRequest, NextResponse } from "next/server";

// TODO: Replace with real data source
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  return NextResponse.json({ logs: [], total: 0, page, limit, totalPages: 0 });
}
