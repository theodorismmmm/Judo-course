import { deDE } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
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
    "Wähle deinen Gürtel, von Weiß bis zum 2. Dan. Lehrfilme zu den Attacken, Karteikarten, und ein Konto zum Abhaken der Würfe, die du schon kannst.",
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
        </ClerkProvider>
      </body>
    </html>
  );
}
