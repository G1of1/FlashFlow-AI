import { useMutation } from "@tanstack/react-query"

type RegisterInput = {
  fullName: string;
  username: string;
  password: string;
  email: string;
};

export const useRegister = (options = {}) => {
  return useMutation({
    mutationFn: async (userData: RegisterInput) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      return data;
    },
    ...options, // <- allows you to pass onSuccess, onError, etc.
  });
};