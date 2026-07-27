import { NextResponse } from "next/server";
import {
  buildSheetsOrderPayloadFromLines,
  normalizeGoogleAppsScriptUrl,
  orderLinesToSheetLines,
  type OrderLineItem,
} from "@/lib/orders";

interface OrderRequestBody {
  orderId: string;
  customerName: string;
  phone: string;
  area?: string;
  items: OrderLineItem[];
  total: number;
  currency: string;
  sourceUrl?: string;
  eventId?: string;
}

async function postToGoogleAppsScript(
  webhookUrl: string,
  payload: ReturnType<typeof buildSheetsOrderPayloadFromLines>
) {
  const res = await fetch(normalizeGoogleAppsScriptUrl(webhookUrl), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    redirect: "manual",
  });

  if (res.status >= 300 && res.status < 400) {
    const location = res.headers.get("location");
    if (!location) {
      throw new Error("missing_redirect");
    }

    const finalRes = await fetch(location);
    const text = await finalRes.text();
    return JSON.parse(text) as { success: boolean; error?: string };
  }

  const text = await res.text();
  return JSON.parse(text) as { success: boolean; error?: string };
}

export async function POST(request: Request) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const secret = process.env.SHEETS_WEBHOOK_SECRET;

  if (!webhookUrl || !secret) {
    return NextResponse.json(
      { error: "orders_not_configured" },
      { status: 503 }
    );
  }

  let body: OrderRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!body.orderId || !body.customerName || !body.phone || !body.items?.length) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const sourceUrl = body.sourceUrl || "";
  const payload = buildSheetsOrderPayloadFromLines(
    {
      orderId: body.orderId,
      customerName: body.customerName,
      phone: body.phone,
      sourceUrl,
      lines: orderLinesToSheetLines(body.items),
    },
    secret
  );

  try {
    const result = await postToGoogleAppsScript(webhookUrl, payload);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "sheets_rejected" },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, orderId: body.orderId });
  } catch {
    return NextResponse.json({ error: "sheets_unreachable" }, { status: 502 });
  }
}
