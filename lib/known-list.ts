export type KnownAccount = {
  id: string;
  unsafeMetadata: unknown;
  updateMetadata: (params: { unsafeMetadata: { known: string[] } }) => Promise<unknown>;
};

export function createKnownWriter(read: (metadata: unknown) => string[]) {
  let queue: Promise<void> = Promise.resolve();
  let latest: string[] | null = null;
  let latestUserId: string | null = null;

  return function updateKnown(user: KnownAccount, mutate: (current: string[]) => string[]) {
    const job = queue.then(async () => {
      const base = latestUserId === user.id && latest !== null ? latest : read(user.unsafeMetadata);
      const next = mutate([...base]);
      await user.updateMetadata({ unsafeMetadata: { known: next } });
      latestUserId = user.id;
      latest = next;
    });
    queue = job.then(
      () => undefined,
      () => undefined,
    );
    return job;
  };
}
