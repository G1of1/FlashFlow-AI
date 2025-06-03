import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
const useDeleteNotes = () => {
    const query = useQueryClient();
    const { toast } = useToast();
    const {mutateAsync: deleteNotes, isPending: isLoading } = useMutation<any, Error, {id : string}>({
        mutationFn: async({id}) => {
            const res = await fetch(`/api/user/notes/${id}`, {
                method: "DELETE",
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
        },
        onSuccess: () => {
            query.invalidateQueries({queryKey:['notes-all']})
            toast({
                title: "Success",
                description: "Notes deleted successfully",
                duration: 2000
            })
        }
    })
    return { deleteNotes, isLoading }
}

export default useDeleteNotes;