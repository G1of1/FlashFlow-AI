import { useQuery } from "@tanstack/react-query";

const useFetchAllSavedNotes = () => {
  return useQuery({
    queryKey: ["notes-saved"],
    queryFn: async () => {
      const res = await fetch(`/api/user/notes/saved`);
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to fetch flashcards");
      }
      return data.data;
    },
  });
};

export default useFetchAllSavedNotes;