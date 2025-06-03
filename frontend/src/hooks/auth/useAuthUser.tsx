import { useQuery } from "@tanstack/react-query";

export const useAuthUser = () => {
  return useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const res = await fetch("/api/auth/user");
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Failed to fetch user");
      return data.data;
    },
  });
}