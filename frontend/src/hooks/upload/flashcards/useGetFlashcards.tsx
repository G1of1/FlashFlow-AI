import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
const useGetFlashcard = () => {
    const { toast } = useToast();
    const {mutateAsync: createFlashcardDeck, isPending: isLoading } = useMutation<any, Error, {text: string, topic: string, isPublic: boolean}>({
        mutationFn: async({text, topic, isPublic}) => {
            const res = await fetch("/api/user/upload/flashcards", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({text, topic, isPublic})
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
            return data.data;
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Flashcard Deck created successfully!",
                duration: 2000
            })
        }
    })
    return { createFlashcardDeck, isLoading }
}

export default useGetFlashcard