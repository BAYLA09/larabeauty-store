import type { ReactNode } from "react";
import { businessConfig } from "@/lib/business-config";

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  className = "",
  centered = true,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
  centered?: boolean;
}) {
  return (
    <div
      className={`${centered ? "text-center" : ""} ${className}`}
    >
      {eyebrow ? (
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-secondary">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mb-4 font-arabic text-2xl font-extrabold leading-snug text-foreground lg:text-3xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted lg:text-lg">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export function StarRating({
  rating = 5,
  count,
}: {
  rating?: number;
  count?: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <div className="flex gap-0.5 text-secondary" aria-label={`${rating} من 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="text-sm">
            {i < Math.round(rating) ? "★" : "☆"}
          </span>
        ))}
      </div>
      {count != null && (
        <span className="text-xs text-muted">({count} تقييم)</span>
      )}
    </div>
  );
}

export function ProductSection({
  children,
  variant = "white",
  className = "",
  id,
}: {
  children: ReactNode;
  variant?: "white" | "rose";
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`py-14 sm:py-16 lg:py-24 ${
        variant === "white" ? "bg-white" : "bg-surface-rose"
      } ${className}`}
    >
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}

export function CountryBadge({ label }: { label: string }) {
  const { market } = businessConfig;
  return (
    <span className="text-muted">
      {label.replace(/الكويت/g, market.countryName)}
    </span>
  );
}
