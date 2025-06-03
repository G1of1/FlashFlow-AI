import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
const useGetNotes = () => {
    const { toast } = useToast();
    const {mutateAsync: createNotes, isPending: isLoading} = useMutation<any, Error, {text: string, topic: string, isPublic: boolean}>({
        mutationFn: async({text, topic, isPublic}) => {
            const res = await fetch("/api/user/upload/notes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
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
                description: "Notes created successfully!",
                duration: 2000
            })
        }
    })
    return { createNotes, isLoading }
}

export default useGetNotes;