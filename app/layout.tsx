import { deDE } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Outfit } from "next/font/google";
import { PwaRegister } from "@/components/PwaRegister";
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
    "JudoNOW: Gürtelplan, Lehrfilme, Workouts vor dem Training, Karteikarten. Auch vom iPhone-Homescreen offline nutzbar.",
  applicationName: "JudoNOW",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "JudoNOW",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.webmanifest",
  icons: {
    apple: [{ url: "/icons/icon-180.png", sizes: "180x180" }],
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192" },
      { url: "/icons/icon-512.png", sizes: "512x512" },
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#f3eee4",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <ClerkProvider
          localization={deDE}
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
          afterSignOutUrl="/"
          appearance={{
            variables: {
              colorPrimary: "#16130f",
              colorDanger: "#c4452d",
              colorBackground: "#fbf7f0",
              colorForeground: "#16130f",
              borderRadius: "2px",
              fontFamily: "Outfit, sans-serif",
            },
          }}
        >
          <a className="skip-link" href="#inhalt">
            Zum Inhalt
          </a>
          {children}
          <PwaRegister />
        </ClerkProvider>
      </body>
    </html>
  );
}
