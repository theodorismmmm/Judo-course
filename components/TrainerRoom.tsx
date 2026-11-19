"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import type { MemberProgress } from "@/lib/group";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

type GroupState = {
  role: "trainer" | "judoka" | null;
  code: string | null;
  name: string | null;
  members: MemberProgress[];
};

const EMPTY: GroupState = { role: null, code: null, name: null, members: [] };

export function TrainerRoom() {
  const { isLoaded, isSignedIn } = useUser();
  const [state, setState] = useState<GroupState>(EMPTY);
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const load = useCallback(async () => {
    const response = await fetch("/api/gruppe", { cache: "no-store" });
    const body = (await response.json()) as GroupState & { error?: string };
    if (!response.ok) {
      setNote(body.error ?? "Die Gruppe lässt sich gerade nicht laden.");
      return;
    }
    setState({
      role: body.role ?? null,
      code: body.code ?? null,
      name: body.name ?? null,
      members: body.members ?? [],
    });
    setNote("");
  }, []);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    void load().catch(() => setNote("Die Gruppe lässt sich gerade nicht laden."));
  }, [isLoaded, isSignedIn, load]);

  async function send(payload: { action: string; name?: string; code?: string; userId?: string }) {
    setPending(true);
    setNote("");
    try {
      const response = await fetch("/api/gruppe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json()) as GroupState & { error?: string };
      if (!response.ok) {
        setNote(body.error ?? "Das hat nicht geklappt.");
        return;
      }
      setState({
        role: body.role ?? null,
        code: body.code ?? null,
        name: body.name ?? null,
        members: body.members ?? [],
      });
      setCode("");
    } catch {
      setNote("Das hat nicht geklappt.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="dojo">
      <SiteHeader />
      <section className="mat" id="inhalt">
        <p className="eyebrow">Fürs Dojo</p>
        <h1>Trainer</h1>
        <p className="deck">
          Du legst eine Gruppe an und gibst den Code weiter. Die Judoka melden sich an, treten bei, und du siehst Gürtel,
          Punkte und welche Würfe noch offen sind.
        </p>
        <p className="lock-note">
          Für Kinder nur mit Wissen der Eltern. Sichtbar sind Vorname, Gürtel und Übungsstand, keine E-Mail-Adresse.
        </p>

        {!isLoaded ? (
          <p className="loading">Konto wird geladen …</p>
        ) : !isSignedIn ? (
          <p>
            <Link href="/sign-in?redirect_url=%2Ftrainer">Anmelden</Link>, dann kannst du eine Gruppe anlegen oder einem
            Code beitreten.
          </p>
        ) : state.role === "trainer" && state.code ? (
          <div className="group-panel">
            <p className="group-code">
              <span>{state.name || "Gruppe"}</span>
              <strong>{state.code}</strong>
            </p>
            <button
              type="button"
              className="cta cta-ghost"
              onClick={() => void navigator.clipboard?.writeText(state.code ?? "")}
            >
              Code kopieren
            </button>
            {state.members.length === 0 ? (
              <p>Noch niemand dabei. Der Code gehört auf den Zettel im Dojo.</p>
            ) : (
              <ul className="member-list">
                {state.members.map((member) => (
                  <li key={member.id}>
                    <div>
                      <strong>{member.name}</strong>
                      <span>
                        {member.beltName ?? "ohne Gürtel"} · {member.known} abgehakt · {member.points} Punkte · Serie{" "}
                        {member.streak}
                      </span>
                      {member.openThrows.length > 0 && <span>Offen: {member.openThrows.join(", ")}</span>}
                    </div>
                    <button
                      type="button"
                      className="text-link"
                      disabled={pending}
                      onClick={() => void send({ action: "remove", userId: member.id })}
                    >
                      Entfernen
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button type="button" className="text-link" disabled={pending} onClick={() => void send({ action: "leave" })}>
              Gruppe auflösen
            </button>
          </div>
        ) : state.role === "judoka" && state.code ? (
          <div className="group-panel">
            <p>
              Du bist in <strong>{state.name || "der Gruppe"}</strong>. Code {state.code}. Dein Gürtel und deine Häkchen
              sind für die Trainerin oder den Trainer sichtbar.
            </p>
            <button type="button" className="cta cta-ghost" disabled={pending} onClick={() => void send({ action: "leave" })}>
              Gruppe verlassen
            </button>
          </div>
        ) : (
          <div className="group-forms">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void send({ action: "create", name });
              }}
            >
              <h2>Gruppe anlegen</h2>
              <label>
                Name
                <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Dojo Mitte" />
              </label>
              <button type="submit" className="cta" disabled={pending}>
                Code erzeugen
              </button>
            </form>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void send({ action: "join", code });
              }}
            >
              <h2>Code eingeben</h2>
              <label>
                Code
                <input
                  value={code}
                  onChange={(event) => setCode(event.target.value.toUpperCase())}
                  placeholder="K7MQ2P"
                  autoComplete="off"
                />
              </label>
              <button type="submit" className="cta cta-ghost" disabled={pending}>
                Beitreten
              </button>
            </form>
          </div>
        )}
        {note && <p className="lock-note">{note}</p>}
      </section>
      <SiteFooter />
    </div>
  );
}
