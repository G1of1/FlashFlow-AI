import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Settings, LogOut, SunMoon, Loader2 } from "lucide-react";
import clsx from "clsx";
import { useAuthUser } from "@/hooks/auth/useAuthUser";
import useLogout from "@/hooks/user/logout/useLogout";
import LoadingSpinner from "../skeleton/LoadingSpinner";

const UserNav = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: authUser, isLoading } = useAuthUser();
  const { logout, isLoading: loggingOut } = useLogout();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <nav className="w-full bg-p2 text-foreground py-3 shadow-md fixed z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6">
        {/* Left - Logo */}
        <div className="text-xl font-bold tracking-wide">
          <Link to="/">⚡ FlashFlow AI</Link>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button
            className="hidden p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            <SunMoon className="w-5 h-5" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center focus:outline-none"
            >
              <img
                src={authUser?.profilePic || "/avatars/avatardefault.png"}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover border border-border hover:ring-2 hover:ring-muted transition"
              />
            </button>

            {/* Dropdown Panel */}
            <div
              className={clsx(
                "absolute right-0 mt-2 w-64 bg-popover text-popover-foreground rounded-xl shadow-xl border border-border z-50 transform transition-all duration-200 overflow-hidden",
                dropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
              )}
            >
              <div className="px-4 py-3 border-b border-border">
                <p className="font-medium text-base truncate">{authUser?.username}</p>
                <p className="text-sm text-muted-foreground truncate">{authUser?.email}</p>
              </div>
              <ul className="py-2">
                <li>
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors text-sm"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                </li>
                <li>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    {loggingOut ? <Loader2 className="animate-spin w-4 h-4" /> : "Log out"}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserNav;
