import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

const RESET_WORKFLOW_ID = "69d900d99802ffb2864cacfb";
const DATA_KEYS = ["sales-orders", "items", "inventory", "warehouses", "plant-warehouses"];

export async function POST() {
  const apiKey = process.env.COBALT_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "COBALT_API_KEY not configured" }, { status: 500 });
  }

  // Clear Redis data keys (not sync-log)
  await Promise.all(DATA_KEYS.map((key) => redis.del(key)));

  // Trigger reset workflow
  const res = await fetch(
    `https://sapis.gocobalt.io/api/v1/workflow/${RESET_WORKFLOW_ID}/execute`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
        linked_account_id: "cobalt_test_user",
        slug: "Refo-695",
        sync_execution: "false",
      },
      body: JSON.stringify({}),
    }
  );

  const text = await res.text();
  console.log("Reset workflow response:", res.status, text);

  if (!res.ok) {
    return NextResponse.json({ error: "Reset workflow failed", status: res.status, body: text }, { status: 502 });
  }

  return NextResponse.json({ success: true, cleared: DATA_KEYS });
}
