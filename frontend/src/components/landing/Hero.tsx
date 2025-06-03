import { Link } from "react-router-dom";

const Hero = () => (
  <section className="min-h-[60vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-red-500 to-orange-500">
    <div className="mx-auto w-full text-center">
      <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Having trouble studying?</h2>
      <p className="text-base md:text-lg mb-8 text-p4">
        Upload PDFs, DOCXs, or images of notes. Get detailed study notes and Quizlet-style flashcards instantly.
      </p>
      <Link to="/register" className="bg-orange-400 text-white font-semibold py-3 px-6 rounded-full hover:text-black transition justify-center">
        Get Started
      </Link>
    </div>
  </section>
);

export default Hero;