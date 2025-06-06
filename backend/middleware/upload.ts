import multer from 'multer';

import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import Tesseract from "tesseract.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });




export const extractTextFromPDF = async (fileBuffer: Buffer): Promise<string> => {
  const data = await pdf(fileBuffer);
  return data.text;
};

export const extractTextFromDocx = async (fileBuffer: Buffer): Promise<string> => {
  const { value } = await mammoth.extractRawText({ buffer: fileBuffer });
  return value;
};

export const extractTextFromImage = async (fileBuffer: Buffer): Promise<string> => {
  const { data: { text } } = await Tesseract.recognize(fileBuffer, 'eng');
  return text;
};

export default upload;
