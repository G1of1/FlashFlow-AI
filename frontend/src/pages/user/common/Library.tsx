import { useState } from "react";
import { FileText, BookOpen, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "@/lib";
import LoadingSpinner from "@/components/skeleton/LoadingSpinner";
import useDeleteNotes from "@/hooks/user/notes/useDeleteNotes";
import useDeleteFlashcard from "@/hooks/user/flashcards/useDeleteFlashcard";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import useFetchUserNotes from "@/hooks/user/notes/useFetchUserNotes";
import useFetchUserDecks from "@/hooks/user/flashcards/useFetchUserDecks";


const Library = () => {
  const [tab, setTab] = useState<"notes" | "flashcards">("flashcards");
  const { data: notes, isLoading: notesLoading, refetch: refetchNotes } = useFetchUserNotes();
  const { data: decks, isLoading: decksLoading, refetch: refetchDecks } = useFetchUserDecks();

  const { deleteNotes, isLoading: deletingNotes } = useDeleteNotes();
  const { deleteDeck, isLoading: deletingDeck } = useDeleteFlashcard();
  const { toast } = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: "notes" | "flashcards" } | null>(null);


  

  

  if (notesLoading || decksLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-br from-white via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <div className="max-w-6xl mx-auto px-4 py-8 my-12">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-10">
          📚 My Library
        </h1>

        <div className="flex justify-center gap-4 mb-10">
          <button
            onClick={() => setTab("flashcards")}
            className={`px-6 py-2 rounded-full font-medium transition-colors duration-300 shadow-md hover:shadow-lg ${
              tab === "flashcards"
                ? "bg-purple-500 text-white"
                : "bg-white text-purple-500 border border-purple-500 dark:bg-gray-800 dark:text-purple-400 dark:border-purple-400"
            }`}
          >
            Flashcards
          </button>
          <button
            onClick={() => setTab("notes")}
            className={`px-6 py-2 rounded-full font-medium transition-colors duration-300 shadow-md hover:shadow-lg ${
              tab === "notes"
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-500 border border-blue-500 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-400"
            }`}
          >
            Notes
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-50 h-8">
          {(tab === "notes" ? notes : decks)?.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
              No {tab} available. Create one <Link to={`/upload/${tab}`} className="text-orange-500 underline">here</Link>.
            </p>
          ) : (
            (tab === "notes" ? notes : decks).map((item: any) => (
              <Link to={`/library/${tab}/${item._id}`} key={item._id}>
                {(tab === "notes" ? deletingNotes : deletingDeck) ? (
                  <LoadingSpinner />
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-5 flex justify-between items-center group">
                    <div className="flex gap-4 items-start">
                      {tab === "notes" ? (
                        <FileText className="w-10 h-10 text-blue-500 dark:text-blue-400" />
                      ) : (
                        <BookOpen className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                      )}
                      <div>
                        <h2 className="font-semibold text-lg text-gray-800 dark:text-white">{item.topic}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Created {formatDate(item?.createdAt)}</p>
                      </div>
                    </div>
                    <button
                       onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDeleteTarget({ id: item._id, type: tab });
                      setIsDeleteModalOpen(true);
                        }}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </Link>
            ))
          )}
        </div>
      </div>
    </motion.div>
    <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
  <DialogContent className="max-w-md">
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <DialogHeader className="flex items-center gap-3">
        <AlertTriangle className="w-6 h-6 text-red-500" />
        <DialogTitle className="text-lg text-red-600 dark:text-red-400">Are you absolutely sure?</DialogTitle>
      </DialogHeader>

      <div className="text-gray-700 dark:text-gray-300 mt-2">
        This action will permanently delete this {deleteTarget?.type === "notes" ? "note" : "flashcard deck"} and cannot be undone.
      </div>

      <DialogFooter className="flex justify-end gap-3 pt-4">
        <Button
          variant="outline"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={async () => {
            if (!deleteTarget) return;
            try {
              if (deleteTarget.type === "notes") {
                await deleteNotes({ id: deleteTarget.id });
                refetchNotes();
              } else {
                await deleteDeck({ id: deleteTarget.id });
                refetchDecks();
              }
              setIsDeleteModalOpen(false);
            } catch (err: any) {
              toast({
                title: "Error",
                description: err.message,
                variant: "destructive",
              });
            }
          }}
        >
          Yes, delete it
        </Button>
      </DialogFooter>
    </motion.div>
  </DialogContent>
</Dialog>
</>
  );
};

export default Library;
