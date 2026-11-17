"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { readKnown } from "@/lib/study";

export function useKnown() {
  const { isLoaded, isSignedIn, user } = useUser();
  const known = new Set(readKnown(user?.unsafeMetadata));
  return { isLoaded, isSignedIn, user, known };
}

export function KnownMark({ slug }: { slug: string }) {
  const { isLoaded, isSignedIn, user, known } = useKnown();
  const [pending, setPending] = useState(false);
  const on = known.has(slug);

  async function toggle() {
    if (!isLoaded || pending) return;
    if (!isSignedIn || !user) {
      const here = window.location.pathname + window.location.search;
      window.location.href = `/sign-in?redirect_url=${encodeURIComponent(here)}`;
      return;
    }
    const current = readKnown(user.unsafeMetadata);
    const next = on ? current.filter((item) => item !== slug) : [...current, slug];
    setPending(true);
    try {
      await user.update({ unsafeMetadata: { ...user.unsafeMetadata, known: next } });
    } finally {
      setPending(false);
    }
  }

  return (
    <button type="button" className="known" aria-pressed={on} disabled={pending || !isLoaded} onClick={toggle}>
      {on ? "Kann ich" : "Noch nicht"}
    </button>
  );
}
