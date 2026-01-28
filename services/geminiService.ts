
import { GoogleGenAI } from "@google/genai";
import { AssignmentType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAcademicMotivation = async (studentName: string, type: AssignmentType, fileName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Berikan pesan motivasi singkat (maksimal 2 kalimat) dalam Bahasa Indonesia untuk mahasiswa bernama ${studentName} yang baru saja mengumpulkan tugas jenis ${type} dengan judul file "${fileName}". Gunakan nada yang mendukung dan profesional layaknya dosen pendamping akademik.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text || "Terima kasih telah mengumpulkan tugas tepat waktu!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Tugas berhasil diterima. Teruslah berkarya!";
  }
};
