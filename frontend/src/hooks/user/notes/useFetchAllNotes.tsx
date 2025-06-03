import { useQuery } from "@tanstack/react-query";

const useFetchAllNotes = () => {
  return useQuery({
    queryKey: ["notes-all"],
    queryFn: async () => {
      const res = await fetch(`/api/user/notes/all`);
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to fetch notes");
      }
      return data.data;
    }
  });
};

export default useFetchAllNotes;