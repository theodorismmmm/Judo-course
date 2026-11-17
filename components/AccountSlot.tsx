"use client";

import { UserButton, useUser } from "@clerk/nextjs";

export function AccountSlot() {
  const { isLoaded, isSignedIn } = useUser();
  if (!isLoaded) return <span className="text-link quiet">Konto</span>;
  if (!isSignedIn) {
    return (
      <button
        type="button"
        className="text-link"
        onClick={() => {
          const here = window.location.pathname + window.location.search;
          const next = here === "/" ? "/starten" : here;
          window.location.href = `/sign-in?redirect_url=${encodeURIComponent(next)}`;
        }}
      >
        Anmelden
      </button>
    );
  }
  return <UserButton />;
}
