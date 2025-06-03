import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

const useFetchUserNotes = () => {
    const { toast } = useToast();
  return useQuery({
    queryKey: ["notes-user"],
    queryFn: async () => {
    try{
      const res = await fetch(`/api/user/notes/`);
      const data = await res.json();
      if (!res.ok || data.error) {
        toast({
            title: "Error",
            description:`${data.error}`,
            variant: "destructive",
            duration: 2500
        })
        throw new Error(data.error || "Failed to fetch notes");
      }
      return data.data;
    }
    catch(error : any) {
        toast({
            title: "Error",
            description: `${error.message}`,
            variant: "destructive",
            duration: 2500
        })
    }
}
  });
};

export default useFetchUserNotes;