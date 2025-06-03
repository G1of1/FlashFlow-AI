import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
const useSaveNotes = () => {
    const { toast } = useToast();
    const {mutateAsync: saveNotes, isPending: savingNotes } = useMutation<any, Error, {id : any}>({
        mutationFn: async({id}) => {
            try {
                
            
            const res = await fetch(`/api/user/notes/save`, {
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
    return { saveNotes , savingNotes }
}

export default useSaveNotes;