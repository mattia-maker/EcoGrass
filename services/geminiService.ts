import { GoogleGenAI, Type } from "@google/genai";
import { FormData, GeminiResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLawnAnalysis = async (data: FormData): Promise<GeminiResponse> => {
  try {
    const prompt = `
      Sei un esperto giardiniere per EcoGrass, azienda di Como, Italia.
      
      Dati Cliente:
      - Città: ${data.city || 'Como'}
      - Indirizzo: ${data.address}
      - Superficie: ${data.sqm} mq
      - Condizioni: ${data.condition}
      
      Compiti:
      1. Stima la distanza stradale approssimativa (in km) da "Como Centro" a "${data.city || 'Como'}". Se è la stessa città, metti 5.
      2. Fornisci un breve consiglio tecnico (max 100 parole) sul taglio: frequenza consigliata, altezza di taglio ideale e se conviene il mulching o la raccolta in base alle condizioni dichiarate.

      Rispondi ESCLUSIVAMENTE con un oggetto JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            advice: { type: Type.STRING, description: "Consigli tecnici sul taglio e manutenzione" },
            distanceKm: { type: Type.NUMBER, description: "Distanza stimata in km da Como" }
          },
          required: ["advice", "distanceKm"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text");
    
    return JSON.parse(text) as GeminiResponse;

  } catch (error) {
    console.error("Errore Gemini:", error);
    return {
      advice: "Consigli standard: mantenere l'erba a 4-5cm e irrigare regolarmente.",
      distanceKm: 10 // Fallback distance
    };
  }
};