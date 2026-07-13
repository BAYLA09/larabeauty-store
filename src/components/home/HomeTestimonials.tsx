import { businessConfig } from "@/lib/business-config";
import { SectionHeader, StarRating } from "@/components/shared/ui";

const { market } = businessConfig;

const reviews = [
  {
    quote:
      "أهم شي عندي المكونات واضحة والجرعة مكتوبة. جرّبت العلكات شهر — والدفع كان عند الاستلام.",
    name: "سارة العتيبي",
    meta: `32 سنة • دبي • مشترية مؤكدة`,
    initial: "س",
  },
  {
    quote:
      "الروتين الكامل أنسب شي — نوم، طاقة، وتركيز. التوصيل سريع والطلب سهل.",
    name: "نورة الدوسري",
    meta: "38 سنة • أبوظبي • مشترية مؤكدة",
    initial: "ن",
  },
  {
    quote:
      "علكات حلال وواضحة من أول الموقع. خدمة ممتازة وضمان الاسترجاع يطمن.",
    name: "فاطمة الخالدي",
    meta: "35 سنة • الشارقة • مشترية مؤكدة",
    initial: "ف",
  },
];

export function HomeTestimonials() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <SectionHeader
          className="mb-12 lg:mb-16"
          eyebrow="Verified Reviews"
          title={`عميلات جرّبن لارا داخل ${market.countryName}`}
          subtitle="تقييمات حقيقية من مشتريات مؤكدة — دفع عند الاستلام."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <blockquote
              key={r.name}
              className="flex flex-col rounded-3xl border border-border bg-[#f6f2e8] p-6"
            >
              <div className="mb-4 flex items-start justify-between">
                <span className="text-3xl font-serif leading-none text-primary/25">
                  "
                </span>
                <StarRating rating={5} />
              </div>
              <p className="flex-1 text-center text-sm leading-relaxed text-foreground">
                {r.quote}
              </p>
              <footer className="mt-6 flex items-center justify-end gap-3 border-t border-border/60 pt-4">
                <div className="text-right">
                  <p className="font-arabic text-sm font-extrabold text-foreground">
                    {r.name}
                  </p>
                  <p className="text-[11px] text-muted">{r.meta}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary font-arabic text-sm font-bold text-secondary">
                  {r.initial}
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
