import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Loader2 } from "lucide-react";
import { LogOut, Settings } from "lucide-react";
import { useAuthUser } from "@/hooks/auth/useAuthUser";
import useUpdateProfile from "@/hooks/profile/useUpdateProfile";
import useLogout from "@/hooks/user/logout/useLogout";
import { formatDate } from "@/lib";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/skeleton/LoadingSpinner";
import useDeleteAccount from "@/hooks/profile/useDeleteAccount";
const SettingsPage = () => {
    const {data: authUser, isLoading: isAuthLoading, refetch: refetchUser } = useAuthUser();
    const [username, setUsername] = useState(authUser?.username);
    const [email, setEmail] = useState(authUser?.email);
    const [fullName, setFullName] = useState(authUser?.fullName);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword ] = useState("");
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [editing, setEditing] = useState(false);
    const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
    const [profilePic, setProfilePic] = useState<string | null >("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { updateProfile, isLoading: isUpdating } = useUpdateProfile();
    const { logout, isLoading: isLoggingOut } = useLogout();
    const { deleteAccount, deletingAccount } = useDeleteAccount();

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
      await updateProfile({username, currentPassword, newPassword, email, fullName, profilePic})
    
   await refetchUser();
  };
  useEffect(()=> {
    if(profilePicFile) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result as string)
      reader.readAsDataURL(profilePicFile);
    }
    else {
      setProfilePic(null);
    }
  }, [profilePicFile])

  if(isAuthLoading) {
    <div className="flex min-h-screen justify-center items-center">
    <LoadingSpinner />
    </div>
  }
  const handleLogout = () => {
    logout();
  }
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      {/* Profile Settings */}
      <div className=" px-4 py-10 space-y-4 p-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">My Profile</h2>
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-1 text-blue-600 hover:underline"
          >
            <Settings size={18} /> {editing ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="flex items-center gap-6">
          <img
            src={authUser?.profilePic || "avatars/avatardefault.png"}
            alt="avatar"
            className="w-20 h-20 rounded-full border"
          />
          <div>
            <p className="text-xl font-semibold">{authUser?.fullName}</p>
            <p className="text-gray-600">{authUser?.email}</p>
            <p className="text-gray-500 text-sm">Joined {formatDate(authUser?.createdAt)}</p>
          </div>
        </div>

        {editing && (
          <form className="mt-6 space-y-4" onSubmit={handleSave}>
            <h3 className="text-orange-600 font-semibold"> Full Name</h3>
            <input
              type="text"
              value={fullName}
              onChange={(e)=> setFullName(e.target.value)}
              defaultValue={authUser?.fullName}
              className="w-full border rounded-md px-4 py-2"
            />
            <h3 className="text-orange-600 font-semibold"> Email</h3>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              defaultValue={authUser?.email}
              className="w-full border rounded-md px-4 py-2"
            />
            <h3 className="text-orange-600 font-semibold"> Username</h3>
            <input
              type="text"
              value={username}
              onChange={(e)=> setUsername(e.target.value)}
              defaultValue={authUser?.username}
              className="w-full border rounded-md px-4 py-2"
            />
            <h3 className="text-orange-600 font-semibold"> Password</h3>
            <h4>Current Password</h4>
            <input
              type="password"
              value={currentPassword}
              onChange={(e)=> setCurrentPassword(e.target.value)}
              className="w-full border rounded-md px-4 py-2"
            />
            <h4>New Password</h4>
            <input
              type="password"
              value={newPassword}
              onChange={(e)=> setNewPassword(e.target.value)}
              className="w-full border rounded-md px-4 py-2"
            />
            <div className="my-2">
          <Label htmlFor="profilePic" className="text-orange-600 font-semibold">Change Profile Picture</Label>
          <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePicFile(e.target.files?.[0] || null)}
          className="block mt-1 text-sm"
          />
          </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md flex items-center justify-center transition w-full" type="submit">
              {isUpdating ? <><Loader2 className="animate-spin w-4 h-4 mr-2" /> Saving </>  : "Save Changes"}
            </button>
          </form>
        )}

        <button className="flex items-center mt-8 gap-2 text-red-600 hover:underline" onClick={handleLogout}>
          <LogOut size={18} /> {isLoggingOut ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "Logout"}
        </button>
      </div>
    </div>

      {/* App Preferences - disabled for now, will complete in the future*/}
      <div className="space-y-4 p-4 rounded-lg bg-gray-600 dark:bg-p3 shadow-sm border border-gray-200 dark:border-white/10">
        <h2 className="text-xl font-semibold">App Preferences - <strong>Disabled for now</strong></h2>
        <div className="flex items-center justify-between">
          <Label htmlFor="darkMode">Dark Mode</Label>
          <Switch
            id="darkMode"
            checked={darkMode}
            onCheckedChange={setDarkMode}
            disabled={true}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications">Email Notifications</Label>
          <Switch
            id="notifications"
            checked={notifications}
            onCheckedChange={setNotifications}
            disabled={true}
          />
        </div>
      </div>
      <div className="space-y-4 p-4 rounded-lg bg-gray-200 dark:bg-p3 shadow-sm border border-gray-200 dark:border-white/10">
        <h2 className="text-xl font-bold">Delete Account</h2>
        <div className="flex items-center justify-between">
          <Button onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDeleteModalOpen(true);
                        }}>Delete Account</Button>
        </div>
      </div>
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
  <DialogContent className="max-w-md">
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <DialogHeader className="flex items-center gap-3">
        <AlertTriangle className="w-6 h-6 text-red-500" />
        <DialogTitle className="text-lg text-red-600 dark:text-red-400">Are you absolutely sure?</DialogTitle>
      </DialogHeader>

      <div className="text-gray-700 dark:text-gray-300 mt-2">
        This action will permanently your account and cannot be undone.
      </div>

      <DialogFooter className="flex justify-end gap-3 pt-4">
        <Button
          variant="outline"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={async () => {
            deleteAccount();
          }}
        >
          {deletingAccount ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "Yes, delete my account"}
        </Button>
      </DialogFooter>
    </motion.div>
  </DialogContent>
</Dialog>

      <div className="flex justify-end">
        <Button >Save Changes</Button>
      </div>
    </div>
  );
};

export default SettingsPage;