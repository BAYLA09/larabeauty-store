import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { businessConfig } from "@/lib/business-config";

const { market } = businessConfig;

const tags = [
  "دفع عند الاستلام",
  "حلال 100%",
  `شحن ${market.countryName}`,
  "ضمان 30 يوم",
];

export function CtaBanner() {
  return (
    <section className="py-8 lg:py-12">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] bg-primary px-6 py-12 text-center text-white shadow-soft lg:px-16 lg:py-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-secondary">
            BEGIN YOUR RITUAL
          </p>
          <h2 className="mt-4 font-arabic text-2xl font-extrabold leading-snug lg:text-3xl">
            جسمك يستاهل دعم يومي، مو وعود
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/85 lg:text-base">
            ابدئي روتين لارا اليوم. الدفع عند الاستلام، شحن {market.countryName}
            ، وضمان 30 يوم.
          </p>
          <Link
            href="#products"
            className="mt-8 inline-flex w-full max-w-md items-center justify-center gap-2 rounded-2xl bg-secondary px-7 py-4 text-sm font-bold text-primary-dark transition hover:opacity-95 sm:w-auto"
          >
            استكشفي العلكات الآن
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </Link>
          <div className="mt-8 flex flex-wrap justify-center gap-2 text-[11px] font-medium text-white/80 sm:text-xs">
            {tags.map((tag, i) => (
              <span key={tag} className="flex items-center gap-2">
                {i > 0 && (
                  <span aria-hidden className="text-white/60">
                    •
                  </span>
                )}
                <span>{tag}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
