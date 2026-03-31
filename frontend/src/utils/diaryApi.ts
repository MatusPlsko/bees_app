import axios from "axios";

const API_URL = "http://147.175.150.184:8000/diary";

export interface DiaryEntryPayload {
  hive_id: string;
  action_type: string;
  note: string;
}

export interface DiaryEntryResponse extends DiaryEntryPayload {
  id: number;
  created_at: string;
}

// GET entries for a hive
export async function fetchDiaryEntries(hiveId: string): Promise<DiaryEntryResponse[]> {
  const res = await axios.get(`${API_URL}/${hiveId}`);
  return res.data;
}

// POST new entry
export async function postDiaryEntry(entry: DiaryEntryPayload): Promise<DiaryEntryResponse> {
  const res = await axios.post(API_URL, entry);
  return res.data;
}