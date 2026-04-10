import { NextResponse } from "next/server";

const WORKFLOWS: Record<string, string> = {
  "sales-orders": "69d8de689802ffb28649f41a",
  "items-inventory": "69d7b4269802ffb28643a791",
};

export async function POST(req: Request) {
  const apiKey = process.env.COBALT_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "COBALT_API_KEY not configured" }, { status: 500 });
  }

  const { workflow } = await req.json().catch(() => ({}));
  const workflowIds = workflow
    ? [WORKFLOWS[workflow]].filter(Boolean)
    : Object.values(WORKFLOWS);

  if (workflowIds.length === 0) {
    return NextResponse.json({ error: `Unknown workflow: ${workflow}` }, { status: 400 });
  }

  const results = await Promise.all(
    workflowIds.map(async (id) => {
      const res = await fetch(
        `https://sapis.gocobalt.io/api/v1/workflow/${id}/execute`,
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
      console.log(`Cobalt workflow ${id} response:`, res.status, text);
      return { id, status: res.status, body: text };
    })
  );

  const failed = results.filter((r) => r.status < 200 || r.status >= 300);
  if (failed.length > 0) {
    return NextResponse.json({ error: "Some workflows failed", results }, { status: 502 });
  }

  return NextResponse.json({ success: true, results });
}
