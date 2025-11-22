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
  note: Note;
}

interface DeleteNoteResponse {
  note: Note;
}

interface CreateNoteRequest {
  title: string;
  content: string;
  tag: string;
}

async function fetchNotes(
  currentPage: number,
  searchQuery: string,
): Promise<FetchNotesResponse> {
  const params: { page: number; perPage: number; search?: string } = {
    page: currentPage,
    perPage: 12,
  };

  if (searchQuery.trim() !== "") {
    params.search = searchQuery;
  }

  const { data } = await instance.get<FetchNotesResponse>(`/notes`, { params });
  return data;
}

async function createNote(
  noteData: CreateNoteRequest,
): Promise<CreateNoteResponse> {
  const { data } = await instance.post<CreateNoteResponse>("/notes", noteData);
  return data;
}

async function deleteNote(id: string): Promise<DeleteNoteResponse> {
  const { data } = await instance.delete<DeleteNoteResponse>(`/notes/${id}`);
  return data;
}

export { fetchNotes, createNote, deleteNote };
