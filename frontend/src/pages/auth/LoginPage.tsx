import useLogin from "@/hooks/auth/useLogin";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [userLogin, setUserLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading } = useLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({ username: userLogin, password, email: userLogin });
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden">
        {/* Left Section */}
        <div className="w-full lg:w-2/3 flex flex-col items-center justify-center bg-orange-500 p-4 sm:p-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-center">Login To Your Account</h2>
          <form
            onSubmit={handleLogin}
            className="bg-white p-6 sm:p-6 md:p-8 rounded shadow-md w-full max-w-sm sm:max-w-md"
          >
            <h3 className="text-xl md:text-2xl font-bold mb-6 text-center">Login</h3>
            <input
              type="text"
              placeholder="Username or email"
              value={userLogin}
              onChange={(e) => setUserLogin(e.target.value)}
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
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <Loader2 className="animate-spin w-5 h-5 mr-2" />
                </div>
              ) : (
                "Login"
              )}
            </button>
            <p className="text-sm sm:text-base md:text-md mb-4 sm:mb-6 text-center text-p2 max-w-sm sm:max-w-md mt-2">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Register
              </Link>
            </p>
          </form>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/3 flex flex-col items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 p-4 sm:p-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center">New Here?</h2>
          <p className="text-base md:text-lg mb-6 text-center text-yellow-500 max-w-md">
            Sign up and improve your studying significantly!
          </p>
          <Link
            to="/register"
            className="bg-orange-500 text-white font-semibold py-3 px-6 rounded-full hover:bg-black transition shadow-md"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;