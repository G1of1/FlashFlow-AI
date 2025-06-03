import { BookOpen, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const ExampleContentPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 mt-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Explore Example Content</h1>

        {/* Flashcard Deck Example */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-purple-600">
            <BookOpen className="w-6 h-6" /> Example Flashcard Deck
          </h2>
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row items-center gap-6">
            <img
              src="\examples\flashcard-example.png"
              alt="Example Flashcard Deck"
              className="w-full md:w-1/2 rounded-md border"
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Biology: Photosynthesis</h3>
              <p className="text-gray-700 mb-4">
                This sample deck includes flashcards that explain the light-dependent and light-independent reactions in the photosynthesis process.
              </p>
              <Link
                to="/flashcard-example"
                className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
              >
                View Flashcard Deck
              </Link>
            </div>
          </div>
        </section>

        {/* Notes Examples */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-blue-600">
            <FileText className="w-6 h-6" /> Example Notes
          </h2>
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row items-center gap-6">
              <img
                src="\examples\note-example-2.png"
                alt="Example Note 2"
                className="w-full md:w-1/2 rounded-md border"
              />
              <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Chemistry: Atomic Structure</h3>
              <p className="text-gray-700 mb-4">
                Overview of protons, neutrons, electrons, orbitals, and atomic theory developments.
              </p>
              <Link
                to="/notes-example"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                View Note
              </Link>
              </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ExampleContentPage;