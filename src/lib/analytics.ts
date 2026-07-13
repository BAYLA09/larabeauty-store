export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (typeof window === "undefined") return;
  try {
    const w = window as Window & {
      fbq?: (...args: unknown[]) => void;
      ttq?: { track: (...args: unknown[]) => void };
    };
    w.fbq?.("track", eventName, params);
    w.ttq?.track(eventName, params);
  } catch {
    // analytics optional
  }
}

export function trackViewContent(product: {
  sku: string;
  name: string;
  price: number;
  currency: string;
}) {
  trackEvent("ViewContent", {
    content_ids: product.sku,
    content_name: product.name,
    value: product.price,
    currency: product.currency,
  });
}

export function trackAddToCart(params: Record<string, unknown>) {
  trackEvent("AddToCart", params);
}
