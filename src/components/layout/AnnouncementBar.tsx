"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, HeartHandshake, Truck, Award } from "lucide-react";
import { getAnnouncementItems } from "@/lib/faq";

const icons = {
  shield: ShieldCheck,
  heart: HeartHandshake,
  truck: Truck,
} as const;

export function AnnouncementBar() {
  const items = getAnnouncementItems();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [items.length]);

  return (
    <div className="relative overflow-hidden bg-primary text-white">
      <div className="mx-auto flex min-h-10 max-w-container items-center justify-center px-4 py-1 sm:px-6 lg:px-8">
        {items.map((item, i) => {
          const Icon = icons[item.icon] ?? Award;
          const active = i === index;
          return (
            <div
              key={item.text}
              className={`absolute inset-x-4 flex items-center justify-center gap-2 text-[11px] font-bold transition-all duration-500 sm:text-sm ${
                active ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              aria-hidden={!active}
            >
              <Icon className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden />
              <span className="whitespace-normal text-center leading-tight">
                {item.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
