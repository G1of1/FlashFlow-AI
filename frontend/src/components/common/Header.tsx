
import { useState } from 'react';
import { Menu, X } from "lucide-react"; // icon package (lucide-react or use your own SVGs)
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-p4 text-orange-500 shadow-md fixed w-full top-0 left-0">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold cursor-pointer hover:text-black transition-colors duration-200">
          <Link to="/">⚡FlashFlow AI</Link>
        </h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 font-semibold">
          <Link
            to="/register"
            className=" text-black font-semibold py-2 px-4 hover:text-orange-500 transition justify-center"
          >
            Register
          </Link>
          <Link to="/login" className=" text-black font-semibold py-2 px-4 hover:text-orange-500 transition justify-center">
            Login
          </Link>
        </nav>
        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-orange-500"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
      {isOpen && (
        <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%", opacity: 0}}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
        <div className="md:hidden px-4 pb-4 space-y-2 font-semibold">
          <Link
            to="/register"
            className="block hover:text-black transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            Register
          </Link>
          <Link to="/login" className='block hover:text-black transition-colors duration-200' onClick={() => setIsOpen(false)}>
            Login
          </Link>
        </div>
        </motion.div>
      )}
      </AnimatePresence>
    </header>
  );
};

export default Header