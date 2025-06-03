import { useQuery } from "@tanstack/react-query";

const useFetchAllFlashcards = () => {
  return useQuery({
    queryKey: ["flashcard-deck-all"],
    queryFn: async () => {
      const res = await fetch(`/api/user/flashcards/all`);
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to fetch flashcards");
      }
      return data.data;
    },
  });
};

export default useFetchAllFlashcards;