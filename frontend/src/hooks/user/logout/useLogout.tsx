import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
const useLogout = () => {
    const query = useQueryClient();
    const { toast } = useToast();
    const navigate = useNavigate();
    const {mutate: logout, isPending: isLoading } = 
    useMutation<any, Error>({
        mutationFn: async() => {
            try {
            const res = await fetch("/api/auth/logout", {
                method: "POST"
            });
            const data = await res.json();
            if(data.error || !res.ok) {
                toast({
                    title: "Error",
                    description: `${data.error}`,
                    variant: "destructive",
                    duration: 2500
                })
                throw new Error(data.error || "Unknown Server Error...")
            }
            return data.message;
        }
        catch(error: any) {
            throw new Error(error.message)
        }
        },
        onSuccess: async (data)  => {
            await query.setQueryData(['authUser'], null);
            await query.invalidateQueries({queryKey: ['authUser']});
            toast({
                title: "Success",
                description: `${data}`,
                duration: 2000
            })
            navigate("/login")
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Logout failed",
                variant: "destructive",
                duration: 2500
            })
        }
    })
    return { logout, isLoading }
}

export default useLogout;

