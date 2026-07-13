"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CircleCheck,
  CircleCheckBig,
  Sparkles,
  Flame,
  ArrowLeft,
  CircleX,
  Sprout,
  Stethoscope,
  BadgeCheck,
  TriangleAlert,
  Clock,
  Package,
  Droplet,
  HandCoins,
  Phone,
  MapPin,
  ChevronDown,
  Star,
  ShieldCheck,
  HeartHandshake,
  Truck,
} from "lucide-react";
import { businessConfig } from "@/lib/business-config";
import {
  products,
  getDefaultOffer,
  getLowestPrice,
} from "@/lib/products";
import {
  formatPrice,
  formatStartingPrice,
  formatSavings,
  formatCtaLabel,
  formatCtaShort,
} from "@/lib/pricing";
import { useCart } from "@/context/CartContext";
import { trackViewContent, trackAddToCart } from "@/lib/analytics";
import type { Product, ProductOffer } from "@/lib/types";
import { ProductImage } from "@/components/shared/FAQAccordion";
import { ProductSection, SectionHeader, StarRating } from "@/components/shared/ui";

const { cod, market } = businessConfig;

function OfferSelector({
  product,
  selectedId,
  onSelect,
}: {
  product: Product;
  selectedId: string;
  onSelect: (offer: ProductOffer) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="font-arabic text-sm font-extrabold text-foreground">
          اختاري العرض:
        </p>
        <span className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[10px] font-bold text-primary">
          نتيجة من العلبة الأولى
        </span>
      </div>
      {product.offers.map((offer) => {
        const selected = offer.id === selectedId;
        const savings = formatSavings(offer);
        const showCompare =
          offer.compareAtPrice != null &&
          offer.compareAtPrice > offer.price;
        return (
          <button
            key={offer.id}
            type="button"
            onClick={() => onSelect(offer)}
            className={`flex w-full flex-col gap-3 rounded-2xl border-2 p-4 text-right transition-all duration-200 ${
              selected
                ? "border-primary bg-primary/5 shadow-soft"
                : "border-border bg-white hover:border-primary/30"
            }`}
          >
            {offer.badge ? (
              <span className="w-fit self-end rounded-full bg-secondary px-3 py-1 text-[10px] font-bold leading-none text-primary-dark">
                {offer.badge}
              </span>
            ) : null}
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    selected
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-white"
                  }`}
                >
                  {selected ? (
                    <CircleCheckBig className="h-3 w-3" aria-hidden />
                  ) : null}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-arabic text-sm font-extrabold leading-snug text-foreground">
                    {offer.label}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    {offer.subtitle}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-start gap-1 border-s border-border/60 ps-4">
                {showCompare ? (
                  <span className="whitespace-nowrap text-xs text-muted line-through decoration-muted/80">
                    {formatPrice(offer.compareAtPrice)}
                  </span>
                ) : null}
                <span className="whitespace-nowrap font-arabic text-lg font-extrabold leading-none text-primary">
                  {formatPrice(offer.price)}
                </span>
                {savings ? (
                  <span className="whitespace-nowrap text-[11px] font-bold text-emerald-700">
                    {savings}
                  </span>
                ) : null}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function HeroSection({
  product,
  selectedOffer,
  onSelectOffer,
  onAddToCart,
  ctaRef,
}: {
  product: Product;
  selectedOffer: ProductOffer;
  onSelectOffer: (o: ProductOffer) => void;
  onAddToCart: () => void;
  ctaRef: React.RefObject<HTMLDivElement>;
}) {
  const trust = [
    { icon: HeartHandshake, title: cod.paymentLabel, sub: "بدون دفع أونلاين" },
    {
      icon: Truck,
      title: "توصيل 2–4 أيام",
      sub: market.countryName,
    },
    { icon: Truck, title: "ضمان 30 يوم", sub: "استرجاع كامل" },
    { icon: CircleCheck, title: "حلال · GMP", sub: "تركيبة واضحة" },
  ];

  const heroSrc =
    product.images.heroBeforeAfter || product.images.heroProduct;

  return (
    <section
      id="add-to-cart-section"
      className="overflow-hidden bg-gradient-to-br from-background via-surface-rose to-primary-soft py-6 sm:py-10"
    >
      <div className="mx-auto w-full max-w-lg px-4 sm:max-w-container sm:px-6 lg:max-w-container lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-12">
          <div className="overflow-hidden rounded-3xl border border-border bg-card p-3 shadow-card sm:p-4">
            {heroSrc ? (
              <ProductImage
                src={heroSrc}
                alt={product.imageAlts.heroBeforeAfter ?? product.name}
                layout="productHero"
                priority
              />
            ) : (
              <div className="mx-auto aspect-square w-full max-w-[420px] rounded-2xl bg-surface-rose" />
            )}
            <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:grid-cols-4">
              {[
                { label: "علكة في العلبة", value: "60" },
                { label: "يوم لكل علبة", value: "30" },
                { label: "حلال", value: "بكتين نباتي" },
                { label: "جودة", value: "GMP" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-border bg-background px-2 py-2.5 text-center"
                >
                  <p className="text-[10px] font-medium leading-tight text-muted">
                    {s.label}
                  </p>
                  <p className="mt-0.5 text-xs font-extrabold text-primary">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 min-w-0 space-y-4 sm:mt-6 sm:space-y-5 lg:mt-0">
            <div className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5">
              <Sparkles className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span className="text-xs font-bold leading-snug text-primary">
                {product.routineNameLocal}
                <span className="text-muted">
                  {" "}
                  · {product.routineNameEnglish}
                </span>
              </span>
            </div>
            <h1 className="text-balance font-arabic text-xl font-extrabold leading-snug text-foreground sm:text-2xl lg:text-3xl">
              {product.heroHeadline}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <StarRating
                rating={product.rating}
                count={product.reviewsCount}
              />
              <span className="text-xs text-muted">· تقييم مؤكد</span>
            </div>
            <p className="font-arabic text-lg font-extrabold text-primary sm:text-xl">
              {formatStartingPrice(selectedOffer.price)}
              <span className="mr-2 text-sm font-medium text-muted">
                / علبة
              </span>
            </p>
            {product.scarcityLine ? (
              <div className="flex items-start gap-2 rounded-2xl border border-secondary/30 bg-secondary-soft px-3 py-2.5 sm:px-4 sm:py-3">
                <Flame
                  className="mt-0.5 h-5 w-5 shrink-0 text-secondary"
                  aria-hidden
                />
                <p className="text-xs font-bold leading-relaxed text-foreground">
                  {product.scarcityLine}
                </p>
              </div>
            ) : null}
            <p className="text-sm leading-relaxed text-muted">
              {product.heroSubheadline}
            </p>
            <div className="overflow-hidden rounded-3xl border border-border bg-card p-3 shadow-card sm:p-4">
              <OfferSelector
                product={product}
                selectedId={selectedOffer.id}
                onSelect={onSelectOffer}
              />
            </div>
            <div
              ref={ctaRef}
              className="overflow-hidden rounded-3xl border border-border bg-card p-3 shadow-card sm:p-4"
            >
              <button
                type="button"
                onClick={onAddToCart}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-sm font-bold text-white shadow-soft transition hover:bg-primary/90 sm:py-4"
              >
                <span className="text-center leading-snug">
                  {formatCtaLabel(product, selectedOffer)}
                </span>
                <ArrowLeft className="h-5 w-5 shrink-0" aria-hidden />
              </button>
              <p className="mt-3 text-center text-[11px] font-medium text-muted">
                {cod.paymentLabel} · {formatPrice(selectedOffer.price)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {trust.map((t) => (
                <div
                  key={t.title}
                  className="rounded-xl border border-border bg-card px-2 py-2.5 text-center"
                >
                  <t.icon
                    className="mx-auto h-4 w-4 text-primary"
                    aria-hidden
                  />
                  <p className="mt-1 text-[10px] font-bold leading-tight text-foreground">
                    {t.title}
                  </p>
                  <p className="text-[9px] leading-tight text-muted">{t.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 w-full max-w-lg px-4 sm:mt-8 sm:max-w-container sm:px-6 lg:max-w-container lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-foreground text-white sm:rounded-3xl">
          <div className="flex flex-col gap-3 p-4 sm:gap-4 sm:p-5 lg:grid lg:grid-cols-4 lg:gap-4">
            {product.badges.map((badge) => (
              <div key={badge} className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/15 ring-1 ring-secondary/40">
                  <ShieldCheck
                    className="h-5 w-5 text-secondary"
                    aria-hidden
                  />
                </div>
                <p className="min-w-0 flex-1 text-xs font-extrabold leading-snug sm:text-sm">
                  {badge}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StickyBar({
  product,
  offer,
  onClick,
  visible,
}: {
  product: Product;
  offer: ProductOffer;
  onClick: () => void;
  visible: boolean;
}) {
  if (!visible) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white/95 shadow-[0_-8px_30px_rgba(19,78,58,0.12)] backdrop-blur-md">
      <div className="mx-auto flex max-w-container items-center gap-3 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6">
        <div className="hidden min-w-0 flex-1 sm:block">
          <p className="truncate font-arabic text-xs font-bold text-foreground">
            {product.shortName}
          </p>
          <p className="font-arabic text-sm font-extrabold text-primary">
            {formatPrice(offer.price)}
          </p>
        </div>
        <button
          type="button"
          onClick={onClick}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 font-arabic text-sm font-bold text-white sm:flex-none sm:px-8"
        >
          {formatCtaShort(product)}
          <ArrowLeft className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}

export function ProductLandingPage({ product }: { product: Product }) {
  const { addOffer, setOpen } = useCart();
  const defaultOffer = useMemo(() => getDefaultOffer(product), [product]);
  const [selectedOffer, setSelectedOffer] =
    useState<ProductOffer>(defaultOffer);
  const [stickyVisible, setStickyVisible] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackViewContent({
      sku: product.sku,
      name: product.name,
      price: selectedOffer.price,
      currency: market.currency,
    });
  }, [product.sku, product.name, selectedOffer.price]);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleAddToCart = useCallback(() => {
    addOffer(product, selectedOffer);
    trackAddToCart({
      content_ids: product.sku,
      content_name: product.name,
      value: selectedOffer.price,
      currency: market.currency,
      quantity: selectedOffer.quantity,
    });
    setOpen(true);
  }, [addOffer, product, selectedOffer, setOpen]);

  const related = products.filter((p) =>
    product.relatedSlugs.includes(p.slug)
  );

  return (
    <div className="pb-28">
      <HeroSection
        product={product}
        selectedOffer={selectedOffer}
        onSelectOffer={setSelectedOffer}
        onAddToCart={handleAddToCart}
        ctaRef={ctaRef}
      />

      <ProductSection variant="white">
        <SectionHeader
          eyebrow="هل تعانين من هذه؟"
          title="مشاكل تعرفينها — وحلول من الداخل"
          subtitle={product.problem}
        />
        <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <div className="mx-auto w-full max-w-md">
              <ProductImage
                src={product.images.problemImage}
                alt={product.imageAlts.problemImage}
                layout="sectionPortrait"
                frameClassName="overflow-hidden rounded-[2rem] border-8 border-white shadow-2xl"
              />
            </div>
          </div>
          <div className="flex flex-col justify-center lg:col-span-7">
            <p className="text-base leading-relaxed text-muted sm:text-lg">
              {product.emotionalPain}
            </p>
            {product.insightStat && (
              <div className="mt-6 rounded-3xl bg-primary p-6 text-white shadow-soft">
                <p className="font-arabic text-4xl font-extrabold text-secondary">
                  {product.insightStat.value}
                </p>
                <p className="mt-3 text-sm leading-relaxed sm:text-base">
                  {product.insightStat.label}
                </p>
                {product.insightStat.source && (
                  <p className="mt-3 text-[11px] text-white/60">
                    {product.insightStat.source}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </ProductSection>

      <ProductSection variant="rose">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          {product.problemCards.map((card) => (
            <div
              key={card.pain}
              className="overflow-hidden rounded-3xl border border-border bg-white shadow-card"
            >
              <div className="flex items-start gap-3 border-b border-border bg-white p-5">
                <CircleX
                  className="mt-0.5 h-5 w-5 shrink-0 text-red-500"
                  aria-hidden
                />
                <p className="flex-1 text-sm font-medium italic leading-relaxed text-foreground">
                  {card.pain}
                </p>
              </div>
              <div className="flex items-start gap-3 bg-emerald-50/80 p-5">
                <CircleCheck
                  className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
                  aria-hidden
                />
                <p className="flex-1 text-sm leading-relaxed text-muted">
                  {card.solution}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ProductSection>

      <ProductSection variant="white">
        <SectionHeader
          eyebrow="ليش يصير هالشي؟"
          title="كيف يشتغل الروتين؟"
          subtitle={product.mechanism}
        />
        <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-surface-rose p-6 sm:p-10">
          <p className="text-sm font-extrabold text-secondary">
            {product.mainIngredient}
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            {product.desiredOutcome}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-foreground sm:text-base">
            {product.mechanism}
          </p>
        </div>
      </ProductSection>

      <ProductSection variant="rose">
        <SectionHeader title="شنو ما راح تلقين داخل العلبة" />
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {product.exclusions.map((item) => (
            <li
              key={item}
              className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-white px-3 py-4 text-center text-xs font-bold text-foreground"
            >
              <CircleX className="h-4 w-4 shrink-0 text-red-500" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </ProductSection>

      <ProductSection variant="white">
        <SectionHeader
          eyebrow="التركيبة"
          title="تركيبة سريرية، مو وعود فاضية"
          subtitle="كل مكوّن بجرعة واضحة — بدون مكونات سرية."
        />
        <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
          {product.authority.certifications.map((c) => (
            <div
              key={c}
              className="rounded-2xl border border-border bg-surface-rose py-4 text-center text-sm font-extrabold text-primary"
            >
              {c}
            </div>
          ))}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {product.ingredientStack.map((ing) => (
            <div
              key={ing.name}
              className="rounded-3xl border border-border bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
                <Sprout className="h-5 w-5 text-primary" aria-hidden />
              </div>
              <h3 className="font-arabic text-lg font-extrabold text-foreground">
                {ing.name}
              </h3>
              {ing.dosage && (
                <p className="mt-1 text-xs font-bold text-secondary">
                  {ing.dosage}
                </p>
              )}
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {ing.benefit}
              </p>
              <p className="mt-2 text-[11px] text-muted/80">{ing.proof}</p>
            </div>
          ))}
        </div>
      </ProductSection>

      <ProductSection variant="rose">
        <div className="max-w-3xl rounded-[2rem] border-2 border-secondary/30 bg-white p-6 sm:p-10 lg:mx-auto">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5">
            <Stethoscope className="h-4 w-4 text-primary" aria-hidden />
            <span className="text-[11px] font-bold text-primary">رأي مختص</span>
          </div>
          <p className="text-base leading-relaxed text-foreground sm:text-lg">
            {product.authority.expertQuote}
          </p>
          <p className="mt-6 font-arabic text-sm font-extrabold text-secondary">
            {product.authority.expertTitle}
          </p>
        </div>
      </ProductSection>

      <ProductSection variant="white">
        <SectionHeader
          eyebrow="نتيجة من أول علبة"
          title="وش راح تشوفين خلال أول 30 يوم؟"
          subtitle="النتيجة تختلف — الاستمرار هو المفتاح."
        />
        <div className="relative mx-auto grid max-w-5xl gap-5 md:grid-cols-3 md:gap-7">
          {product.timeline.map((step, i) => (
            <div
              key={step.label}
              className="relative rounded-3xl border border-border bg-white p-6 pt-10 shadow-card"
            >
              <span className="absolute -top-4 right-1/2 flex h-9 w-9 translate-x-1/2 items-center justify-center rounded-full bg-primary font-arabic text-sm font-bold text-secondary">
                {i + 1}
              </span>
              <p className="text-center font-arabic text-base font-extrabold text-foreground">
                {step.label}
              </p>
              <p className="mt-3 text-center text-sm leading-relaxed text-muted">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </ProductSection>

      <ProductSection variant="rose">
        <SectionHeader
          title="ما تقوله العميلات؟"
          subtitle="تقييمات مؤكدة — دفع عند الاستلام."
        />
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3 md:gap-6">
          {product.testimonials.map((t) => (
            <div
              key={t.name}
              className="relative flex flex-col rounded-3xl border border-border bg-surface-rose p-6 sm:p-7"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-secondary">★★★★★</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                  <BadgeCheck className="h-3 w-3" aria-hidden />
                  مؤكدة
                </span>
              </div>
              <p className="flex-1 text-sm leading-relaxed text-foreground">
                {t.quote}
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-border/60 pt-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary font-arabic text-sm font-bold text-secondary">
                  {t.initial}
                </span>
                <div>
                  <p className="font-arabic text-sm font-extrabold text-foreground">
                    {t.name}
                  </p>
                  <p className="text-[11px] text-muted">{t.meta}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ProductSection>

      <ProductSection variant="white">
        <SectionHeader
          eyebrow="التوصيل والدفع"
          title="كيف يوصلك طلبك — بكل بساطة"
          subtitle={cod.paymentLabel}
        />
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3 md:gap-7">
          {[
            {
              icon: HandCoins,
              title: "اطلبي الآن",
              body: "اختاري العرض، اكتبي اسمك ورقمك — بدون دفع أونلاين.",
            },
            {
              icon: Phone,
              title: cod.confirmationPromise,
              body: "عربي 100% — نأكد العنوان والكمية.",
            },
            {
              icon: Truck,
              title: "استلمي وادفعي",
              body: "تدفعين كاش أو بطاقة لما يوصلك الطلب.",
            },
          ].map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-3xl border border-border bg-surface-rose p-6 pt-10"
            >
              <span className="absolute -top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white">
                <step.icon className="h-4 w-4" aria-hidden />
              </span>
              <p className="font-arabic text-base font-extrabold text-foreground">
                {step.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.body}
              </p>
              <span className="absolute left-4 top-4 font-arabic text-xs font-bold text-secondary/60">
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      </ProductSection>

      <ProductSection variant="rose">
        <SectionHeader title={`نوصّل لكل مناطق ${market.countryName}`} />
        <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-white p-6 shadow-card">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" aria-hidden />
            <p className="font-arabic text-sm font-extrabold text-foreground">
              مدن التوصيل
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.delivery.cities.map((city) => (
              <span
                key={city}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-rose px-3 py-1.5 text-[11px] font-medium text-foreground"
              >
                <CircleCheck
                  className="h-3 w-3 text-emerald-600"
                  aria-hidden
                />
                {city}
              </span>
            ))}
          </div>
          {product.delivery.carriers.length > 0 && (
            <p className="mt-5 flex items-center gap-2 text-[11px] text-muted">
              <Truck className="h-4 w-4" aria-hidden />
              {product.delivery.carriers.join(" • ")}
            </p>
          )}
        </div>
      </ProductSection>

      {related.length > 0 && (
        <ProductSection variant="rose">
          <SectionHeader title="منتجات أخرى من لارا" />
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 md:gap-8">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="group flex gap-5 rounded-3xl border border-border bg-white p-4 shadow-xl transition hover:-translate-y-1 hover:border-primary/50 sm:p-5"
              >
                <ProductImage
                  src={p.collectionImage}
                  alt={p.collectionImageAlt}
                  layout="thumb"
                />
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <p className="font-arabic text-base font-extrabold leading-snug text-foreground group-hover:text-primary">
                    {p.cardHeadline}
                  </p>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">
                    {p.cardSubheadline}
                  </p>
                  <p className="mt-3 font-arabic text-sm font-extrabold text-secondary">
                    {formatStartingPrice(getLowestPrice(p))}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </ProductSection>
      )}

      <StickyBar
        product={product}
        offer={selectedOffer}
        onClick={handleAddToCart}
        visible={stickyVisible}
      />
    </div>
  );
}
