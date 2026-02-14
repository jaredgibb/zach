import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientPortalBanner from "@/components/ClientPortalBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
      title: "Diversified Psychological Services | Therapy in Kalamazoo, MI",
      description: "Professional therapy services in Kalamazoo, MI. Individual therapy, couples counseling, and family therapy. Accepting most major insurance providers.",
};

export default function RootLayout({
      children,
}: {
      children: React.ReactNode;
}) {
      return (
            <html lang="en">
                  <body className={inter.className}>
                        <ClientPortalBanner />
                        <Header />
                        <main className="min-h-screen">{children}</main>
                        <Footer />
                  </body>
            </html>
      );
}
