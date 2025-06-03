import { useQuery } from "@tanstack/react-query";

const useFetchAllSavedDecks = () => {
  return useQuery({
    queryKey: ["flashcard-deck-saved"],
    queryFn: async () => {
      const res = await fetch(`/api/user/flashcards/saved`);
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to fetch flashcards");
      }
      return data.data;
    },
  });
};

export default useFetchAllSavedDecks;