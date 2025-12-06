import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini client
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

/**
 * Generates a creative tattoo concept based on user input.
 * @param userIdea The user's rough idea or keywords.
 * @returns A structured string description of a tattoo design.
 */
export const generateTattooConcept = async (userIdea: string): Promise<string> => {
  try {
    if (!ai) {
      return "AI feature requires an API key. Please add GEMINI_API_KEY to your .env file to enable this feature.";
    }
    
    const modelId = 'gemini-2.5-flash'; 
    const prompt = `
      You are a world-class tattoo artist and designer.
      The user has an idea: "${userIdea}".
      
      Please provide a creative, detailed tattoo concept description based on this idea.
      Include:
      1. Suggested visual style (e.g., Neo-traditional, Watercolor, Fine Line, Realism).
      2. Key elements and composition.
      3. Suggested placement on the body.
      4. Color palette recommendations (or black & grey).
      
      Keep the tone professional, artistic, and inspiring. Keep the response under 150 words.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    return response.text || "Unable to generate a concept at this time. Please try again.";
  } catch (error) {
    console.error("Error generating tattoo concept:", error);
    return "Our AI muse is currently resting. Please try again later or consult an artist in person.";
  }
};
