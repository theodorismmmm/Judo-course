import { mergePractice, readPractice, type Practice } from "./practice";

export type PracticeAccount = {
  id: string;
  unsafeMetadata: unknown;
  updateMetadata: (params: { unsafeMetadata: { practice: Practice } }) => Promise<unknown>;
};

export function createPracticeWriter() {
  let queue: Promise<void> = Promise.resolve();
  let latest: Practice | null = null;
  let latestUserId: string | null = null;

  return function updatePractice(user: PracticeAccount, next: Practice) {
    const job = queue.then(async () => {
      const base = latestUserId === user.id && latest ? latest : readPractice(user.unsafeMetadata);
      const merged = mergePractice(base, next);
      await user.updateMetadata({ unsafeMetadata: { practice: merged } });
      latestUserId = user.id;
      latest = merged;
    });
    queue = job.then(
      () => undefined,
      () => undefined,
    );
    return job;
  };
}

export const updatePractice = createPracticeWriter();
