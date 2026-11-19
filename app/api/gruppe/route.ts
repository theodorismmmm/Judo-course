import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  cleanGroupName,
  isGroupCode,
  makeCode,
  memberProgress,
  normalizeCode,
  readGroup,
} from "@/lib/group";

export const dynamic = "force-dynamic";

type Body = { action?: string; code?: string; name?: string; userId?: string };

const attempts = new Map<string, { count: number; reset: number }>();

function limited(userId: string) {
  const now = Date.now();
  const entry = attempts.get(userId);
  if (!entry || now > entry.reset) {
    attempts.set(userId, { count: 1, reset: now + 10 * 60 * 1000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 20;
}

function displayName(user: { id: string; firstName: string | null }) {
  const first = user.firstName?.trim();
  if (first) return first;
  return `Judoka ${user.id.slice(-4)}`;
}

async function everyUser(client: Awaited<ReturnType<typeof clerkClient>>) {
  const users = [];
  const limit = 100;
  for (let offset = 0; offset < 500; offset += limit) {
    const page = await client.users.getUserList({ limit, offset });
    users.push(...page.data);
    if (page.data.length < limit) break;
  }
  return users;
}

function clearedGroup() {
  return { groupRole: null, groupCode: null, groupName: null };
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Anmeldung fehlt." }, { status: 401 });
  try {
    const client = await clerkClient();
    const me = await client.users.getUser(userId);
    const mine = readGroup(me.privateMetadata);
    if (!mine) return NextResponse.json({ role: null, code: null, name: null, members: [] });
    const users = await everyUser(client);
    if (mine.role === "judoka") {
      const trainer = users.find((user) => {
        const group = readGroup(user.privateMetadata);
        return group?.role === "trainer" && group.code === mine.code;
      });
      const name = trainer ? readGroup(trainer.privateMetadata)?.name || mine.name : mine.name;
      return NextResponse.json({ role: "judoka", code: mine.code, name, members: [] });
    }
    const members = users
      .filter((user) => {
        const group = readGroup(user.privateMetadata);
        return group?.role === "judoka" && group.code === mine.code;
      })
      .slice(0, 80)
      .map((user) => memberProgress({ id: user.id, name: displayName(user), metadata: user.unsafeMetadata }));
    return NextResponse.json({ role: "trainer", code: mine.code, name: mine.name, members });
  } catch {
    return NextResponse.json(
      { error: "Gruppen sind gerade nicht erreichbar. Auf dem Server fehlt die Anmeldung an das Konto-System." },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Anmeldung fehlt." }, { status: 401 });
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Die Anfrage ist unlesbar." }, { status: 400 });
  }

  try {
    const client = await clerkClient();
    const me = await client.users.getUser(userId);
    const mine = readGroup(me.privateMetadata);

    if (body.action === "create") {
      if (mine?.role === "judoka") {
        return NextResponse.json({ error: "Verlasse zuerst deine Gruppe." }, { status: 409 });
      }
      if (mine?.role === "trainer") {
        return GET();
      }
      const users = await everyUser(client);
      const taken = new Set(
        users.flatMap((user) => {
          const group = readGroup(user.privateMetadata);
          return group?.role === "trainer" ? [group.code] : [];
        }),
      );
      let code = makeCode();
      for (let attempt = 0; attempt < 8 && taken.has(code); attempt += 1) code = makeCode();
      if (taken.has(code)) return NextResponse.json({ error: "Gerade ist kein freier Code da." }, { status: 503 });
      const name = cleanGroupName(body.name ?? "") || "Meine Gruppe";
      await client.users.updateUserMetadata(userId, {
        privateMetadata: { groupRole: "trainer", groupCode: code, groupName: name },
      });
      return NextResponse.json({ role: "trainer", code, name, members: [] });
    }

    if (body.action === "join") {
      if (mine?.role === "trainer") {
        return NextResponse.json({ error: "Du leitest schon eine Gruppe." }, { status: 409 });
      }
      if (limited(userId)) {
        return NextResponse.json({ error: "Zu viele Versuche. Warte zehn Minuten." }, { status: 429 });
      }
      const code = normalizeCode(body.code ?? "");
      if (!isGroupCode(code)) {
        return NextResponse.json({ error: "Der Code hat 6 Zeichen, ohne 0, O, 1 und I." }, { status: 400 });
      }
      const users = await everyUser(client);
      const trainer = users.find((user) => {
        const group = readGroup(user.privateMetadata);
        return group?.role === "trainer" && group.code === code;
      });
      if (!trainer) return NextResponse.json({ error: "Diesen Code gibt es nicht." }, { status: 404 });
      const name = readGroup(trainer.privateMetadata)?.name ?? "";
      await client.users.updateUserMetadata(userId, {
        privateMetadata: { groupRole: "judoka", groupCode: code, groupName: name },
      });
      return NextResponse.json({ role: "judoka", code, name, members: [] });
    }

    if (body.action === "leave") {
      await client.users.updateUserMetadata(userId, { privateMetadata: clearedGroup() });
      return NextResponse.json({ role: null, code: null, name: null, members: [] });
    }

    if (body.action === "remove") {
      if (mine?.role !== "trainer") return NextResponse.json({ error: "Nur die Leitung entfernt jemanden." }, { status: 403 });
      const targetId = body.userId ?? "";
      if (!targetId || targetId === userId) {
        return NextResponse.json({ error: "Diese Person lässt sich so nicht entfernen." }, { status: 400 });
      }
      const target = await client.users.getUser(targetId);
      const group = readGroup(target.privateMetadata);
      if (!group || group.role !== "judoka" || group.code !== mine.code) {
        return NextResponse.json({ error: "Die Person ist nicht in deiner Gruppe." }, { status: 404 });
      }
      await client.users.updateUserMetadata(targetId, { privateMetadata: clearedGroup() });
      return GET();
    }

    return NextResponse.json({ error: "Unbekannte Aktion." }, { status: 400 });
  } catch {
    return NextResponse.json(
      { error: "Gruppen sind gerade nicht erreichbar. Auf dem Server fehlt die Anmeldung an das Konto-System." },
      { status: 503 },
    );
  }
}
