import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../use-toast";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
    type LoginInput = {
        username: string;
        password: string;
        email: string;
    }
    const query = useQueryClient();
    const { toast } = useToast();
    const navigate = useNavigate();
    const { mutateAsync: login, isPending: isLoading } = useMutation<object, Error, LoginInput>({
        mutationFn: async ({username, password, email})  => {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({username, password, email})
            })
            const data = await res.json();

            if(!res.ok || data.error) {
                toast({
                    title: "Error",
                    description:`${data.error}`,
                    variant: "destructive",
                    duration: 2000
                })
                if(res.status === 403) {
                    navigate("/setup-2fa")
                }
                throw new Error(data.error || "Unknown server error")
            }
            return data.data;
        },
        onSuccess: async()=> {
            await query.invalidateQueries({queryKey: ['authUser']})
        }
    })
    return { login, isLoading }
}

export default useLogin;