import type { Metadata, Viewport } from "next";
import { businessConfig } from "@/lib/business-config";
import { CartProvider } from "@/context/CartContext";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { CheckoutModal } from "@/components/layout/CheckoutModal";
import "./globals.css";

const { brand, market, design } = businessConfig;

export const metadata: Metadata = {
  title: `${brand.nameLocal} | علكات يومية — ${market.countryName}`,
  description: brand.description,
};

export const viewport: Viewport = {
  themeColor: design.themeColor,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={market.language} dir={market.direction}>
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <AnnouncementBar />
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <CartDrawer />
          <CheckoutModal />
        </CartProvider>
      </body>
    </html>
  );
}
