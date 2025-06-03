import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import useFetchFlashcards from "@/hooks/user/flashcards/useFetchFlashcards";
import { useAuthUser } from "@/hooks/auth/useAuthUser";
import LoadingSpinner from "@/components/skeleton/LoadingSpinner";
import useSaveDeck from "@/hooks/user/flashcards/useSaveDeck";
const FlashcardDeck = () => {
  const { id } = useParams<any>();
  const {data: authUser, isLoading: authenticating} = useAuthUser();
  
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const { data: deck, isLoading: deckLoading, isError, refetch: refetchDeck } = useFetchFlashcards(id); 
  const isUsersDeck = deck?.user._id?.toString() === authUser?._id?.toString();
  const isSaved = deck?.saves.includes(authUser?._id);

  const { saveDeck, savingDeck } = useSaveDeck();
  useEffect(() => {
    if (isError) {
      navigate("/404", { replace: true });
    }
  }, [isError, navigate]);

  const nextCard = () => {
    setCurrentIndex((prev) =>
      prev < (deck?.flashcards.length ?? 0) - 1 ? prev + 1 : 0
    );
    setShowAnswer(false);
  };

  const prevCard = () => {
    setCurrentIndex((prev) =>
      prev > 0 ? prev - 1 : (deck?.flashcards.length ?? 1) - 1
    );
    setShowAnswer(false);
  };

  const handleSaveDeck = async () => {
    await saveDeck({id});
    setShowSaveDialog(false);
    refetchDeck();
  };
  if(authenticating) return <div className="flex justify-center items-center"><LoadingSpinner /></div>
  if (deckLoading) return <div className="flex justify-center items-center"><LoadingSpinner /></div>;
  if (!deck || !deck.flashcards.length) return null;

  const currentCard = deck.flashcards[currentIndex];

  return (
    <div className="p-6 max-w-xl mx-auto text-center min-h-screen mt-12">
      <h1 className="text-3xl font-bold mb-8">{deck.topic}</h1>

      <Card
        onClick={() => setShowAnswer(!showAnswer)}
        className="cursor-pointer hover:shadow-lg transition-shadow h-48 flex items-center justify-center"
      >
        <CardContent className="p-6 text-lg font-medium">
          {showAnswer ? `A: ${currentCard.answer}` : `Q: ${currentCard.question}`}
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button onClick={prevCard}>← Previous</Button>
        <p className="text-sm mt-2">
          Card {currentIndex + 1} of {deck.flashcards.length}
        </p>
        <Button onClick={nextCard}>Next →</Button>
      </div>
      { !isUsersDeck &&
      <div className="mt-6">
        <Button variant="outline" onClick={() => setShowSaveDialog(true)}>
          { isSaved ? "Unsave Deck" : "Save Deck" }
        </Button>
      </div>
      }

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{ isSaved ? "Unsave Flashcard Deck " : "Save Flashcard Deck"}</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to { isSaved ? "unsave" : "save"} this flashcard deck?</p>
          <DialogFooter className="mt-4 flex justify-end gap-4">
            <Button variant="ghost" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveDeck}>{savingDeck ? "Saving..." : "Yes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FlashcardDeck;