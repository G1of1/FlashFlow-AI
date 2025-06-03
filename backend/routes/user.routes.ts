import express from 'express';
import { middleWare } from '../middleware/middleware';
import upload from '../middleware/upload';
import { createFlashCards, 
    createNotes, 
    deleteAccount, 
    deleteFlashcards, 
    deleteNotes, 
    findFlashcardDeck, 
    findNotes, 
    getAllDecks, 
    getAllNotes, 
    getAllSavedDecks, 
    getAllSavedNotes, 
    getAllUserDecks, 
    getAllUserNotes,
    getUserPublicDecks, 
    getUserPublicNotes, 
    saveDeck, 
    saveNotes, 
    uploadStudyFile } from '../controllers/user.controller';

const router = express.Router();

router.use(express.json());

router.post('/upload', middleWare, upload.single('file'), uploadStudyFile)
router.post('/upload/flashcards', middleWare, createFlashCards);
router.post('/upload/notes', middleWare, createNotes);
router.get('/notes', middleWare, getAllUserNotes);
router.get('/flashcards', middleWare, getAllUserDecks);
router.get('/flashcards/all', middleWare, getAllDecks);
router.get('/notes/all', middleWare, getAllNotes);
router.post('/notes/save', middleWare, saveNotes);
router.post('/flashcards/save', middleWare, saveDeck);
router.get('/flashcards/saved', middleWare, getAllSavedDecks);
router.get('/notes/saved', middleWare, getAllSavedNotes);
router.delete('/delete-account', middleWare, deleteAccount);


router.delete('/notes/:id', middleWare, deleteNotes);
router.delete('/flashcards/:id', middleWare, deleteFlashcards);
router.get('/notes/:id', middleWare, findNotes);
router.get('/flashcards/:id', middleWare, findFlashcardDeck);
router.get('/notes/user/:id', middleWare, getUserPublicNotes);
router.get('/flashcards/user/:id', middleWare, getUserPublicDecks);


export default router;