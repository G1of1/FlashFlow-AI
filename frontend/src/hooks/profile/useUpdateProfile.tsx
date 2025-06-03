import { useMutation } from '@tanstack/react-query';
import { useToast } from '../use-toast';
const useUpdateProfile = () => {
    const { toast } = useToast();
    const {mutateAsync: updateProfile, isPending: isLoading } = 
    useMutation<any, Error, {username: string | undefined, currentPassword: string | undefined, newPassword: string  | undefined, fullName: string | undefined, email: string | undefined, profilePic: string | null}>({
        mutationFn: async({username, currentPassword, newPassword, email, fullName, profilePic}) => {
            try{
            const res = await fetch("/api/profile/update", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({username, currentPassword, newPassword, fullName, email, profilePic})
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
            catch(error: any) {
                toast({
                    title: "Error",
                    description:`${error.message}`,
                    variant: "destructive",
                    duration: 3000
                })
            }
        },
        onSuccess: (data)=> {
            toast({
                title: "Success",
                description:`${data.message}`,
                variant: "default",
                duration: 2000
            })
        }
    })
    return { updateProfile, isLoading }
}

export default useUpdateProfile;