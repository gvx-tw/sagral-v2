import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sagralautomotores.com"),
  title: {
    default: "Sagral Automotores — Venta de Autos Usados",
    template: "%s | Sagral Automotores",
  },
  description:
    "Concesionaria de vehículos usados en Argentina. Amplio stock con financiación disponible.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    siteName: "Sagral Automotores",
    locale: "es_AR",
    type: "website",
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Sagral',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}