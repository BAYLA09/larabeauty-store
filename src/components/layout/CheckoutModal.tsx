"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  X,
  Shield,
  Phone,
  CircleCheck,
  Clock,
  Star,
  Truck,
  MapPin,
  User,
  Sparkles,
  ChevronLeft,
  Loader2,
  BadgeCheck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import {
  businessConfig,
  UAE_DELIVERY_CITIES,
} from "@/lib/business-config";
import { getProductBySlug, products } from "@/lib/products";
import { formatPrice } from "@/lib/pricing";
import { trackEvent } from "@/lib/analytics";
import { submitOrder } from "@/lib/orders";

const { market, cod } = businessConfig;

const UAE_PHONE_REGEX = /^(?:\+?971)?0?5\d{8}$/;

const trustItems = [
  { icon: Shield, label: "بدون دفع الآن" },
  { icon: Phone, label: "نتصل للتأكيد" },
  { icon: Truck, label: "توصيل 2–4 أيام" },
];

function formatPhoneDisplay(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
  return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
}

function isValidUaePhone(phone: string): boolean {
  return UAE_PHONE_REGEX.test(phone.replace(/\s|-/g, ""));
}

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
  const [emirate, setEmirate] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({ name: false, phone: false, emirate: false });
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

  const phoneValid = phone.length > 0 && isValidUaePhone(phone);
  const nameValid = name.trim().length >= 2;
  const emirateValid = emirate.length > 0;
  const formReady = nameValid && phoneValid && emirateValid;

  const fullArea = [emirate, addressDetail.trim()].filter(Boolean).join(" — ");

  useEffect(() => {
    document.body.style.overflow = panel === "checkout" ? "hidden" : "";
    return () => {
      if (panel === "checkout") document.body.style.overflow = "";
    };
  }, [panel]);

  useEffect(() => {
    if (panel === "checkout" && items.length > 0) {
      trackEvent("InitiateCheckout", {
        value: total,
        currency: market.currency,
        items: items.length,
      });
    }
  }, [panel, items.length, total]);

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
    setTouched({ name: true, phone: true, emirate: true });

    if (!nameValid) {
      setError("دخلي اسمك الكامل");
      return;
    }
    if (!phoneValid) {
      setError("رقم جوال إماراتي غير صحيح — مثال: 50 123 4567");
      return;
    }
    if (!emirateValid) {
      setError("اختاري الإمارة للتوصيل");
      return;
    }

    setLoading(true);
    try {
      const orderId = `LARA-${Date.now()}`;
      const normalized = phone.replace(/\s|-/g, "");

      await submitOrder({
        orderId,
        customerName: name.trim(),
        phone: normalized.replace(/\D/g, ""),
        area: fullArea,
        items,
        total,
        sourceUrl:
          typeof window !== "undefined" ? window.location.href : "",
        eventId: `purchase_${Date.now()}`,
      });

      trackEvent("Purchase", {
        order_id: orderId,
        value: total,
        currency: market.currency,
      });

      sessionStorage.setItem(
        "lara-last-order",
        JSON.stringify({
          orderId,
          customerName: name.trim(),
          phone: `${market.phoneCountryCode}${normalized.replace(/\D/g, "")}`,
          area: fullArea,
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
      setError("صار خطأ — حاولي مرة ثانية أو تواصلي معنا على واتساب");
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
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        aria-label="إغلاق"
        onClick={closePanel}
      />
      <div
        className="checkout-modal relative flex max-h-[94vh] w-full max-w-md flex-col overflow-hidden rounded-t-[1.75rem] bg-white shadow-[0_-8px_40px_rgba(0,0,0,0.15)] sm:max-h-[90vh] sm:rounded-3xl sm:shadow-2xl"
        role="dialog"
        aria-labelledby="checkout-title"
      >
        {showUpsell && upsellProduct ? (
          <div className="p-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary/15">
              <Sparkles className="h-7 w-7 text-secondary" aria-hidden />
            </div>
            <h2 className="font-arabic text-lg font-bold text-primary">
              عرض خاص — ثواني بس!
            </h2>
            <p className="mt-2 text-sm text-muted">
              {upsellProduct.upsell.subtitle}
            </p>
            <p className="mt-4 font-arabic text-3xl font-extrabold text-secondary">
              {formatPrice(upsellProduct.upsell.price)}
            </p>
            <p className="text-sm font-semibold text-primary">
              {upsellProduct.upsell.label}
            </p>
            <button
              type="button"
              onClick={acceptUpsell}
              className="checkout-cta-pulse mt-6 w-full rounded-2xl bg-primary py-4 font-arabic text-sm font-bold text-white"
            >
              نعم، أضيفي العرض
            </button>
            <button
              type="button"
              onClick={skipUpsell}
              className="mt-3 w-full py-2 text-sm text-muted"
            >
              لا شكراً — أكملي الطلب
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-primary via-[#1a6b4f] to-primary px-5 pb-5 pt-4 text-white">
              <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-secondary/20 blur-xl" />
              <div className="relative flex items-start justify-between">
                <button
                  type="button"
                  onClick={closePanel}
                  className="rounded-full bg-white/15 p-2 transition hover:bg-white/25"
                  aria-label="إغلاق"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
                <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold">
                  <Shield className="h-3.5 w-3.5" aria-hidden />
                  COD
                </div>
              </div>
              <h2
                id="checkout-title"
                className="relative mt-4 font-arabic text-xl font-extrabold leading-tight"
              >
                تأكيد الطلب — دفع عند الاستلام
              </h2>
              <p className="relative mt-1 text-xs font-medium text-white/85">
                {cod.confirmationPromise}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <p className="py-12 text-center text-sm text-muted">السلة فاضية</p>
              ) : (
                <>
                  {/* Urgency + social proof */}
                  <div className="mb-4 flex items-center gap-2 rounded-2xl border border-amber-200/80 bg-gradient-to-l from-amber-50 to-orange-50 px-3 py-2.5">
                    <Clock className="h-4 w-4 shrink-0 text-amber-600" aria-hidden />
                    <p className="text-[11px] font-bold leading-snug text-amber-900">
                      آخر 48 ساعة — توصيل مجاني داخل الإمارات
                    </p>
                  </div>

                  <div className="mb-4 flex items-center justify-center gap-2">
                    <div className="flex items-center gap-0.5 text-secondary">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < Math.round(avgRating)
                              ? "fill-secondary"
                              : "fill-none"
                          }`}
                          aria-hidden
                        />
                      ))}
                    </div>
                    <span className="text-xs font-extrabold">{avgRating}</span>
                    <span className="text-[11px] text-muted">
                      · +200 طلب هذا الأسبوع
                    </span>
                  </div>

                  {/* Order summary */}
                  <div className="mb-5 overflow-hidden rounded-2xl border border-border/60 bg-surface-rose/60">
                    <div className="border-b border-border/50 bg-white/60 px-4 py-2.5">
                      <p className="font-arabic text-xs font-extrabold text-foreground">
                        طلبك
                      </p>
                    </div>
                    <ul className="divide-y divide-border/40 px-4">
                      {items.map((item) => {
                        const product = getProductBySlug(item.slug);
                        const img = product?.collectionImage;
                        return (
                          <li
                            key={`${item.productId}-${item.offerId}`}
                            className="flex items-center gap-3 py-3"
                          >
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white shadow-sm">
                              {img && (
                                <Image
                                  src={img}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                  unoptimized
                                />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-arabic text-xs font-bold text-foreground">
                                {item.name}
                              </p>
                              <p className="text-[10px] text-muted">
                                {item.offerLabel}
                                {item.qty > 1 ? ` ×${item.qty}` : ""}
                              </p>
                            </div>
                            <p className="shrink-0 font-arabic text-sm font-extrabold text-primary">
                              {formatPrice(item.price * item.qty)}
                            </p>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="flex items-center justify-between bg-primary/5 px-4 py-3">
                      <span className="font-arabic text-sm font-bold">المجموع</span>
                      <span className="font-arabic text-2xl font-extrabold text-primary">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>

                  {/* Form */}
                  <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="checkout-name"
                        className="mb-2 flex items-center gap-1.5 font-arabic text-sm font-bold text-foreground"
                      >
                        <User className="h-4 w-4 text-primary" aria-hidden />
                        الاسم الكامل
                        {nameValid && (
                          <BadgeCheck className="mr-auto h-4 w-4 text-primary" aria-hidden />
                        )}
                      </label>
                      <input
                        id="checkout-name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                        className={`w-full rounded-2xl border bg-white px-4 py-3.5 text-base text-foreground outline-none transition focus:ring-2 focus:ring-primary/20 sm:text-sm ${
                          touched.name && !nameValid
                            ? "border-red-300"
                            : nameValid
                              ? "checkout-field-valid"
                              : "border-border focus:border-primary"
                        }`}
                        placeholder="مثال: نورة العتيبي"
                        autoComplete="name"
                        autoFocus
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label
                        htmlFor="checkout-phone"
                        className="mb-2 flex items-center gap-1.5 font-arabic text-sm font-bold text-foreground"
                      >
                        <Phone className="h-4 w-4 text-primary" aria-hidden />
                        رقم الجوال
                        {phoneValid && (
                          <BadgeCheck className="mr-auto h-4 w-4 text-primary" aria-hidden />
                        )}
                      </label>
                      <div className="flex gap-2" dir="ltr">
                        <span className="flex items-center rounded-2xl border border-border bg-surface-rose px-3.5 text-sm font-extrabold text-primary">
                          {market.phoneCountryCode}
                        </span>
                        <input
                          id="checkout-phone"
                          required
                          type="tel"
                          inputMode="numeric"
                          enterKeyHint="next"
                          value={phone}
                          onChange={(e) =>
                            setPhone(formatPhoneDisplay(e.target.value))
                          }
                          onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                          className={`min-w-0 flex-1 rounded-2xl border bg-white px-4 py-3.5 text-base tracking-wide text-foreground outline-none transition focus:ring-2 focus:ring-primary/20 sm:text-sm ${
                            touched.phone && !phoneValid
                              ? "border-red-300"
                              : phoneValid
                                ? "checkout-field-valid"
                                : "border-border focus:border-primary"
                          }`}
                          placeholder="50 123 4567"
                          autoComplete="tel-national"
                        />
                      </div>
                      <p className="mt-1.5 text-[11px] text-muted">
                        نتصل فيك على هاد الرقم لتأكيد الطلب — تأكدي إنه صحيح
                      </p>
                    </div>

                    {/* Emirate chips */}
                    <div>
                      <label className="mb-2 flex items-center gap-1.5 font-arabic text-sm font-bold text-foreground">
                        <MapPin className="h-4 w-4 text-primary" aria-hidden />
                        الإمارة
                        {emirateValid && (
                          <BadgeCheck className="mr-auto h-4 w-4 text-primary" aria-hidden />
                        )}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {UAE_DELIVERY_CITIES.map((city) => (
                          <button
                            key={city}
                            type="button"
                            onClick={() => {
                              setEmirate(city);
                              setTouched((t) => ({ ...t, emirate: true }));
                            }}
                            className={`checkout-city-chip rounded-full border px-3 py-1.5 font-arabic text-xs font-bold ${
                              emirate === city
                                ? "checkout-city-chip-active"
                                : "border-border bg-white text-foreground hover:border-primary/40 hover:bg-primary/5"
                            }`}
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                      {touched.emirate && !emirateValid && (
                        <p className="mt-1.5 text-[11px] font-medium text-red-600">
                          اختاري إمارتك للتوصيل
                        </p>
                      )}
                    </div>

                    {/* Address detail */}
                    <div>
                      <label
                        htmlFor="checkout-address"
                        className="mb-2 block font-arabic text-sm font-bold text-foreground"
                      >
                        تفاصيل العنوان
                        <span className="mr-1 text-xs font-normal text-muted">
                          (اختياري)
                        </span>
                      </label>
                      <textarea
                        id="checkout-address"
                        rows={2}
                        value={addressDetail}
                        onChange={(e) => setAddressDetail(e.target.value)}
                        className="w-full resize-none rounded-2xl border border-border bg-white px-4 py-3 text-base text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm"
                        placeholder="مثال: ديرة، شارع الاتحاد، بناية 12، شقة 4"
                        autoComplete="street-address"
                      />
                    </div>

                    {error && (
                      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {error}
                      </div>
                    )}
                  </form>

                  {/* Trust */}
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {trustItems.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-xl bg-surface-rose/80 px-2 py-2.5 text-center"
                      >
                        <item.icon
                          className="mx-auto h-4 w-4 text-primary"
                          aria-hidden
                        />
                        <p className="mt-1 text-[9px] font-bold leading-tight text-foreground">
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="mt-3 text-center text-[10px] leading-relaxed text-muted">
                    بالمتابعة أنتِ توافقين على الشروط · دفع عند الاستلام فقط
                  </p>
                </>
              )}
            </div>

            {/* Sticky CTA */}
            {items.length > 0 && (
              <div className="shrink-0 border-t border-border/60 bg-white px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={loading}
                  className={`checkout-cta-pulse flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-arabic text-sm font-extrabold text-white transition hover:bg-primary/90 disabled:opacity-60 ${
                    formReady ? "" : "opacity-90"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                      جاري تأكيد طلبك...
                    </>
                  ) : (
                    <>
                      <CircleCheck className="h-5 w-5" aria-hidden />
                      أكد الطلب — COD · {formatPrice(total)}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={openCart}
                  className="mt-2 flex w-full items-center justify-center gap-1 py-2 text-xs font-medium text-muted hover:text-primary"
                >
                  <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
                  رجوع للسلة
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
