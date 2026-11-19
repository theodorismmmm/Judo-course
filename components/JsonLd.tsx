import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, absoluteUrl } from "@/lib/site";

const organization = {
  "@type": "Organization",
  "@id": absoluteUrl("/#organisation"),
  name: SITE_NAME,
  url: absoluteUrl("/"),
  logo: {
    "@type": "ImageObject",
    url: absoluteUrl("/logo.png"),
    width: 512,
    height: 512,
  },
  image: absoluteUrl("/logo.png"),
  description: SITE_DESCRIPTION,
};

const website = {
  "@type": "WebSite",
  "@id": absoluteUrl("/#website"),
  url: absoluteUrl("/"),
  name: SITE_NAME,
  alternateName: ["Judo Now", "JudoNOW Deutschland"],
  description: SITE_TAGLINE,
  inLanguage: "de-DE",
  publisher: { "@id": absoluteUrl("/#organisation") },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: absoluteUrl("/suche?q={search_term_string}"),
    },
    "query-input": "required name=search_term_string",
  },
};

const graph = {
  "@context": "https://schema.org",
  "@graph": [organization, website],
};

/** Organisation + Website JSON-LD, inkl. Logo für Google. */
export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
