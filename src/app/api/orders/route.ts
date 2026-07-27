import { NextResponse } from "next/server";
import {
  buildSheetsOrderPayload,
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
  payload: ReturnType<typeof buildSheetsOrderPayload>
) {
  const res = await fetch(webhookUrl, {
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

  const itemsSummary = body.items
    .map((item) => `${item.name} x${item.quantity}`)
    .join(" | ");

  const payload = buildSheetsOrderPayload(
    {
      orderId: body.orderId,
      customerName: body.customerName,
      phone: body.phone,
      area: body.area || "",
      items: body.items.map((item) => ({
        productId: item.productId,
        slug: "",
        sku: item.sku,
        name: item.name,
        offerId: item.bundleId,
        offerQuantity: item.quantity,
        offerLabel: "",
        price: item.unitPriceAed,
        qty: 1,
      })),
      total: body.total,
      sourceUrl: body.sourceUrl || "",
      eventId: body.eventId || "",
    },
    secret
  );

  payload.items = itemsSummary;

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
