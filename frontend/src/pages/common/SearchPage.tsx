import { useState, useEffect } from "react";
import { Search, FileText, BookOpen } from "lucide-react";
import clsx from "clsx";
import useFetchAllNotes from "@/hooks/user/notes/useFetchAllNotes";
import useFetchAllFlashcards from "@/hooks/user/flashcards/useFetchAllFlashcards";
import { Link } from "react-router-dom";
import { formatDate } from "@/lib";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/skeleton/LoadingSpinner";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"notes" | "flashcards">("notes");

  const { data: notes, isLoading: notesLoading, refetch: refetchNotes } = useFetchAllNotes();
  const { data: deck, isLoading: flashcardsLoading, refetch: refetchFlashcards } = useFetchAllFlashcards();

  useEffect(() => {
    if (activeTab === "notes") {
      refetchNotes();
    } else {
      refetchFlashcards();
    }
  }, [activeTab]);

  const filteredNotes = notes?.filter((note : any) =>
    note.topic.toLowerCase().includes(query.toLowerCase())
  );

  const filteredFlashcards = deck?.filter((deck : any) =>
    deck.topic.toLowerCase().includes(query.toLowerCase())
  );

  const isLoading = activeTab === "notes" ? notesLoading : flashcardsLoading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="min-h-screen bg-background px-4 py-8 my-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center mt-20 text-foreground">Search</h1>

          {/* Search bar */}
          <div className="flex items-center bg-card rounded-full px-4 py-2 shadow-md mb-4 border border-border">
            <Search className="text-muted-foreground mr-2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="w-full focus:outline-none bg-transparent text-foreground"
            />
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-6">
            
            <button
              onClick={() => setActiveTab("flashcards")}
              className={clsx(
                "px-4 py-2 rounded-full font-medium transition-all",
                activeTab === "flashcards"
                  ? "bg-purple-500 text-white"
                  : "bg-white dark:bg-background border border-purple-500 text-purple-500"
              )}
            >
              Flashcards
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={clsx(
                "px-4 py-2 rounded-full font-medium transition-all",
                activeTab === "notes"
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-background border border-blue-500 text-blue-500"
              )}
            >
              Notes
            </button>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center"><LoadingSpinner /></div>
            ) : activeTab === "notes" ? (
              filteredNotes?.length ? (
                filteredNotes.map((item : any) => (
                  
                    <div key={item._id} className="bg-card text-foreground border border-border shadow p-4 rounded-md hover:translate-y-[-2px] transition-transform space-y-2 m-4">
                      <div className="flex items-center gap-4">
                        <FileText className="text-blue-500" />
                        <div>
                          <Link to={`/library/notes/${item._id}`} key={item._id}><h2 className="text-lg font-semibold hover:text-orange-500">{item.topic}</h2></Link>
                          <p className="text-sm text-muted-foreground">Created {formatDate(item.createdAt)}</p>
                        </div>
                      </div>
                      {item.user && (
                          <div className="flex items-center gap-3 pl-8 mt-2">
                            <img
                              src={item.user.profilePic || "avatars/avatardefault.png"}
                              alt={item.user.fullName}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                           <Link to={`/profile/${item.user.username}`}> <p className="text-sm font-medium hover:text-orange-500">{item.user.username}</p></Link>
                          </div>
                       
                      )}
                    </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">No notes found.</p>
              )
            ) : filteredFlashcards?.length ? (
              filteredFlashcards.map((item : any) => (
                  <div key={item._id} className="bg-card text-foreground border border-border shadow p-4 rounded-md hover:translate-y-[-2px] transition-transform space-y-2 m-4">
                    <div className="flex items-center gap-4">
                      <BookOpen className="text-purple-500" />
                      <div>
                        <Link to={`/library/flashcards/${item._id}`} ><h2 className="text-lg font-semibold hover:text-orange-500">{item.topic}</h2></Link>
                        <p className="text-sm text-muted-foreground">Created {formatDate(item.createdAt)}</p>
                      </div>
                    </div>
                    {item.user && (
                      <div className="flex items-center gap-3 pl-8 mt-2">
                        <img
                          src={item.user.profilePic || "avatars/avatardefault.png"}
                          alt={item.user.fullName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <Link to={`/profile/${item.user.username}`}><p className="text-sm font-medium hover:text-orange-500">{item.user.username}</p></Link>
                      </div>
                    )}
                  </div>
                
              ))
            ) : (
              <p className="text-center text-muted-foreground">No flashcards found.</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchPage;