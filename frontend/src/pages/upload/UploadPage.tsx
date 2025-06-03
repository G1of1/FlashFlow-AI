import { Link } from "react-router-dom";
import { useEffect } from "react";
import { FaFileAlt } from "react-icons/fa";
import { PiCardsThreeFill } from "react-icons/pi";
import { motion } from "framer-motion";

const UploadPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    whileHover: { scale: 1.05 },
  };

  return (
    <div className="min-h-screen bg-white px-4 py-16 md:px-10 lg:px-20 flex flex-col mt-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-black">Upload Your Content</h1>
        <p className="mt-4 text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
          Upload your notes and choose between generating detailed summaries or smart flashcards
          to help you prepare for your upcoming exams.
        </p>
      </div>

      <h2 className="text-2xl md:text-3xl font-semibold text-black text-center mb-8">
        What would you like to create?
      </h2>

      {/* Animated Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {/* Notes Card */}
        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="whileHover"
        >
          <Link
            to="/upload/notes"
            className="bg-white border border-gray-200 p-6 rounded-2xl shadow-md hover:shadow-xl transition flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 flex items-center justify-center bg-orange-100 rounded-full mb-4">
              <FaFileAlt className="text-orange-500 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">Create Detailed Notes</h3>
            <p className="text-gray-600 text-sm">
              Upload PDFs, Word Docs, or images to extract key points, concepts, and insights.
            </p>
          </Link>
        </motion.div>

        {/* Flashcards Card */}
        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="whileHover"
        >
          <Link
            to="/upload/flashcards"
            className="bg-white border border-gray-200 p-6 rounded-2xl shadow-md hover:shadow-xl transition flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 flex items-center justify-center bg-orange-100 rounded-full mb-4">
              <PiCardsThreeFill className="text-orange-500 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">Create Flashcards</h3>
            <p className="text-gray-600 text-sm">
              Instantly generate flashcards for active recall, spaced repetition, and study efficiency.
            </p>
          </Link>
        </motion.div>
      </div>

      {/* CTA */}
      <div className="mt-20 text-center">
        <p className="text-md text-gray-700 mb-4">Need help choosing the right option?</p>
        <Link
          to="/upload/examples"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-lg font-medium py-3 px-8 rounded-full shadow transition"
        >
          Explore Examples
        </Link>
      </div>
    </div>
  );
};

export default UploadPage;
