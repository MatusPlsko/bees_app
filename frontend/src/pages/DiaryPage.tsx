import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { hives, type Hive } from "../data/hives";

const ACTIONS = [
  "Kŕmenie úľov",
  "Liečenie úľov",
  "Vytáčanie medu",
  "Kontrola úľa",
  "Iné",
] as const;

export type DiaryEntry = {
  id: string;
  hive_id: string;   
  action_type: string; 
  note: string;
  created_at: string;
};

function formatLine(dt: Date) {
  const day = new Intl.DateTimeFormat("en-US", { weekday: "short" })
    .format(dt)
    .toUpperCase();
  const time = new Intl.DateTimeFormat("sk-SK", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(dt);
  return { day, time };
}

// URL backendu
const API_URL = "http://127.0.0.1:8000"; // uprav podľa tvojho backendu

export default function DiaryPage() {
  const [searchParams] = useSearchParams();
  const hiveFromUrl = searchParams.get("hiveId");
  const lastHive = localStorage.getItem("lastDiaryHiveId");

  const initialHiveId =
    hiveFromUrl ||
    (lastHive && hives.some((h) => h.id === lastHive) ? lastHive : null) ||
    hives[0]?.id ||
    "";

  const [selectedHiveId, setSelectedHiveId] = useState(initialHiveId);
  const [action, setAction] = useState<string>("");
  const [customAction, setCustomAction] = useState("");
  const [note, setNote] = useState("");
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  const selectedHive: Hive | undefined = useMemo(
    () => hives.find((h) => h.id === selectedHiveId),
    [selectedHiveId]
  );

  const resolvedAction = action === "Iné" ? customAction.trim() : action;

  // --- Načítanie poznámok z backendu ---
  useEffect(() => {
    if (!selectedHiveId) return;

    localStorage.setItem("lastDiaryHiveId", selectedHiveId);

    axios
      .get<DiaryEntry[]>(`${API_URL}/diary/${selectedHiveId}`)
      .then((res) => setEntries(res.data))
      .catch((err) =>
        console.error("Chyba pri načítaní poznámok:", err)
      );
  }, [selectedHiveId]);

  // --- Uloženie novej poznámky ---
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHiveId) return;
    if (!action) return alert("Vyber akciu.");
    if (action === "Iné" && !customAction.trim()) return alert("Zadaj custom action.");
    if (!note.trim()) return alert("Zadaj poznámku.");

    try {
      // POST na backend so správnym názvom pola: action_type
      const res = await axios.post<DiaryEntry>(`${API_URL}/diary/`, {
        hive_id: selectedHiveId,
        action_type: resolvedAction,  // <- presne takto, aby sa nezobrazil "-"
        note: note.trim(),
      });

      // pridanie novej poznámky do state
      setEntries((prev) => [...prev, res.data]);

      // reset formu
      setAction("");
      setCustomAction("");
      setNote("");
    } catch (err) {
      console.error("Chyba pri uložení poznámky:", err);
      alert("Nepodarilo sa uložiť poznámku.");
    }
  };

  // --- Mazanie poznámky ---
  const onDelete = async (entryId: string) => {
    try {
      await axios.delete(`${API_URL}/diary/${entryId}`);
      setEntries((prev) => prev.filter((e) => e.id !== entryId));
    } catch (err) {
      console.error("Chyba pri mazani poznámky:", err);
      alert("Nepodarilo sa vymazať poznámku.");
    }
  };

  return (
    <div className="w-full">
      {/* TITLE BAR */}
      <div className="bg-gray-300 border-y border-black py-4">
        <h1 className="text-center text-2xl sm:text-3xl font-extrabold tracking-wide">
          BEEKEEPER&apos;S DIARY
        </h1>
      </div>

      {/* HIVE SELECT */}
      <div className="bg-gray-200 border-b border-black py-6">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-2">
          <select
            className="w-full sm:w-96 bg-gray-300 border border-black px-4 py-3 text-center font-extrabold text-xl"
            value={selectedHiveId}
            onChange={(e) => setSelectedHiveId(e.target.value)}
          >
            {hives.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} ({h.city})
              </option>
            ))}
          </select>

          {selectedHive && (
            <div className="text-sm text-gray-700">
              {selectedHive.city} • {selectedHive.owner}
            </div>
          )}
        </div>
      </div>

      {/* FORM */}
      <div className="bg-gray-100 border-b border-black py-8">
        <div className="max-w-5xl mx-auto px-4">
          <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* LEFT */}
            <div className="border border-black bg-gray-200 p-4">
              <label className="block font-extrabold mb-2">
                Choose your action...
              </label>

              <select
                className="w-full bg-gray-300 border border-black px-3 py-2 font-bold"
                value={action}
                onChange={(e) => setAction(e.target.value)}
              >
                <option value="">-- vyber --</option>
                {ACTIONS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>

              <div className="mt-4 flex items-center gap-3">
                <div className="font-extrabold">Custom action type:</div>
                <input
                  className="flex-1 bg-gray-100 border border-black px-3 py-2"
                  placeholder="napr. Výmena rámikov"
                  value={customAction}
                  onChange={(e) => setCustomAction(e.target.value)}
                  disabled={action !== "Iné"}
                />
              </div>

              {action === "Iné" && (
                <div className="text-xs text-gray-700 mt-2">
                  Pri “Iné” musíš vyplniť custom action.
                </div>
              )}
            </div>

            {/* RIGHT */}
            <div className="border border-black bg-gray-200 p-4">
              <label className="block font-extrabold mb-2">Note</label>
              <textarea
                className="w-full h-28 bg-gray-100 border border-black px-3 py-2"
                placeholder="napr. Pridané 2l sirupu, kontrola zásob..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />

              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-yellow-400 border border-black px-6 py-2 font-extrabold hover:brightness-95"
                >
                  SUBMIT
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* NOTES HEADER */}
      <div className="bg-gray-300 border-y border-black py-4">
        <h2 className="text-center text-2xl font-extrabold tracking-wide">
          DIARY NOTES
        </h2>
      </div>

      {/* NOTES LIST */}
      <div className="bg-gray-100 py-6">
        <div className="max-w-5xl mx-auto px-4">
          {entries.length === 0 ? (
            <div className="text-center text-gray-600">
              Zatiaľ žiadne záznamy pre tento úľ.
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((e) => {
                const dt = new Date(e.created_at);
                const { day, time } = formatLine(dt);
                return (
                  <div
                    key={e.id}
                    className="border border-black bg-gray-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2"
                  >
                    <div className="flex items-center gap-3 font-extrabold">
                      <span className="w-10">{day}</span>
                      <span className="w-14">{time}</span>
                      <span className="hidden sm:inline">-</span>
                      <span className="font-bold">{e.action_type}</span> {/* ← tu je zmena */}
                    </div>

                    <div className="sm:ml-auto flex items-center gap-3">
                      <span className="font-extrabold">NOTE:</span>
                      <span className="font-bold">{e.note}</span>

                      <button
                        type="button"
                        onClick={() => onDelete(e.id)}
                        className="ml-2 text-sm underline font-bold"
                        title="Vymazať"
                      >
                        delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}