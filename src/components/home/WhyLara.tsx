import {
  ShieldCheck,
  Microscope,
  Handshake,
  Truck,
} from "lucide-react";
import { businessConfig } from "@/lib/business-config";
import { SectionHeader } from "@/components/shared/ui";

const { market } = businessConfig;

const features = [
  {
    icon: ShieldCheck,
    title: "تركيبات واضحة، مو وعود فاضية",
    text: "كل مكوّن مكتوب على العلبة بجرعة واضحة. ما عندنا مكونات سرية ولا خلطات عشوائية.",
  },
  {
    icon: Microscope,
    title: "جرعات مدروسة لكل هدف",
    text: "كل علكة لمشكلة محددة: نوم، طاقة، أو تركيز — مو علكة وحدة لكل شي.",
  },
  {
    icon: Handshake,
    title: "دفع عند الاستلام + ضمان 30 يوم",
    text: "تجرّبين الروتين كاملاً. ما عجبك؟ نرجّع لك فلوسك خلال 30 يوم.",
  },
  {
    icon: Truck,
    title: `توصيل ${market.countryName} بدون دفع أونلاين`,
    text: "اسمك ورقم جوالك فقط. تدفعين كاش أو بطاقة لما يوصلك الطلب.",
  },
];

export function WhyLara() {
  return (
    <section className="bg-gradient-to-b from-surface-rose/60 to-background py-16 lg:py-24">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <SectionHeader
          className="mb-12 lg:mb-16"
          eyebrow="Why Lara Beauty"
          title="لارا مو متجر عادي — روتين يومي واضح"
          subtitle={`أربعة أركان: تركيبة واضحة، جرعات مدروسة، حلال، وراحة العميلة في ${market.countryName}.`}
        />
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-3xl border border-border bg-white p-6 shadow-card transition hover:shadow-soft"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-secondary">
                <f.icon className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="font-arabic text-lg font-extrabold text-foreground">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
