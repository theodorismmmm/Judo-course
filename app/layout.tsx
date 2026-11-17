import type { Metadata } from "next";
import { Instrument_Serif, Outfit } from "next/font/google";
import "./globals.css";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "JudoNOW — Ready für den nächsten Gürtel",
    template: "%s · JudoNOW",
  },
  description:
    "Wähle deinen Gürtel, von Weiß bis zum 2. Dan, inklusive Weiß-Gelb, Gelb-Orange und Orange-Grün. Klammern ab Gelb, Würgegriffe ab Orange. Ohne Anmeldung.",
};

export const viewport = {
  themeColor: "#f3eee4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <a className="skip-link" href="#inhalt">
          Zum Inhalt
        </a>
        {children}
      </body>
    </html>
  );
}
