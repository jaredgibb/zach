import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientPortalBanner from "@/components/ClientPortalBanner";
import { getPublishedNavItems } from "@/lib/cms/server";

const inter = Inter({ subsets: ["latin"] });
const fallbackMetadataBase = "http://localhost:3000";

function getMetadataBase(): URL {
      const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
      if (configured) {
            try {
                  return new URL(configured);
            } catch {
                  return new URL(fallbackMetadataBase);
            }
      }

      return new URL(fallbackMetadataBase);
}

export const metadata: Metadata = {
      metadataBase: getMetadataBase(),
      title: "Diversified Psychological Services | Therapy in Kalamazoo, MI",
      description: "Professional therapy services in Kalamazoo, MI. Individual therapy, couples counseling, and family therapy. Accepting most major insurance providers.",
};

export default async function RootLayout({
      children,
}: {
      children: React.ReactNode;
}) {
      const { headerItems, footerItems } = await getPublishedNavItems();

      return (
            <html lang="en">
                  <body className={inter.className}>
                        <ClientPortalBanner />
                        <Header cmsItems={headerItems} />
                        <main className="min-h-screen">{children}</main>
                        <Footer cmsItems={footerItems} />
                  </body>
            </html>
      );
}
