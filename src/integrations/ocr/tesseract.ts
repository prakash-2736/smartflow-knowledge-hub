// Thin wrapper around Tesseract.js for client-side OCR (for images/scanned PDFs converted to images)
import Tesseract from 'tesseract.js';

export interface OcrResult {
  text: string;
  confidence: number;
}

export async function ocrImage(image: File | Blob, lang: 'eng' | 'mal' | 'eng+mal' = 'eng'):
  Promise<OcrResult> {
  const { data } = await Tesseract.recognize(image, lang, {
    logger: () => {},
  });
  return { text: data.text || '', confidence: data.confidence || 0 };
}


