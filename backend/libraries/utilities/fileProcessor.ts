import { extractTextFromPDF, extractTextFromDocx, extractTextFromImage } from "../../middleware/upload";

export const processUploadedFile = async (file: Express.Multer.File) : Promise<string> => {
    const mimetype = file.mimetype;
    const buffer = file.buffer

    if (mimetype === "application/pdf") {
        return await extractTextFromPDF(buffer);
    }

    if (mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.originalname.endsWith(".docx")) {
        return await extractTextFromDocx(buffer);
    }

    if(mimetype.startsWith("image/")) {
        return await extractTextFromImage(buffer)
    }

    throw new Error("Unsupported file type")
}

