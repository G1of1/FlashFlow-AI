import { useState, type FormEvent } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import extractNotes from "@/hooks/upload/extractNotes";
import useGetNotes from "@/hooks/upload/notes/useGetNotes";
import { useToast } from "@/hooks/use-toast";

const UploadNotes = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [topic, setTopic] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const { toast } = useToast();
  const { createNotes, isLoading } = useGetNotes();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] || null);
  };

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!selectedFile) throw new Error("File not included");
      if (!topic.trim()) throw new Error("Please provide topic");

      const extractedNotes = await extractNotes(selectedFile);
      if (extractedNotes instanceof Error) 
        {
          toast({
          title: "Error",
          description:`${extractedNotes}`,
          variant: "destructive",
          duration: 2000
        })
        return;
        }
      const notes = await createNotes({ text: extractedNotes, topic, isPublic });

      if (!notes || !notes._id) throw new Error("Invalid response from server");

      navigate(`/library/notes/${notes._id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
        duration: 3000,
      })
     console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-orange-500">
          AI Summarized Notes Generator
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white text-black w-full max-w-xl rounded-2xl shadow-2xl p-8"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Upload Your Notes</h2>
        <p className="text-center text-gray-500 mb-6">
          Upload PDF, DOCX, or Image files to turn them into powerful AI-enhanced notes.
        </p>

        <form onSubmit={handleUpload} className="flex flex-col gap-4">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="file-input border border-gray-600 p-3 rounded-md bg-white text-black"
          />

          {selectedFile && (
            <p className="text-sm text-gray-300">Selected file: {selectedFile.name}</p>
          )}

          <div className="flex flex-col">
            <label htmlFor="topic" className="font-semibold mb-2 text-orange-400 text-center">
              Topic
            </label>
            <input
              id="topic"
              type="text"
              placeholder="Topic e.g. Biology, Calculus"
              onChange={(e) => setTopic(e.target.value)}
              className="p-3 border border-gray-600 rounded-md bg-white text-black"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="public"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 text-orange-500 bg-black border-gray-500 rounded focus:ring-orange-400"
            />
            <label htmlFor="public" className="text-sm text-black">
              Make notes public?
            </label>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isLoading}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-md flex items-center justify-center transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4 mr-2" />
                Upload & Generate Notes
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default UploadNotes;
