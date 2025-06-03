import { useState, type FormEvent } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import useGetFlashcard from "@/hooks/upload/flashcards/useGetFlashcards";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import extractNotes from "@/hooks/upload/extractNotes";

const UploadFlashcards = () => {
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [topic, setTopic] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { createFlashcardDeck, isLoading } = useGetFlashcard();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] || null);
  };

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!selectedFile) throw new Error("File not included");
      if (!topic.trim()) throw new Error("Please provide topic");

      const extractedNotes = await extractNotes(selectedFile);
      if (extractedNotes instanceof Error) {
        toast({
          title: "Error",
          description:`${extractedNotes}`,
          variant: "destructive",
          duration: 2000
        })
        return;
      }
      const flashcards = await createFlashcardDeck({ text: extractedNotes, topic, isPublic });
      if (!flashcards || !flashcards._id) throw new Error("Invalid response from server");

      navigate(`/library/flashcards/${flashcards._id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `${error.message}`,
        variant: "destructive",
        duration: 2500
      })
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl bg-white border border-gray-200 shadow-xl rounded-2xl p-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-black text-center mb-6">
          AI Flashcard Generator
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Upload PDF, DOCX, or Image files to turn them into powerful AI-enhanced notes.
        </p>
        <form onSubmit={handleUpload} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Upload File</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="border border-gray-300 w-full px-4 py-3 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {selectedFile && (
              <p className="text-sm text-gray-600 mt-1">Selected: {selectedFile.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Topic</label>
            <input
              type="text"
              placeholder="e.g. Biology, Calculus, WWII..."
              onChange={(e) => setTopic(e.target.value)}
              className="border border-gray-300 w-full px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="public"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
            />
            <label htmlFor="public" className="text-sm text-gray-700">
              Make flashcards public?
            </label>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-md flex items-center justify-center transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <UploadCloud className="w-5 h-5 mr-2" />
                Upload & Generate Flashcards
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default UploadFlashcards;
