"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Phone,
  PhoneCall,
  Package,
  Truck,
  Shield,
  MessageCircle,
  Star,
  Clock,
  Sparkles,
} from "lucide-react";
import { businessConfig } from "@/lib/business-config";
import { formatPrice } from "@/lib/pricing";
import { trackEvent } from "@/lib/analytics";

const { brand, market, cod, support } = businessConfig;

interface LastOrder {
  orderId: string;
  customerName: string;
  phone: string;
  area?: string;
  total: number;
  currency: string;
}

const timeline = [
  {
    icon: PhoneCall,
    title: "نتصل فيك للتأكيد",
    desc: cod.confirmationPromise,
    time: cod.confirmationWindow,
    active: true,
  },
  {
    icon: Package,
    title: "نجهّز طلبك",
    desc: "نحضّر علبتك بعناية من مستودعنا داخل الإمارات",
    time: "اليوم",
    active: false,
  },
  {
    icon: Truck,
    title: "توصيل لباب بيتك",
    desc: cod.deliveryPromise,
    time: "2–4 أيام عمل",
    active: false,
  },
];

const trustPoints = [
  { icon: Shield, label: "دفع عند الاستلام فقط" },
  { icon: CheckCircle2, label: "ترفضين بدون أي تكلفة" },
  { icon: Star, label: "تقييم 4.9 من +200 عميلة" },
];

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 8) return phone;
  return `${digits.slice(0, 5)} ••• ${digits.slice(-3)}`;
}

export function ThankYouPage() {
  const searchParams = useSearchParams();
  const orderFromUrl = searchParams.get("order") ?? "";
  const [order, setOrder] = useState<LastOrder | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = sessionStorage.getItem("lara-last-order");
      if (raw) {
        setOrder(JSON.parse(raw) as LastOrder);
      }
    } catch {
      // ignore
    }
  }, []);

  const orderId = order?.orderId || orderFromUrl;
  const firstName = useMemo(() => {
    const name = order?.customerName?.trim();
    if (!name) return "";
    return name.split(/\s+/)[0];
  }, [order?.customerName]);

  const whatsappHref = useMemo(() => {
    if (!orderId) return "";
    const text = [
      `مرحباً ${brand.nameLocal} 👋`,
      `أكدت طلبي رقم: ${orderId}`,
      order?.customerName ? `الاسم: ${order.customerName}` : "",
      order?.phone ? `الجوال: ${order.phone}` : "",
      order?.area ? `المنطقة: ${order.area}` : "",
      "أنا جاهزة/جاهز للتأكيد والتوصيل. شكراً!",
    ]
      .filter(Boolean)
      .join("\n");
    return `https://wa.me/${support.whatsappNumber}?text=${encodeURIComponent(text)}`;
  }, [order, orderId]);

  useEffect(() => {
    if (!mounted || !order) return;
    trackEvent("Purchase", {
      value: order.total,
      currency: order.currency,
      content_name: orderId,
    });
  }, [mounted, order, orderId]);

  return (
    <div className="thank-you-bg relative overflow-hidden pb-16 pt-8 sm:pt-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="thank-you-glow absolute -left-32 -top-32 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
        <div className="thank-you-glow absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-lg px-4 sm:px-6">
        {/* Success hero */}
        <div
          className={`text-center transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        >
          <div className="thank-you-check mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary shadow-[0_12px_40px_rgba(19,78,58,0.25)]">
            <CheckCircle2
              className="h-10 w-10 text-secondary"
              strokeWidth={2.5}
              aria-hidden
            />
          </div>

          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-secondary/30 bg-secondary-soft px-3 py-1 text-[11px] font-bold text-primary">
            <Sparkles className="h-3.5 w-3.5 text-secondary" aria-hidden />
            طلبك مسجّل بنجاح
          </div>

          <h1 className="font-arabic text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
            {firstName ? (
              <>
                شكراً {firstName}! 🎉
                <br />
                <span className="text-primary">طلبك في الطريق</span>
              </>
            ) : (
              <>
                شكراً لك! 🎉
                <br />
                <span className="text-primary">طلبك في الطريق</span>
              </>
            )}
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
            {brand.nameLocal} استلمت طلبك. خطوة أخيرة بسيطة — تأكيد سريع
            بالهاتف — وبعدها نبدأ التجهيز والتوصيل.
          </p>
        </div>

        {/* Order card */}
        {orderId && (
          <div
            className={`mt-8 overflow-hidden rounded-3xl border border-border bg-white shadow-card transition-all delay-150 duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
          >
            <div className="border-b border-border bg-surface-rose px-5 py-4">
              <p className="text-center font-arabic text-xs font-bold text-muted">
                تفاصيل طلبك
              </p>
            </div>
            <div className="space-y-3 px-5 py-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-muted">رقم الطلب</span>
                <span className="font-mono text-sm font-bold text-primary">
                  {orderId}
                </span>
              </div>
              {order?.total != null && (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-muted">الإجمالي</span>
                  <span className="font-arabic text-lg font-extrabold text-foreground">
                    {formatPrice(order.total)}
                  </span>
                </div>
              )}
              {order?.phone && (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-muted">رقم التواصل</span>
                  <span className="font-mono text-sm font-semibold text-foreground" dir="ltr">
                    {maskPhone(order.phone)}
                  </span>
                </div>
              )}
              {order?.area && (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-muted">المنطقة</span>
                  <span className="text-sm font-semibold text-foreground">
                    {order.area}
                  </span>
                </div>
              )}
              <p className="rounded-2xl bg-primary/5 px-3 py-2.5 text-center text-[11px] font-bold leading-relaxed text-primary">
                {cod.paymentLabel}
              </p>
            </div>
          </div>
        )}

        {/* Critical alert — answer phone */}
        <div
          className={`mt-6 overflow-hidden rounded-3xl border-2 border-amber-300/80 bg-gradient-to-b from-amber-50 to-white p-5 shadow-soft transition-all delay-300 duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        >
          <div className="flex items-start gap-3">
            <div className="thank-you-pulse flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100">
              <Phone className="h-6 w-6 text-amber-700" aria-hidden />
            </div>
            <div>
              <p className="font-arabic text-sm font-extrabold text-amber-900">
                مهم جداً — خلّي جوالك مفتوح!
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-amber-800/90">
                بنتصل فيك {cod.confirmationWindow} من رقم إماراتي لتأكيد
                العنوان. لو ما رديتي، الطلب ما يتأكد وما نوصّل.
              </p>
              <p className="mt-2 flex items-center gap-1 text-[11px] font-bold text-amber-900">
                <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                احفظي رقمنا: {support.phoneDisplay}
              </p>
            </div>
          </div>
        </div>

        {/* WhatsApp CTA */}
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`thank-you-cta mt-5 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] px-6 py-4 font-arabic text-sm font-bold text-white shadow-[0_8px_30px_rgba(37,211,102,0.35)] transition hover:bg-[#20bd5a] ${mounted ? "opacity-100" : "opacity-0"}`}
          >
            <MessageCircle className="h-5 w-5" aria-hidden />
            أكّدي طلبك الآن عبر واتساب
          </a>
        )}
        <p className="mt-2 text-center text-[10px] text-muted">
          العملاء اللي يأكدون عبر واتساب توصيلهم أسرع بـ 3 مرات
        </p>

        {/* Timeline */}
        <div
          className={`mt-8 transition-all delay-500 duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        >
          <h2 className="mb-5 text-center font-arabic text-base font-extrabold text-foreground">
            ماذا يحدث الآن؟
          </h2>
          <ol className="relative space-y-0">
            {timeline.map((step, i) => (
              <li key={step.title} className="relative flex gap-4 pb-8 last:pb-0">
                {i < timeline.length - 1 && (
                  <span
                    className="absolute right-[22px] top-11 h-[calc(100%-2rem)] w-0.5 bg-border"
                    aria-hidden
                  />
                )}
                <div
                  className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 ${
                    step.active
                      ? "border-primary bg-primary text-white shadow-soft"
                      : "border-border bg-white text-muted"
                  }`}
                >
                  <step.icon className="h-5 w-5" aria-hidden />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-arabic text-sm font-bold text-foreground">
                      {step.title}
                    </p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        step.active
                          ? "bg-primary/10 text-primary"
                          : "bg-surface-rose text-muted"
                      }`}
                    >
                      {step.time}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    {step.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Trust row */}
        <div
          className={`mt-8 grid grid-cols-3 gap-2 transition-all delay-700 duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}
        >
          {trustPoints.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-border bg-white p-3 text-center shadow-sm"
            >
              <item.icon
                className="mx-auto h-5 w-5 text-primary"
                aria-hidden
              />
              <p className="mt-2 text-[9px] font-bold leading-tight text-foreground sm:text-[10px]">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* Guarantee */}
        <div className="mt-6 rounded-3xl border border-primary/15 bg-primary/5 p-5 text-center">
          <p className="font-arabic text-sm font-extrabold text-primary">
            {cod.returnGuarantee}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            جرّبي الروتين براحتك — إذا ما عجبك، نرجع فلوسك بدون أسئلة.
          </p>
        </div>

        <Link
          href="/"
          className="mt-8 flex w-full items-center justify-center rounded-2xl border border-border bg-white py-3.5 font-arabic text-sm font-bold text-muted transition hover:border-primary/30 hover:text-primary"
        >
          متابعة التسوّق
        </Link>
      </div>
    </div>
  );
}
