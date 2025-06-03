// src/pages/Profile.tsx
import { Link, useParams } from "react-router-dom";
import useGetProfile from "@/hooks/profile/useGetProfile";
import LoadingSpinner from "@/components/skeleton/LoadingSpinner";
import { formatDate } from "@/lib";
import useFetchProfileNotes from "@/hooks/profile/useFetchProfileNotes";
import useFetchProfileDecks from "@/hooks/profile/useFetchProfileDecks";

const ProfilePage = () => {
  const { username } = useParams();
  const { data: user, isLoading: userLoading } = useGetProfile(username);
  const { data: notes, isLoading: notesLoading } = useFetchProfileNotes(user?._id);
  const { data: decks, isLoading: decksLoading } = useFetchProfileDecks(user?._id);

  if (userLoading || notesLoading || decksLoading) {
 <LoadingSpinner />
}

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 mt-12">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{`${username}'s Profile`}</h2>
          </div>

          <div className="flex items-center gap-6">
            <img
              src={user?.profilePic || "/avatars/avatardefault.png"}
              alt="avatar"
              className="w-20 h-20 rounded-full border"
            />
            <div>
              <p className="text-xl font-semibold">{user?.username}</p>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-gray-500 text-sm">Joined {formatDate(user?.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold mb-4">Notes</h3>
          {notesLoading ? (
            <LoadingSpinner />
          ) : notes?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map((note: any) => (
                <Link to={`/library/notes/${note._id}`}>
                <div key={note._id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <h4 className="font-semibold text-lg truncate">{note.topic}</h4>
                  <p className="text-xs text-gray-400 mt-2">Created: {formatDate(note.createdAt)}</p>
                </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No notes created yet.</p>
          )}
        </div>

        {/* Flashcards Section */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold mb-4">Flashcard Decks</h3>
          {decksLoading ? (
            <LoadingSpinner />
          ) : decks?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {decks.map((deck: any) => (
                <Link to={`/library/flashcards/${deck._id}`}>
                <div key={deck._id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <h4 className="font-semibold text-lg truncate">{deck.topic}</h4>
                  <p className="text-xs text-gray-400 mt-2">Created: {formatDate(deck.createdAt)}</p>
                </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No flashcard decks created yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
