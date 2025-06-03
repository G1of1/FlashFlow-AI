import { useQuery } from "@tanstack/react-query";

const useFetchFlashcards = (id: string | undefined) => {
  return useQuery({
    queryKey: ["flashcard-deck", id],
    queryFn: async () => {
      const res = await fetch(`/api/user/flashcards/${id}`);
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to fetch flashcards");
      }
      return data.data;
    },
    enabled: !!id,
  });
};

export default useFetchFlashcards;