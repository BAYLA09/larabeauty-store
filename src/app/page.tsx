import { HomeHero } from "@/components/home/HomeHero";
import { ProductGrid } from "@/components/home/ProductGrid";
import { WhyLara } from "@/components/home/WhyLara";
import { HomeTestimonials } from "@/components/home/HomeTestimonials";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CtaBanner } from "@/components/home/CtaBanner";
import { FAQAccordion } from "@/components/shared/FAQAccordion";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <ProductGrid />
      <WhyLara />
      <HomeTestimonials />
      <HowItWorks />
      <CtaBanner />
      <FAQAccordion />
      <SiteFooter />
    </>
  );
}
