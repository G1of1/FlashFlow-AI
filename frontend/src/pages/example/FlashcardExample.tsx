import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
const FlashcardExample = () => {
  
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  
  const topic = "Biology: Photosynthesis"
  const deck = [
    
     
    {
        question: "What is photosynthesis",
        answer: "The process where light energy is converted into chemical energy, producing glucose and oxygen."
    },
    {
        question: "Write the equation for photosynthesis.",
        answer: "6CO2 + 6H2O + Light Energy → C6H12O6 + 6O2"
    },
    {
        question: "Q: Where do light-dependent reactions take place?",
        answer: "Thylakoid membranes of the chloroplasts."
    },
    {
        question: "Where does the Calvin cycle take place?",
        answer: "Stroma of the chloroplasts."
    },
    {
        question: "What are the two main products of photosynthesis?",
        answer: "Glucose (C6H12O6) and Oxygen (O2)."
    }
    
  ]
  
  const nextCard = () => {
    setCurrentIndex((prev) =>
      prev < (deck?.length ?? 0) - 1 ? prev + 1 : 0
    );
    setShowAnswer(false);
  };

  const prevCard = () => {
    setCurrentIndex((prev) =>
      prev > 0 ? prev - 1 : (deck?.length ?? 1) - 1
    );
    setShowAnswer(false);
  };


  const currentCard = deck[currentIndex];

  return (
    <div className="p-6 max-w-xl mx-auto text-center min-h-screen mt-12">
      <h1 className="text-3xl font-bold mb-8">{topic}</h1>

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
          Card {currentIndex + 1} of {deck.length}
        </p>
        <Button onClick={nextCard}>Next →</Button>
      </div>
    </div>
  );
};

export default FlashcardExample;