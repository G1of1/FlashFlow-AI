import { useState } from "react";
import { Link } from "react-router-dom";
import {useRegister } from "@/hooks/auth/useRegister"; // Adjust path based on your structure
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCodeModal from "@/components/auth/QRModal";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName , setLastName] = useState("");
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const register = useRegister({
    onSuccess: () => {
      setShow2FAModal(true);
    },
    onError: (error : any) => {
      toast({
        title: "Error",
        description:`${error.message}` || `Registration failed`,
        variant: "destructive",
        duration: 3000
      })
    }
  })

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const full = `${firstName} ${lastName}`;
    setFullName(full);
    register.mutate({fullName, email, password, username})
  };

  return (
    <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className="w-full lg:w-1/3 flex flex-col items-center justify-center bg-gradient-to-r from-red-500 to-orange-500 p-6">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center">
          Have an account?
        </h2>
        <p className="text-base md:text-lg mb-6 text-center text-p2 max-w-md">
          Sign in and continue to study!
        </p>
        <Link
          to="/login"
          className="bg-orange-500 text-white font-semibold py-3 px-6 rounded-full hover:bg-black transition shadow-md"
        >
          Sign In
        </Link>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-2/3 flex flex-col items-center justify-center bg-orange-500 p-6">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center">
          Create Your Account
        </h2>
        <form
          onSubmit={handleRegister}
          className="bg-white p-6 md:p-8 rounded shadow-md w-full max-w-md"
        >
          <h3 className="text-xl md:text-2xl font-bold mb-6 text-center">
            Register
          </h3>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full mb-4 px-4 py-2 rounded-full bg-p5"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full mb-4 px-4 py-2 rounded-full bg-p5"
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mb-4 px-4 py-2 rounded-full bg-p5"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 px-4 py-2 rounded-full bg-p5"
            required
          />
          <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 pr-10 rounded-full bg-p5"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 hover:text-gray-900"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-full hover:bg-orange-600 transition"
          >
            Register
          </button>
          <p className="mt-4 text-sm text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
    <QRCodeModal isOpen={show2FAModal} onClose={() => setShow2FAModal(false)} />
    </motion.div>
  );
};

export default Register;