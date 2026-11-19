"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { readProfile } from "@/lib/profile";

const KEY = "judonow-pruefung";

function readLocalDate() {
  const value = window.localStorage.getItem(KEY) ?? "";
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

export function useExamDate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [date, setDate] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    const local = readLocalDate();
    if (!isSignedIn || !user) {
      setDate(local);
      setReady(true);
      return;
    }
    const remote = readProfile(user.unsafeMetadata).examDate;
    if (remote) {
      setDate(remote);
      window.localStorage.setItem(KEY, remote);
    } else if (local) {
      setDate(local);
      void user.updateMetadata({ unsafeMetadata: { examDate: local } });
    } else {
      setDate(null);
    }
    setReady(true);
  }, [isLoaded, isSignedIn, user]);

  async function save(next: string | null) {
    setDate(next);
    if (next) window.localStorage.setItem(KEY, next);
    else window.localStorage.removeItem(KEY);
    if (isSignedIn && user) await user.updateMetadata({ unsafeMetadata: { examDate: next ?? "" } });
  }

  return { date, ready, save, isSignedIn };
}
