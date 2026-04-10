import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const direction = searchParams.get("direction");
  const objectType = searchParams.get("objectType");
  const status = searchParams.get("status");

  const where: Record<string, any> = {};
  if (direction) where.direction = direction;
  if (objectType) where.objectType = objectType;
  if (status) where.status = status;

  const [logs, total] = await Promise.all([
    prisma.syncLog.findMany({
      where,
      orderBy: { timestamp: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.syncLog.count({ where }),
  ]);

  return NextResponse.json({ logs, total, page, limit, totalPages: Math.ceil(total / limit) });
}
