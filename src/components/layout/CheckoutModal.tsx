"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  Shield,
  Phone,
  CircleCheck,
  Clock,
  Star,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { businessConfig } from "@/lib/business-config";
import { getProductBySlug, products } from "@/lib/products";
import { formatPrice } from "@/lib/pricing";
import { trackEvent } from "@/lib/analytics";

const { market, cod } = businessConfig;

const UAE_PHONE_REGEX = /^(?:\+?971)?0?5\d{8}$/;

const trustItems = [
  { icon: Shield, label: "بدون دفع الآن" },
  { icon: Phone, label: "نتصل للتأكيد" },
  { icon: CircleCheck, label: "ترفضين بدون تكلفة" },
];

export function CheckoutModal() {
  const router = useRouter();
  const {
    items,
    panel,
    closePanel,
    openCart,
    clear,
    total,
    addOffer,
  } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [upsellSlug, setUpsellSlug] = useState<string | null>(null);
  const [showUpsell, setShowUpsell] = useState(false);

  const upsellProduct = useMemo(
    () => (upsellSlug ? getProductBySlug(upsellSlug) : undefined),
    [upsellSlug]
  );

  const avgRating = useMemo(
    () =>
      products.length
        ? Math.round(
            (products.reduce((s, p) => s + p.rating, 0) / products.length) *
              10
          ) / 10
        : 4.9,
    []
  );

  useEffect(() => {
    document.body.style.overflow = panel === "checkout" ? "hidden" : "";
    return () => {
      if (panel === "checkout") document.body.style.overflow = "";
    };
  }, [panel]);

  if (panel !== "checkout") return null;

  function finishCheckout(orderId: string) {
    setShowUpsell(false);
    clear();
    closePanel();
    router.push(`/thank-you?order=${orderId}`);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !phone.trim()) {
      setError("الاسم ورقم الجوال مطلوبين");
      return;
    }

    const normalized = phone.replace(/\s|-/g, "");
    if (!UAE_PHONE_REGEX.test(normalized)) {
      setError("رقم جوال إماراتي غير صحيح — مثال: 501234567");
      return;
    }

    setLoading(true);
    try {
      const orderId = `LARA-${Date.now()}`;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

      if (apiUrl) {
        const res = await fetch(`${apiUrl}/api/v1/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: name.trim(),
            phone: normalized.replace(/\D/g, ""),
            area: area.trim(),
            items: items.map((item) => ({
              productId: item.productId,
              sku: item.sku,
              name: item.name,
              bundleId: item.offerId,
              unitPriceAed: item.price,
              quantity: item.offerQuantity * item.qty,
            })),
            sourceUrl:
              typeof window !== "undefined" ? window.location.href : "",
            eventId: `purchase_${Date.now()}`,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.message || data.error || "order_failed");
        }
      }

      sessionStorage.setItem(
        "lara-last-order",
        JSON.stringify({
          orderId,
          customerName: name.trim(),
          phone: `${market.phoneCountryCode}${normalized.replace(/\D/g, "")}`,
          total,
          currency: market.currency,
        })
      );

      const firstSlug = items[0]?.slug;
      const product = firstSlug
        ? getProductBySlug(firstSlug)
        : products[0];

      if (product?.upsell.enabled) {
        setUpsellSlug(product.slug);
        setShowUpsell(true);
        trackEvent("UpsellView", {
          product_id: product.id,
          value: product.upsell.price,
        });
        setTimeout(() => {
          finishCheckout(orderId);
        }, 12000);
        return;
      }

      finishCheckout(orderId);
    } catch {
      setError("صار خطأ — حاولي مرة ثانية");
    } finally {
      setLoading(false);
    }
  }

  function skipUpsell() {
    trackEvent("UpsellSkipped");
    const stored = sessionStorage.getItem("lara-last-order");
    const orderId = stored ? JSON.parse(stored).orderId : "";
    finishCheckout(orderId);
  }

  function acceptUpsell() {
    if (!upsellProduct) return;
    const offer = upsellProduct.offers[0];
    if (offer) {
      addOffer(upsellProduct, {
        ...offer,
        price: upsellProduct.upsell.price,
        label: upsellProduct.upsell.label,
      });
      trackEvent("UpsellAccepted", { value: upsellProduct.upsell.price });
    }
    skipUpsell();
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="إغلاق"
        onClick={closePanel}
      />
      <div
        className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-6"
        role="dialog"
        aria-labelledby="checkout-title"
      >
        {showUpsell && upsellProduct ? (
          <div className="text-center">
            <h2 className="font-arabic text-lg font-bold text-primary">
              عرض خاص — ثواني بس!
            </h2>
            <p className="mt-2 text-sm text-muted">
              {upsellProduct.upsell.subtitle}
            </p>
            <p className="mt-4 font-arabic text-2xl font-bold text-secondary">
              {formatPrice(upsellProduct.upsell.price)}
            </p>
            <p className="text-sm font-semibold text-primary">
              {upsellProduct.upsell.label}
            </p>
            <button
              type="button"
              onClick={acceptUpsell}
              className="mt-6 w-full rounded-2xl bg-primary py-4 font-arabic text-sm font-bold text-white"
            >
              نعم، أضيفي العرض
            </button>
            <button
              type="button"
              onClick={skipUpsell}
              className="mt-3 w-full py-2 text-sm text-muted"
            >
              لا شكراً
            </button>
          </div>
        ) : (
          <>
            <header className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={closePanel}
                className="rounded-full p-2 text-muted transition hover:bg-surface-rose"
                aria-label="إغلاق"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
              <h2
                id="checkout-title"
                className="font-arabic text-base font-extrabold text-foreground"
              >
                إتمام الطلب
              </h2>
            </header>

            {items.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted">السلة فاضية</p>
            ) : (
              <>
                <div className="mb-4 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2.5">
                  <Clock className="h-4 w-4 shrink-0 text-red-600" aria-hidden />
                  <p className="text-xs font-bold leading-snug text-red-800">
                    آخر 48 ساعة على عرض التوصيل المجاني داخل الإمارات
                  </p>
                </div>

                <div className="mb-5 flex flex-wrap items-center justify-center gap-2 text-center">
                  <div className="flex items-center gap-0.5 text-secondary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(avgRating)
                            ? "fill-secondary"
                            : "fill-none"
                        }`}
                        aria-hidden
                      />
                    ))}
                  </div>
                  <span className="text-sm font-extrabold text-foreground">
                    {avgRating}
                  </span>
                  <span className="text-xs text-muted">
                    · +200 عميلة طلبت هذا الأسبوع
                  </span>
                </div>

                <div className="mb-5 rounded-2xl bg-surface-rose p-4">
                  <p className="mb-3 font-arabic text-sm font-extrabold text-foreground">
                    طلبك
                  </p>
                  <ul className="space-y-3">
                    {items.map((item) => {
                      const product = getProductBySlug(item.slug);
                      const img = product?.collectionImage;
                      return (
                        <li
                          key={`${item.productId}-${item.offerId}`}
                          className="flex items-start gap-3"
                        >
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white">
                            {img && (
                              <Image
                                src={img}
                                alt={item.name}
                                fill
                                className="object-cover"
                                sizes="56px"
                                unoptimized
                              />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-arabic text-xs font-bold leading-snug text-foreground">
                              {item.name}
                            </p>
                            <p className="mt-0.5 text-[11px] text-muted">
                              {item.offerLabel}
                              {item.qty > 1 ? ` · ×${item.qty}` : ""}
                            </p>
                          </div>
                          <p className="shrink-0 font-arabic text-sm font-extrabold text-foreground">
                            {formatPrice(item.price * item.qty)}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="mt-4 flex items-center justify-between border-t border-border/80 pt-3">
                    <span className="font-arabic text-sm font-bold text-foreground">
                      الإجمالي
                    </span>
                    <span className="font-arabic text-xl font-extrabold text-primary">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <p className="mt-2 flex items-center justify-center gap-1 text-center text-[11px] font-bold text-primary">
                    <CircleCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    توصيل مجاني · دفع عند الاستلام
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="checkout-name"
                      className="mb-1.5 block font-arabic text-sm font-bold text-foreground"
                    >
                      الاسم الكامل
                    </label>
                    <input
                      id="checkout-name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-2xl border border-border bg-white px-4 py-3.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                      placeholder="مثال: سارة محمد"
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="checkout-phone"
                      className="mb-1.5 block font-arabic text-sm font-bold text-foreground"
                    >
                      رقم الجوال الإماراتي
                    </label>
                    <div className="flex gap-2" dir="ltr">
                      <span className="flex items-center rounded-2xl border border-border bg-surface-rose px-3 text-sm font-bold text-muted">
                        {market.phoneCountryCode}
                      </span>
                      <input
                        id="checkout-phone"
                        required
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="min-w-0 flex-1 rounded-2xl border border-border bg-white px-4 py-3.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                        placeholder={market.phoneExample}
                        autoComplete="tel"
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-muted">
                      يرجى إدخال رقم جوال إماراتي صحيح لتأكيد التوصيل
                    </p>
                  </div>
                  <div>
                    <label
                      htmlFor="checkout-area"
                      className="mb-1.5 block font-arabic text-sm font-bold text-foreground"
                    >
                      المنطقة / العنوان
                      <span className="mr-1 text-xs font-normal text-muted">
                        (اختياري)
                      </span>
                    </label>
                    <input
                      id="checkout-area"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full rounded-2xl border border-border bg-white px-4 py-3.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                      placeholder="مثال: دبي، أبوظبي..."
                      autoComplete="street-address"
                    />
                  </div>
                  {error && (
                    <p className="text-sm font-medium text-red-600">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl bg-primary py-4 font-arabic text-sm font-bold text-white shadow-soft transition hover:bg-primary/90 disabled:opacity-60"
                  >
                    {loading
                      ? "جاري الإرسال..."
                      : "تأكيد الطلب بالدفع عند الاستلام"}
                  </button>
                </form>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  {trustItems.map((item) => (
                    <div key={item.label} className="text-center">
                      <item.icon
                        className="mx-auto h-5 w-5 text-primary"
                        aria-hidden
                      />
                      <p className="mt-1.5 text-[10px] font-bold leading-tight text-foreground">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-center text-[10px] leading-relaxed text-muted">
                  بالمتابعة أنتِ توافقين على{" "}
                  <Link href="/" className="underline underline-offset-2">
                    الشروط والأحكام
                  </Link>{" "}
                  و{" "}
                  <Link href="/" className="underline underline-offset-2">
                    سياسة الخصوصية
                  </Link>
                </p>
                <button
                  type="button"
                  onClick={openCart}
                  className="mt-3 w-full py-2 text-center text-xs font-medium text-muted hover:text-primary"
                >
                  ← رجوع للسلة
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
