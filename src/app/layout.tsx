import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}