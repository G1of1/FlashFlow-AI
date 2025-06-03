import { useQuery } from "@tanstack/react-query";

const useFetchProfileNotes = (id: string) => {
  return useQuery({
    queryKey: ["profile-notes", id],
    queryFn: async () => {
      const res = await fetch(`/api/user/notes/user/${id}`);
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to fetch notes");
      }
      return data.data;
    },
    enabled: !!id,
  });
};

export default useFetchProfileNotes;