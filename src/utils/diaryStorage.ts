export type DiaryEntry = {
  id: string;
  hiveId: string;
  actionType: string;
  note: string;
  createdAt: string; // ISO
};

const keyForHive = (hiveId: string) => `bees_diary:${hiveId}`;
const lastHiveKey = "bees_diary:lastHiveId";

function safeUUID() {
  // crypto.randomUUID fallback
  if (globalThis.crypto && "randomUUID" in globalThis.crypto) {
    // @ts-ignore
    return globalThis.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function loadDiary(hiveId: string): DiaryEntry[] {
  try {
    const raw = localStorage.getItem(keyForHive(hiveId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DiaryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveDiary(hiveId: string, entries: DiaryEntry[]) {
  localStorage.setItem(keyForHive(hiveId), JSON.stringify(entries));
}

export function addDiaryEntry(
  hiveId: string,
  entry: Omit<DiaryEntry, "id" | "createdAt">
) {
  const existing = loadDiary(hiveId);
  const newEntry: DiaryEntry = {
    id: safeUUID(),
    createdAt: new Date().toISOString(),
    ...entry,
  };
  const updated = [newEntry, ...existing];
  saveDiary(hiveId, updated);
  return updated;
}

export function deleteDiaryEntry(hiveId: string, entryId: string) {
  const existing = loadDiary(hiveId);
  const updated = existing.filter((e) => e.id !== entryId);
  saveDiary(hiveId, updated);
  return updated;
}

export function setLastDiaryHiveId(hiveId: string) {
  localStorage.setItem(lastHiveKey, hiveId);
}

export function getLastDiaryHiveId(): string | null {
  return localStorage.getItem(lastHiveKey);
}