import { NextResponse } from "next/server";

export async function POST() {
  const apiKey = process.env.COBALT_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "COBALT_API_KEY not configured" }, { status: 500 });
  }

  const res = await fetch(
    "https://sapis.gocobalt.io/api/v1/workflow/69d8de689802ffb28649f41a/execute",
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
  console.log("Cobalt response status:", res.status, "body:", text);

  if (!res.ok) {
    return NextResponse.json({ error: "Workflow trigger failed", status: res.status, body: text }, { status: 502 });
  }

  const data = text ? JSON.parse(text) : {};
  return NextResponse.json({ success: true, data });
}
