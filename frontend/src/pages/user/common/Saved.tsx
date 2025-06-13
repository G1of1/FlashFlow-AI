import { useState } from "react";
import { FileText, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "@/lib";
import LoadingSpinner from "@/components/skeleton/LoadingSpinner";
import useFetchAllSavedDecks from "@/hooks/user/flashcards/useFetchAllSavedDecks";
import useFetchAllSavedNotes from "@/hooks/user/notes/useFetchAllSavedNotes";
import { motion } from "framer-motion";

const Saved = () => {
  const [tab, setTab] = useState<"notes" | "flashcards">("flashcards");
  const { data: notes, isLoading: notesLoading } = useFetchAllSavedNotes();
  const { data: decks, isLoading: decksLoading } = useFetchAllSavedDecks();

  if (notesLoading || decksLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-zinc-900 dark:to-zinc-800 px-4 py-8 mt-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-black dark:text-orange-300">
            Saved Flashcards and Notes
          </h1>

          <div className="flex justify-center mb-8 gap-4">
            <button
              onClick={() => setTab("flashcards")}
              className={`px-5 py-2.5 rounded-full shadow-md text-sm md:text-base font-medium transition duration-300 ${
                tab === "flashcards" ? "bg-purple-500 text-white" : "bg-white text-purple-500 border border-purple-500 hover:bg-purple-100"
              }`}
            >
              Flashcards
            </button>
            <button
              onClick={() => setTab("notes")}
              className={`px-5 py-2.5 rounded-full shadow-md text-sm md:text-base font-medium transition duration-300 ${
                tab === "notes" ? "bg-blue-500 text-white" : "bg-white text-blue-500 border border-blue-500 hover:bg-blue-100"
              }`}
            >
              Notes
            </button>
          </div>

          {tab === "notes" ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.length === 0 ? (
                <p className="text-center col-span-full text-gray-500 dark:text-gray-400">
                  No notes saved. Want to create some? Click
                  <Link to="/upload/notes" className="text-orange-500 ml-1 underline">
                    here
                  </Link>
                </p>
              ) : (
                notes.map((note: any) => (
                  <Link to={`/library/notes/${note._id}`} key={note._id}>
                    <div className="bg-white dark:bg-zinc-900 shadow-lg rounded-xl p-5 px-8 flex items-center justify-between hover:-translate-y-1 hover:shadow-xl transition-transform">
                      <div className="flex items-center gap-4">
                        <FileText className="w-7 h-7 text-orange-500" />
                        <div>
                          <h2 className="font-semibold text-lg text-zinc-700 dark:text-zinc-200">{note.topic}</h2>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Created {formatDate(note?.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-3 pl-8 mt-2">
                            <Link to={`/profile/${note.user.username}`}><p className="text-sm font-medium hover:text-orange-500">{note.user.username}</p></Link>
                          </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {decks.length === 0 ? (
                <>
                  <p className="text-center col-span-full text-gray-500 dark:text-gray-400">
                    No flashcard decks saved.
                  </p>
                  <p className="text-center col-span-full text-gray-500 dark:text-gray-400">
                    Create some
                    <Link to="/upload/flashcards" className="text-orange-500 ml-1 underline">
                      here!
                    </Link>
                  </p>
                </>
              ) : (
                decks.map((deck: any) => (
                  <Link to={`/library/flashcards/${deck._id}`} key={deck._id}>
                    <div className="bg-white dark:bg-zinc-900 shadow-lg rounded-xl p-5 flex items-center justify-between hover:-translate-y-1 hover:shadow-xl transition-transform">
                      <div className="flex items-center gap-4">
                        <BookOpen className="w-7 h-7 text-orange-500" />
                        <div>
                          <h2 className="font-semibold text-lg text-zinc-700 dark:text-zinc-200">{deck.topic}</h2>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Created {formatDate(deck?.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-3 pl-8 mt-2">
                             <Link to={`/profile/${deck.user.username}`}><p className="text-sm font-medium hover:text-orange-500">{deck.user.username}</p></Link>
                          </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Saved;