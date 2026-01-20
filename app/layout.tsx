import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const notoArabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dar Sebastien | Virtual Guide",
  description: "Welcome to the International Cultural Center of Hammamet. I am Elishaar, your virtual guide to this historic villa.",
  keywords: ["Dar Sebastien", "Hammamet", "Tunisia", "Cultural Center", "George Sebastian", "Festival"],
  authors: [{ name: "International Cultural Center of Hammamet" }],
  openGraph: {
    title: "Dar Sebastien | Virtual Guide",
    description: "Discover the rich history and beauty of Dar Sebastien with our AI-powered virtual guide.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${notoArabic.variable}`}>
        {children}
      </body>
    </html>
  );
}
