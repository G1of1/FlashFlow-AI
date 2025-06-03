import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFileAlt } from "react-icons/fa";
import { PiCardsThreeFill } from "react-icons/pi";
import { GiMuscleUp } from "react-icons/gi";
import LoadingSpinner from "@/components/skeleton/LoadingSpinner";
import { useAuthUser } from "@/hooks/auth/useAuthUser";
import { motion } from "framer-motion";
const features = [
  {
    icon: <FaFileAlt className="text-orange-500 text-4xl" />,
    title: "Upload Your Notes",
    description: "Submit PDFs, Word Docs, or images to extract key concepts and summaries.",
    link: "/upload",
  },
  {
    icon: <PiCardsThreeFill className="text-orange-500 text-4xl" />,
    title: "View Flashcards and Notes",
    description: "Auto-generated flashcards and notes for memorization and spaced repetition.",
    link: "/library",
  },
  {
    icon: <GiMuscleUp className="text-orange-500 text-4xl" />,
    title: "Review & Practice",
    description: "Create a practice test and study to prepare for that exam!",
    link: "/practice",
  },
];

const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: authUser, isLoading } = useAuthUser();

  if (isLoading) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
    <div className="min-h-screen bg-white px-4 py-16 mt-12 md:px-10 lg:px-20">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-black">
          Welcome, <span className="text-orange-500">{authUser?.username}</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-700">
          Supercharge your studying with smart tools designed just for you.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {features.map((feature, index) => (
          <Link
            key={index}
            to={feature.link}
            className="bg-white border border-gray-200 p-6 rounded-2xl shadow hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 flex items-center justify-center bg-orange-100 rounded-full mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </Link>
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-20 text-center">
        <h3 className="text-2xl font-bold mb-4 text-black">Ready to dive in?</h3>
        <Link
          to="/upload"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-lg font-medium py-3 px-8 rounded-full shadow transition"
        >
          Upload Notes Now
        </Link>
      </div>
    </div>
    </motion.div>
  );
};

export default HomePage;
