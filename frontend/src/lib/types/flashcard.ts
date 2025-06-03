export type Flashcard = {
  _id: string;
  question: string;
  answer: string;
  createdAt: string;
};

export type FlashcardDeck = {
  _id: string;
  topic: string;
  ownerId: string;
  createdAt: string;
  flashcards: Flashcard[];
};