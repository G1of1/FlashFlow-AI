import { User } from "../models/user.model";
import { Notes } from "../models/notes.model";
import { Flashcard } from "../models/flashcard.model";
import { GoogleGenerativeAI } from "@google/generative-ai";
import e, { Request, Response } from 'express';
import { processUploadedFile } from "../libraries/utilities/fileProcessor";
import dotenv from 'dotenv';
import { FlashcardDeck } from "../models/flashcardDeck.model";
import mongoose, { Types } from "mongoose";
dotenv.config();
//const openai = new OpenAI({
  //apiKey: process.env.OPENAI_API_KEY,
//});
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const uploadStudyFile = async (req: Request, res: Response) : Promise<any> => {
    try {
        const file  = req.file;
        
        if(!file) {
            res.status(400).json({success: false, error: "No file uploaded"})
            return;
        }

        const extractedFile = await processUploadedFile(file);

        res.status(200).json({success: true, data: extractedFile})
        
    }
    catch(error: any) {
        res.status(500).json({success: false, error: `Server Error: ${error.message}`});
    }
}

export const createNotes = async(req: Request, res: Response): Promise<any> => {

    try {
        const { text, topic, isPublic } = req.body;
        if(!text || !topic) {
            return res.status(400).json({success: false, error: "Text or topic not provided"})
        }
        const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `
        You are an expert academic assistant. Summarize the content into highly organized and easy-to-review study notes.

        Requirements:
        - Group key ideas under clear and concise headings or subheadings
        - Use bullet points to highlight important facts, definitions, or examples under each section
        - Maintain logical structure — prioritize clarity and exam relevance
        - Do not repeat information or include unnecessary filler
        - Do not include the original input text, only summarized notes

        Input Content:
        Topic: ${topic}

        Text:
        ${text}

        Output Format Example:
        ## Main Topic or Section
        - Bullet point 1
        - Bullet point 2
        - Bullet point 3

        ## Another Section
        - Bullet 1
        - Bullet 2
        - etc.
        `;
        

        const result =  await model.generateContent(prompt);
        const response = result.response;
        const textOutput = response.text();

        const summarizedNotes = new Notes({
            user: req.user?._id,
            topic,
            content: textOutput,
            isPublic
        })
        await summarizedNotes.save();
        await User.updateOne({_id: req.user?._id}, {$push: {notes: summarizedNotes._id}});

        res.status(200).json({success: true, data: summarizedNotes, message: "Notes created!"});
        }
    catch(error : any) {
        res.status(500).json({success: false, error: `Server Error: ${error.message}`})
    }

}
export const createFlashCards = async (req: Request, res: Response): Promise<any> => {
  try {
    const { text, topic, isPublic } = req.body;
    const userId = req.user?._id; // Ensure this is available (e.g., via middleware)

    if (!text || !topic) {
      return res.status(400).json({ success: false, error: "Text or topic not provided" });
    }

    if (!userId) {
      return res.status(401).json({ success: false, error: "User not authenticated" });
    }

    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
You are an expert study assistant. Create 15 flashcards based on the content below. Focus on important terms, definitions, and key concepts.

Input:
____
Topic:
${topic}

Text:
${text}
____

Output Format (JSON):
{
  "flashcards": [
    {
      "question": "What is sociology?",
      "answer": "The study of society, social institutions, and relationships."
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let textResponse = response.text();

    // Strip code block if needed
    if (textResponse.startsWith("```json")) {
      textResponse = textResponse.replace(/^```json/, "").replace(/```$/, "").trim();
    }

    const parsed = JSON.parse(textResponse);
    const flashcardsData = parsed.flashcards;

    if (!Array.isArray(flashcardsData)) {
      return res.status(500).json({ success: false, error: "Invalid flashcard format returned by model"});
    }
    const flashcardDocs = await Flashcard.insertMany(
      flashcardsData.map((card: any) => ({
        user: new Types.ObjectId(userId),
        question: card.question,
        answer: card.answer,
      }))
    );

    const deck = new FlashcardDeck ({
      user: new Types.ObjectId(userId),
      flashcards: flashcardDocs.map((fc) => fc._id),
      topic,
      isPublic
    });

    await deck.save();
    await User.updateOne({_id: req.user?._id}, {$push: {flashcardDecks: deck._id}});
    
    res.status(200).json({success: true, data: deck, message: "Flashcard Deck created!"});
  } catch (error: any) {
    console.error("Flashcard creation error:", error);
    res.status(500).json({ success: false, error: `Server Error: ${error.message}` });
  }
};

export const deleteNotes = async(req: Request, res: Response): Promise<any> =>{
  try {
    const { id } = req.params;
    const userID = req.user?._id;
    if(!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({success: false, error: "Notes ID is invalid"})
    }
    const notes = await Notes.findById(id);
    
    if(!notes) {
      return res.status(400).json({success: false, error: "Notes not found"})
    }
    
    if(userID?.toString() !== notes.user._id.toString()) {
      return res.status(401).json({success: false, error: "Unauthorized"})
    }
    const notesTopic = notes.topic;
    await Notes.findByIdAndDelete(id);
    await User.updateOne({_id: userID}, {$pull: {notes: id}})
    res.status(200).json({success: true, message: `Notes on ${notesTopic} deleted`})
  } 
  catch (error: any) {
    res.status(500).json({success: false, error: `Server Error ${error.message}`})
  }

}
export const deleteFlashcards = async(req: Request, res: Response) : Promise<any> => {
  try {
    const { id } = req.params;
    const userID = req.user?._id;

    if(!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({success: false, error: "Flashcard Deck ID is invalid"})
    }
    const deck = await FlashcardDeck.findById(id);
    
    if(!deck) {
      return res.status(400).json({success: false, error: "Deck not found"})
    }
    if(userID?.toString() !== deck.user._id.toString()) {
      return res.status(401).json({success: false, error: "Unauthorized"})
    }
    const deckTopic = deck.topic;

    await Promise.all(deck.flashcards.map((cardId: any) => Flashcard.findByIdAndDelete(cardId)));
    await FlashcardDeck.findByIdAndDelete(id);
    await User.updateOne({_id: userID}, {$pull: {flashcardDecks: id}})

    res.status(200).json({success: true, message: `Flashcards on ${deckTopic} deleted`});
    
  } 
  catch (error : any) {
    res.status(500).json({success: false, error: `Server Error: ${error.message}`})
  }

}
export const findFlashcardDeck = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const deck = await FlashcardDeck.findById(id)
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "flashcards",
      });

    if (!deck) {
      return res.status(404).json({ success: false, error: "Flashcard deck not found" });
    }

    res.status(200).json({ success: true, data: deck });
  } catch (error: any) {
    res.status(500).json({ success: false, error: `Server Error: ${error.message}` });
  }
};

export const findNotes = async (req: Request, res: Response) : Promise<any> => {
  try {
    const { id } = req.params;
    const notes = await Notes.findById(id).populate({
      path: "user",
      select: "-password"
    })
    res.status(200).json({success: true, data: notes})

  }
  catch(error: any) {
    res.status(500).json({success: true, error: `Server Error: ${error.message}`})
  }

}

export const createTest = async (req: Request, res: Response) : Promise<any> => {
  try {
    
    const { topic } = req.body;
    const userID = req.user?._id;

    if(!topic) {
      return res.status(400).json({success: false, error: "No topic provided."})
    }
    
    //TODO: Finish create test by creating a test model.

  } 
  catch (error: any) {
    res.status(500).json({success: false, error: `Server Error: ${error.message}`})
  }
}
export const getAllUserDecks = async (req: Request, res: Response): Promise<any> => {
  try {
    const userID = req.user?._id;

    const user = await User.findById(userID)
      .populate({
        path: "flashcardDecks",
        populate: {
          path: "user",
          select: "-password",
        },
      });
    const flashcardDecks = user?.flashcardDecks || [];

    res.status(200).json({ success: true, data: flashcardDecks });
  } catch (error: any) {
    res.status(500).json({ success: false, error: `Server Error: ${error.message}` });
  }
};
export const getAllUserNotes = async (req: Request, res: Response): Promise<any> => {
  try {
    const userID = req.user?._id;

    const user = await User.findById(userID)
      .populate({
        path: "notes",
        populate: {
          path: "user",
          select: "-password",
        },
      });
    const notes = user?.notes || [];
    res.status(200).json({ success: true, data: notes });
  } catch (error: any) {
    res.status(500).json({ success: false, error: `Server Error: ${error.message}` });
  }
};
export const getUserPublicDecks = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const decks = await FlashcardDeck.find().sort({createdAt: -1}).populate({path: "user", select: "-password"})
    if(decks.length === 0) {
      return res.status(200).json({success: true, data: []})
    }
    const publicDecks = decks.filter(deck => deck.isPublic);
    const filteredDecks = publicDecks.filter(deck => deck.user._id.toString() === id.toString())
    res.status(200).json({success: true, data: filteredDecks})
  }
  catch(error : any) {
    res.status(500).json({success: false, error: `${error.message}`})
  }
}
export const getUserPublicNotes = async (req: Request, res: Response) : Promise<any> => {
try {
    const { id } = req.params;
    const notes = await Notes.find().sort({createdAt: -1}).populate({path: "user", select: "-password"})
    if(notes.length === 0) {
      return res.status(200).json({success: true, data: []})
    }
    const publicNotes = notes.filter(note => note.isPublic);
    const filteredNotes = publicNotes.filter(note => note.user._id.toString() === id.toString())
    res.status(200).json({success: true, data: filteredNotes})
  }
  catch(error : any) {
    res.status(500).json({success: false, error: `${error.message}`})
  }
}
//For search page, fetch all notes and flashcard decks
export const getAllDecks = async (req: Request, res: Response) : Promise<any> => {
  try {
    const decks = await FlashcardDeck.find().sort({createdAt: -1}).populate({path: "user", select: "-password"})
    if(decks.length === 0) {
      return res.status(200).json({success: true, data: []})
    }
    const publicDecks = decks.filter(deck => deck.isPublic);
    const filteredDecks = publicDecks.filter(deck => deck.user._id !== req.user?._id)
    res.status(200).json({success: true, data: filteredDecks})
  } 
  catch (error: any) {
    res.status(500).json({success: false, error: `Server Error: ${error.message}`})
    
  }
}
export const getAllNotes = async (req: Request, res: Response): Promise<any> => {
  try {
    const notes = await Notes.find().sort({createdAt: -1}).populate({path: "user", select: "-password"});
    if(notes.length === 0) {
      return res.status(200).json({success: true, data: []})
    }
    const publicNotes = notes.filter(note => note.isPublic)
    const filteredNotes = publicNotes.filter(notes => notes.user._id !== req.user?._id);
    res.status(200).json({success: true, data: filteredNotes})
  } 
  catch (error: any) {
    res.status(500).json({success: false, error: `Server Error: ${error.message}`})
  }
}

export const saveNotes = async (req: Request, res: Response) : Promise<any> => {
  try {
    const { id } = req.body;
    const userID = req.user?._id;

    const notes = await Notes.findById(id);

    if(!notes) {
      return res.status(400).json({success: false, error: "Notes not found"})
    }

    const user = await User.findById(userID);

    if(!user) {
      return res.status(400).json({success: false, error: "User not found"})
    }
    const isSaved = user.savedNotes.includes(id);

    if(isSaved) {
      await Notes.updateOne({_id: id}, {$pull: {saves: userID}});
      await User.updateOne({_id: userID}, {$pull: {savedNotes: id}});
      res.status(200).json({success: true, message: `Unsaved ${notes.topic}`})
    }
    else {
      await Notes.updateOne({_id: id}, {$push : {saves: userID}});
      await User.updateOne({_id: userID}, {$push: {savedNotes: id}});
      res.status(200).json({success: true, message: `Saved ${notes.topic}`})
    }
  } 
  catch (error : any) {
    res.status(500).json({success: false, error: `Server Error: ${error.message}`})
  }
}
export const saveDeck = async (req: Request, res: Response) : Promise<any> => {
  try {
    const { id } = req.body;
    const userID = req.user?._id;

    const deck = await FlashcardDeck.findById(id);
    
    if(!deck) {
      return res.status(400).json({success: false, error: "Notes not found"})
    }

    const user = await User.findById(userID);

    if(!user) {
      return res.status(400).json({success: false, error: "User not found"})
    }
    const isSaved = user.savedFlashcardDecks.includes(id);

    if(isSaved) {
      await FlashcardDeck.updateOne({_id: id}, {$pull: {saves: userID}});
      await User.updateOne({_id: userID}, {$pull: {savedFlashcardDecks: id}});
      res.status(200).json({success: true, message: `Unsaved ${deck.topic}`})
    }
    else {
      await FlashcardDeck.updateOne({_id: id}, {$push : {saves: userID}});
      await User.updateOne({_id: userID}, {$push: {savedFlashcardDecks: id}});
      res.status(200).json({success: true, message: `Saved ${deck.topic}`})
    }
  } 
  catch (error : any) {
    res.status(500).json({success: false, error: `Server Error: ${error.message}`});
  }
}
//User's saved notes and flashcard decks
export const getAllSavedDecks = async (req: Request, res: Response) : Promise<any> => {
  try {
    const userID = req.user?._id;

    const user = await User.findById(userID).populate({path: "savedFlashcardDecks", populate: {path: "user", select: "-password"}});

    const decks = user?.savedFlashcardDecks || [];
    res.status(200).json({success: true, data: decks})

  } 
  catch (error : any) {
    res.status(500).json({success: false, error: `Server Error: ${error.message}`})
  }

}
export const getAllSavedNotes = async (req: Request, res: Response): Promise<any> => {
  try {
    const userID = req.user?._id;
    const user = await User.findById(userID).populate({path: "savedNotes", populate: {path: "user", select: "-password"}});

    const notes = user?.savedNotes || [];
    res.status(200).json({success: true, data: notes})
  } 
  catch (error : any) {
    res.status(500).json({success: false, error: `Server Error: ${error.message}`})
  }

}

export const deleteAccount = async (req: Request, res: Response) : Promise<any> => {
  try {
    const userID = req.user?._id;
    await Notes.deleteMany({ _id: { $in: req.user?.notes } });
    await FlashcardDeck.deleteMany({ _id: { $in: req.user?.flashcardDecks } });
    
    await User.findByIdAndDelete(userID);

    res.status(200).json({success: true, message: "Account deleted successfully"})
  } 
  catch (error : any) {
    res.status(500).json({success: false, error: `Server Error: ${error.message}`})  
  }
}