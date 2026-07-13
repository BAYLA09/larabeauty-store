"use client";

import Image from "next/image";
import { useState } from "react";
import { Plus } from "lucide-react";
import { getFaqItems } from "@/lib/faq";
import type { Product } from "@/lib/types";
import { SectionHeader } from "./ui";

export function FAQAccordion({ product }: { product?: Product }) {
  const items = getFaqItems(product);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-20 bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <SectionHeader
          className="mb-10 lg:mb-12"
          eyebrow="FAQ"
          title="أسئلة قبل الطلب"
          subtitle="كل شيء تحتاجين معرفته قبل الدفع عند الاستلام."
        />
        <div className="mx-auto max-w-3xl space-y-2">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                <button
                  type="button"
                  className="flex w-full items-center gap-3 px-5 py-4 text-right"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    <Plus className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="flex-1 font-arabic text-sm font-bold text-foreground sm:text-base">
                    {item.q}
                  </span>
                </button>
                {isOpen && (
                  <div className="border-t border-border px-5 pb-5 pt-2">
                    <p className="text-sm leading-relaxed text-muted">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ProductImage({
  src,
  alt,
  layout = "collection",
  priority = false,
  className = "",
  frameClassName = "",
}: {
  src: string;
  alt: string;
  layout?: "productHero" | "homeHero" | "collection" | "sectionPortrait" | "thumb";
  priority?: boolean;
  className?: string;
  frameClassName?: string;
}) {
  const layouts = {
    productHero: {
      aspect: "aspect-square w-full",
      frame:
        "relative mx-auto w-full max-w-[420px] overflow-hidden rounded-2xl bg-surface-rose",
      sizes: "(max-width: 420px) 92vw, 420px",
    },
    homeHero: {
      aspect: "aspect-[3/2] w-full max-w-lg",
      frame:
        "relative overflow-hidden rounded-[2rem] border-8 border-white bg-surface-rose shadow-xl sm:rounded-[3rem]",
      sizes: "(max-width: 768px) 100vw, 560px",
    },
    collection: {
      aspect: "aspect-square w-full",
      frame: "relative overflow-hidden rounded-2xl",
      sizes: "(max-width: 640px) 90vw, 400px",
    },
    sectionPortrait: {
      aspect: "aspect-[4/5] w-full",
      frame: "relative overflow-hidden",
      sizes: "(max-width: 448px) 90vw, 448px",
    },
    thumb: {
      aspect: "aspect-square w-full",
      frame:
        "relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-surface-rose",
      sizes: "112px",
    },
  };

  const cfg = layouts[layout];
  if (!src) return null;

  return (
    <div className={`${cfg.frame} ${frameClassName}`.trim()}>
      <div className={`relative ${cfg.aspect} ${className}`.trim()}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-center"
          sizes={cfg.sizes}
          priority={priority}
          unoptimized
        />
      </div>
    </div>
  );
}
