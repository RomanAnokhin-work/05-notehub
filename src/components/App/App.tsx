import { useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import NoteList from "../NoteList/NoteList";
import css from "./App.module.css";
import { createNote, deleteNote, fetchNotes } from "../../services/noteService";
import type { Note } from "../../types/note";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import SearchBox from "../SearchBox/SearchBox";
import { useDebouncedCallback } from "use-debounce";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

function App() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["notes", currentPage, searchQuery],
    queryFn: () => fetchNotes(currentPage, searchQuery),
    placeholderData: keepPreviousData,
  });

  const notes = (data?.notes as Note[]) || [];
  const totalPages = data?.totalPages || 0;

  const setPage = (pageNum: number) => {
    setCurrentPage(pageNum);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", currentPage] });
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const createMutation = useMutation({
    mutationFn: (note: Note) => createNote(note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", currentPage] });
      closeModal();
    },
  });

  const handleCreate = (note: Note) => {
    createMutation.mutate(note);
  };

  const handleSearchChange = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentPage(1);
      setSearchQuery(event.target.value);
    },
    300,
  );

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {<SearchBox onChange={handleSearchChange} />}
        {totalPages > 1 && (
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            setPage={setPage}
          />
        )}
        {
          <button className={css.button} onClick={openModal}>
            Create note +
          </button>
        }
      </header>
      {isLoading && <Loader />}
      {isError && <ErrorMessage error={error} />}
      {notes.length > 0 && <NoteList notes={notes} onDelete={handleDelete} />}
      {isModalOpen && <Modal onClose={closeModal} onCreate={handleCreate} />}
    </div>
  );
}

export default App;
