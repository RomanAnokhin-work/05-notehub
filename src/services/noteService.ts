import axios from "axios";
import type { Note } from "../types/note";

const NOTEHUB_TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const instance = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${NOTEHUB_TOKEN}`,
  },
});

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface CreateNoteResponse {
  message: string;
}
interface DeleteNoteResponse {
  message: string;
}

async function fetchNotes(
  currentPage: number,
  searchQuery: string,
): Promise<FetchNotesResponse> {
  const { data } = await instance.get<FetchNotesResponse>(
    `/notes?page=${currentPage}&perPage=12&search=${searchQuery}`,
  );
  return data;
}

async function createNote(note: Note): Promise<CreateNoteResponse> {
  const { data } = await instance.post<CreateNoteResponse>("/notes", note);
  return data;
}

async function deleteNote(id: string): Promise<DeleteNoteResponse> {
  const { data } = await instance.delete<DeleteNoteResponse>(`/notes/${id}`);
  return data;
}

export { fetchNotes, createNote, deleteNote };
