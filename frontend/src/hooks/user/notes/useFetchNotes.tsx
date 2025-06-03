import { useQuery } from "@tanstack/react-query";

const useFetchNotes = (id: string | undefined) => {
  return useQuery({
    queryKey: ["notes", id],
    queryFn: async () => {
      const res = await fetch(`/api/user/notes/${id}`);
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to fetch notes");
      }
      return data.data;
    },
    enabled: !!id,
  });
};

export default useFetchNotes;