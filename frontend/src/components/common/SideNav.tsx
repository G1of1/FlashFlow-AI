import {
  Home,
  Folder,
  CheckSquare,
  Menu,
  Search,
  X
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, type JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SideNav = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden flex justify-between items-center bg-black text-white p-4">
        <button onClick={() => setIsOpen(true)}>
          <Menu className="w-6 h-6 text-orange-500" />
        </button>
      </div>

      {/* Sidebar Drawer for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex lg:hidden"
          >
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <div className="relative bg-black text-white w-64 h-full p-4 z-50 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-orange-500">Menu</h2>
                <button onClick={() => setIsOpen(false)}>
                  <X className="w-6 h-6 text-orange-500" />
                </button>
              </div>
              <SidebarLinks isActive={isActive} close={() => setIsOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col bg-black text-white w-64 min-h-screen p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-orange-500">Dashboard</h2>
          <Search className="text-orange-500" />
        </div>
        <SidebarLinks isActive={isActive} />
      </div>
    </>
  );
};

export default SideNav;

type SidebarLinkProps = {
  icon: JSX.Element;
  text: string;
  to: string;
  active?: boolean;
  badge?: string;
  close?: () => void;
};

const SidebarLink = ({ icon, text, to, active, badge, close }: SidebarLinkProps) => {
  return (
    <Link
      to={to}
      onClick={close}
      className={`flex items-center gap-3 px-4 py-2 rounded-md hover:bg-orange-500 hover:text-white transition ${
        active ? "bg-orange-500 text-white" : ""
      }`}
    >
      <div className="relative text-orange-400">
        {icon}
        {badge && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {badge}
          </span>
        )}
      </div>
      <span className="truncate">{text}</span>
    </Link>
  );
};

const Divider = () => <hr className="my-4 border-gray-700" />;

const SidebarLinks = ({ isActive, close }: { isActive: (path: string) => boolean; close?: () => void }) => (
  <>
    <SidebarLink icon={<Home />} text="Home" to="/" active={isActive("/")} close={close} />
    <Divider />
    <div className="text-sm text-orange-300 uppercase px-2 mb-2">Navigate</div>
    <SidebarLink icon={<Search />} text="Search" to="/search" active={isActive("/search")} close={close} />
    <SidebarLink icon={<Folder />} text="Your library" to="/library" active={isActive("/library")} close={close} />
    <SidebarLink icon={<Folder />} text="Saved" to="/saved" active={isActive("/saved")} close={close} />
    <SidebarLink icon={<CheckSquare />} text="Practice Test" to="/practice" active={isActive("/practice")} close={close} />
  </>
);
