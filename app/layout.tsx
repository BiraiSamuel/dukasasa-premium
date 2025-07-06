import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer, Header } from "@/components";
import SessionProvider from "@/utils/SessionProvider";
import Providers from "@/Providers";
import { getServerSession } from "next-auth";
import 'svgmap/dist/svgMap.min.css';




const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jezkim Hardware Premium Theme",
  description: "A showcase of the Dukasasa Premium Theme designed for high-performance hardware and tools eCommerce.",
  openGraph: {
    title: "Jezkim Hardware Premium Theme",
    description: "A showcase of the Dukasasa Premium Theme designed for high-performance hardware and tools eCommerce.",
    url: "https://jezkimpremium.dukasasa.co.ke",
    siteName: "Jezkim Hardware",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png", // Replace with your actual image path
        width: 1200,
        height: 630,
        alt: "Jezkim Hardware Premium Theme",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getServerSession();
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
      <SessionProvider session={session}>
        <Header />
        <Providers>
        {children}
        </Providers>
        <Footer />
      </SessionProvider>
        </body>
    </html>
  );
}
