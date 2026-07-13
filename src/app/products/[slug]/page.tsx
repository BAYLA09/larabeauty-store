import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { businessConfig } from "@/lib/business-config";
import { ProductLandingPage } from "@/components/product/ProductLandingPage";

const slugs = ["magnesium-sleep", "epimedium-energy", "focus-clarity"] as const;

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return {};
  return {
    title: `${product.name} | ${businessConfig.brand.nameLocal}`,
    description: product.heroSubheadline,
  };
}

export default function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();
  return <ProductLandingPage product={product} />;
}
