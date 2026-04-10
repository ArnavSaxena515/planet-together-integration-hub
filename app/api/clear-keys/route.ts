import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

const ALL_DATA_KEYS = ["sales-orders", "items", "inventory", "warehouses", "plant-warehouses"];

export async function POST() {
  // Delete all data keys regardless of type (string or hash)
  await Promise.all(ALL_DATA_KEYS.map((key) => redis.del(key)));
  return NextResponse.json({ success: true, cleared: ALL_DATA_KEYS });
}
