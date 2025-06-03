import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
const useDeleteFlashcard = () => {
    const { toast } = useToast();
    const query = useQueryClient();
    const {mutateAsync: deleteDeck, isPending: isLoading } = useMutation<any, Error, {id : any}>({
        mutationFn: async({id}) => {
            const res = await fetch(`/api/user/flashcards/${id}`, {
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
        onSuccess: ()=> {
            query.invalidateQueries({queryKey: ['flashcards-deck']})
            toast({
                title: "Success",
                description: "Flashcard deck deleted successfully",
                duration: 2000
            })
        }
    })
    return { deleteDeck, isLoading }
}

export default useDeleteFlashcard;