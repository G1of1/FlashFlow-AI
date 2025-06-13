import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../use-toast';
const useDeleteAccount = () => {
    const { toast } = useToast();
    const query = useQueryClient();
    const {mutateAsync: deleteAccount, isPending: deletingAccount } = 
    useMutation<any, Error>({
        mutationFn: async() => {
            try{
            const res = await fetch("/api/user/delete-account", {
                method: "DELETE",
            });
            const data = await res.json();
            if(data.error || !res.ok) {
                toast({
                    title: "Error",
                    description: `${data.error}`,
                    variant: "destructive",
                    duration: 2000
                })
                throw new Error(data.error || "Unknown Server Error...")
            }
            return data;
            }
            catch(error: any) {
                toast({
                    title: "Error",
                    description:`${error.message}`,
                    variant: "destructive",
                    duration: 3000
                })
            }
        },
        onSuccess: async (data)=> {
            await query.setQueryData(['authUser'], null);
            await query.invalidateQueries({queryKey: ['authUser']})
            toast({
                title: "Success",
                description:`${data.message}`,
                variant: "default",
                duration: 3000
            })
        }
    })
    return { deleteAccount, deletingAccount }
}

export default useDeleteAccount;