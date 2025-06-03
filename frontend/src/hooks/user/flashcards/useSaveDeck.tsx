import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
const useSaveDeck = () => {
    const { toast } = useToast();
    const {mutateAsync: saveDeck, isPending: savingDeck } = useMutation<any, Error, {id : any}>({
        mutationFn: async({id}) => {
            try {
                
            
            const res = await fetch(`/api/user/flashcards/save`, {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({id})
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
            return data;
        }
            catch (error : any) {
                toast({
                    title: "Error",
                    description: `${error.message}`,
                    variant: "destructive",
                    duration: 2500
                })
            }
        },
        onSuccess: (data)=> {
            toast({
                title: "Success",
                description: `${data.message}`,
                duration: 2000
            })
        }
    })
    return { saveDeck , savingDeck }
}

export default useSaveDeck;