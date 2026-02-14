import type { Metadata } from "next";
import { Lora, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientPortalBanner from "@/components/ClientPortalBanner";
import { getPublishedNavItems } from "@/lib/cms/server";

const sourceSans = Source_Sans_3({
      subsets: ["latin"],
      variable: "--font-body",
      weight: ["400", "500", "600", "700"],
});

const lora = Lora({
      subsets: ["latin"],
      variable: "--font-display",
      weight: ["500", "600", "700"],
});
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
                  <body className={`${sourceSans.className} ${sourceSans.variable} ${lora.variable}`}>
                        <div className="public-site-shell">
                              <ClientPortalBanner />
                              <Header cmsItems={headerItems} />
                              <main className="min-h-screen">{children}</main>
                              <Footer cmsItems={footerItems} />
                        </div>
                  </body>
            </html>
      );
}
