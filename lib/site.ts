/** Canonical production host for SEO, sitemap and structured data. */
export const SITE_HOST = "judonow.vercel.app";
export const SITE_URL = `https://${SITE_HOST}`;
export const SITE_NAME = "JudoNOW";
export const SITE_TAGLINE = "Ready für den nächsten Gürtel";
export const SITE_DESCRIPTION =
  "JudoNOW: Gürtelplan, Lehrfilme, Workouts vor dem Training und Karteikarten. Auf Deutsch, vom iPhone-Homescreen auch offline nutzbar.";

export function absoluteUrl(path = "/") {
  if (!path.startsWith("/")) return `${SITE_URL}/${path}`;
  return `${SITE_URL}${path}`;
}
