import { useQuery } from "@tanstack/react-query";

const useFetchProfileDecks = (id: string) => {
  return useQuery({
    queryKey: ["profile-decks", id],
    queryFn: async () => {
      const res = await fetch(`/api/user/flashcards/user/${id}`);
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to fetch flashcards");
      }
      return data.data;
    },
    enabled: !!id,
  });
};

export default useFetchProfileDecks;