import type { CartItem } from "@/context/CartContext";
import { businessConfig } from "@/lib/business-config";

export interface OrderLineItem {
  productId: string;
  sku: string;
  name: string;
  bundleId: string;
  unitPriceAed: number;
  quantity: number;
}

export interface SubmitOrderInput {
  orderId: string;
  customerName: string;
  phone: string;
  area: string;
  items: CartItem[];
  total: number;
  sourceUrl: string;
  eventId: string;
}

export interface SheetsOrderPayload {
  secret: string;
  orderId: string;
  date: string;
  customerName: string;
  phone: string;
  area: string;
  items: string;
  total: number;
  currency: string;
  sourceUrl: string;
  status: string;
  eventId: string;
}

export function cartItemsToOrderLines(items: CartItem[]): OrderLineItem[] {
  return items.map((item) => ({
    productId: item.productId,
    sku: item.sku,
    name: item.name,
    bundleId: item.offerId,
    unitPriceAed: item.price,
    quantity: item.offerQuantity * item.qty,
  }));
}

export function formatOrderItemsSummary(items: CartItem[]): string {
  return items
    .map((item) => {
      const qty = item.offerQuantity * item.qty;
      const lineTotal = item.price * item.qty;
      return `${item.name} (${item.offerLabel}) x${qty} — ${lineTotal} ${businessConfig.market.currency}`;
    })
    .join(" | ");
}

export function buildSheetsOrderPayload(
  input: SubmitOrderInput,
  secret: string
): SheetsOrderPayload {
  return {
    secret,
    orderId: input.orderId,
    date: new Date().toISOString(),
    customerName: input.customerName,
    phone: input.phone,
    area: input.area,
    items: formatOrderItemsSummary(input.items),
    total: input.total,
    currency: businessConfig.market.currency,
    sourceUrl: input.sourceUrl,
    status: "new",
    eventId: input.eventId,
  };
}

function getBasePath(): string {
  return process.env.NEXT_PUBLIC_BASE_PATH || "";
}

export async function postToGoogleAppsScript(
  webhookUrl: string,
  payload: SheetsOrderPayload
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    redirect: "follow",
  });

  const text = await res.text();
  try {
    const data = JSON.parse(text) as { success: boolean; error?: string };
    if (!data.success) {
      throw new Error(data.error || "sheets_rejected");
    }
    return data;
  } catch (error) {
    if (error instanceof Error && error.message !== "sheets_rejected") {
      throw new Error("invalid_sheets_response");
    }
    throw error;
  }
}

export async function submitOrder(input: SubmitOrderInput): Promise<void> {
  const externalApi = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  const basePath = getBasePath();
  const orderBody = {
    orderId: input.orderId,
    customerName: input.customerName,
    phone: input.phone,
    area: input.area,
    items: cartItemsToOrderLines(input.items),
    total: input.total,
    currency: businessConfig.market.currency,
    sourceUrl: input.sourceUrl,
    eventId: input.eventId,
  };

  if (externalApi) {
    const res = await fetch(`${externalApi}/api/v1/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderBody),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(
        (data as { message?: string; error?: string }).message ||
          (data as { message?: string; error?: string }).error ||
          "order_failed"
      );
    }
    return;
  }

  const apiUrl = `${basePath}/api/orders/`;
  const apiRes = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderBody),
  });

  if (apiRes.ok) {
    return;
  }

  if (apiRes.status !== 404 && apiRes.status !== 405 && apiRes.status !== 503) {
    const data = await apiRes.json().catch(() => ({}));
    throw new Error(
      (data as { message?: string; error?: string }).message ||
        (data as { message?: string; error?: string }).error ||
        "order_failed"
    );
  }

  const webhookUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL;
  const webhookSecret = process.env.NEXT_PUBLIC_SHEETS_WEBHOOK_SECRET;

  if (!webhookUrl || !webhookSecret) {
    return;
  }

  await postToGoogleAppsScript(
    webhookUrl,
    buildSheetsOrderPayload(input, webhookSecret)
  );
}
