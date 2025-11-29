import { GoogleGenAI } from "@google/genai";

const getEnv = (key: string) => {
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (e) {}
  return '';
};

const apiKey = getEnv('API_KEY');

// Initialize only if key exists
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateContent = async (prompt: string, roleContext: string): Promise<string> => {
  if (!ai) {
    return "AI Feature Unavailable: API Key is missing in environment variables.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are an intelligent assistant integrated into 'SAMPARK KVK', a school management app for Kendriya Vidyalaya. 
        Your current user role context is: ${roleContext}.
        
        If User is Admin: Help draft formal circulars, analyze attendance trends, or suggest event schedules.
        If User is Teacher: Help create lesson plans, generate quiz questions, or draft comments for report cards.
        If User is Parent/Student: Explain homework topics simply, suggest study schedules, or summarize notices.
        
        Keep responses professional, concise, and formatted for easy reading.`,
      }
    });
    
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error while processing your request. Please try again later.";
  }
};