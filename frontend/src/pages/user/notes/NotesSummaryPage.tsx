import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import useFetchNotes from "@/hooks/user/notes/useFetchNotes";
import { Loader2 } from "lucide-react";
import { useAuthUser } from "@/hooks/auth/useAuthUser";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import useSaveNotes from "@/hooks/user/notes/useSaveNotes";

const NotesSummaryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: authUser } = useAuthUser();
  const { data: notes, isLoading, isError, refetch: refetchNotes } = useFetchNotes(id);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const isUserNotes = notes?.user._id?.toString() === authUser?._id?.toString();
  const isSaved = notes?.saves.includes(authUser?._id);

  const { saveNotes, savingNotes } = useSaveNotes();
  useEffect(() => {
    if (!isLoading && (!notes || isError)) {
      navigate("/404");
    }
  }, [isLoading, notes, isError, navigate]);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10" />
      </div>
    );
  }

  if (!notes) return null;

  // Split notes.content on bullet points or line breaks
  const sections = notes.content
  .split(/##\s+/) // split on headings marked with ##
  .map((section : any) => {
    const [heading, ...bullets] = section.trim().split("\n").filter(Boolean);
    return {
      heading: heading?.trim(),
      bullets: bullets.map((b: any) => b.replace(/^[-*•]\s*/, "").trim()), // clean bullet format
    };
  })
  .filter((s : any) => s.heading); // remove empty sections
  const handleSaveNotes = async () => {
    await saveNotes({id})
    setShowSaveDialog(false);
    refetchNotes();
  }
  return (
    <div className="min-h-screen text-center flex flex-col items-center p-6 mt-12">
      <h1 className="text-3xl font-bold mb-4">{notes.topic}</h1>
      <Card className="max-w-3xl">
        <CardContent className="p-6 space-y-4 text-gray-800 text-left">
          {sections.map((section: any, index : any) => (
          <div key={index}>
          <h2 className="text-xl font-semibold text-blue-700 mb-2">{section.heading}</h2>
          <ul className="list-disc list-inside space-y-1 mb-4">
          {section.bullets.map((point : any, idx : any) => (
          <li key={idx} className="list-none">{point}</li>
          ))}
    </ul>
  </div>
))}
        </CardContent>
      </Card>
      { !isUserNotes &&
      <div className="mt-6">
        <Button variant="outline" onClick={() => setShowSaveDialog(true)}>
          { isSaved ? "Unsave Notes" : "Save Notes" }
        </Button>
      </div>
      }
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isSaved ? "Unsave " : "Save " } Flashcard Deck</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to {isSaved ? "unsave " : "save "} this flashcard deck?</p>
          <DialogFooter className="mt-4 flex justify-end gap-4">
            <Button variant="ghost" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNotes}>{savingNotes ? "Saving..." : "Yes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotesSummaryPage;