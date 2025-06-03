import { useQuery } from "@tanstack/react-query";

const useGetProfile = (username: string | undefined) => {
  return useQuery({
    queryKey: ["user", username],
    queryFn: async () => {
      const res = await fetch(`/api/profile/${username}`);
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to profile");
      }
      return data.data;
    },
    enabled: !!username,
  });
};

export default useGetProfile;