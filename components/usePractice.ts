"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { updatePractice } from "@/lib/practice-writes";
import { emptyPractice, mergePractice, readPractice, samePractice, type Practice } from "@/lib/practice";

const KEY = "judonow-practice";

function readLocal() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyPractice();
    return readPractice({ practice: JSON.parse(raw) });
  } catch {
    return emptyPractice();
  }
}

function writeLocal(practice: Practice) {
  window.localStorage.setItem(KEY, JSON.stringify(practice));
}

export function usePractice() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [practice, setPractice] = useState<Practice>(emptyPractice());
  const [ready, setReady] = useState(false);
  const practiceRef = useRef(practice);
  practiceRef.current = practice;

  useEffect(() => {
    if (!isLoaded) return;
    const local = readLocal();
    if (!isSignedIn || !user) {
      practiceRef.current = local;
      setPractice(local);
      setReady(true);
      return;
    }
    const remote = readPractice(user.unsafeMetadata);
    const merged = mergePractice(local, remote);
    practiceRef.current = merged;
    setPractice(merged);
    setReady(true);
    writeLocal(merged);
    if (!samePractice(merged, remote)) void updatePractice(user, merged);
  }, [isLoaded, isSignedIn, user]);

  async function save(next: Practice) {
    practiceRef.current = next;
    setPractice(next);
    writeLocal(next);
    if (isSignedIn && user) await updatePractice(user, next);
  }

  return { practice, ready, isSignedIn, save };
}
