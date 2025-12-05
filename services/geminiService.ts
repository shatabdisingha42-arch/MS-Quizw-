import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Subject, Question } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const questionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    text: {
      type: Type.STRING,
      description: "The text of the quiz question."
    },
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of exactly 4 possible answer options.",
    },
    correctAnswerIndex: {
      type: Type.INTEGER,
      description: "The index (0-3) of the correct answer in the options array."
    },
    explanation: {
      type: Type.STRING,
      description: "A brief explanation of why the answer is correct."
    }
  },
  required: ["text", "options", "correctAnswerIndex"]
};

const responseSchema: Schema = {
  type: Type.ARRAY,
  items: questionSchema
};

export const generateQuizQuestions = async (
  subject: Subject,
  level: number,
  count: number
): Promise<Question[]> => {
  const model = "gemini-2.5-flash";
  
  // Refined difficulty logic for 1-1000 scale
  let difficultyDescription = "";
  if (level <= 100) difficultyDescription = "Level 1-100 (Novice): Very simple, fundamental facts suitable for elementary school.";
  else if (level <= 300) difficultyDescription = "Level 101-300 (Beginner): Basic concepts, middle school level.";
  else if (level <= 500) difficultyDescription = "Level 301-500 (Intermediate): High school standard, combining multiple concepts.";
  else if (level <= 700) difficultyDescription = "Level 501-700 (Advanced): Undergraduate level, technical details, complex reasoning.";
  else if (level <= 900) difficultyDescription = "Level 701-900 (Expert): Graduate level, niche exceptions, deep analysis.";
  else difficultyDescription = "Level 901-1000 (Master): World-class difficulty. Extremely obscure facts or highly complex multi-step problems requiring PhD level knowledge.";

  const prompt = `
    You are an advanced quiz engine.
    Subject: ${subject}
    Target Question Count: ${count}
    
    DIFFICULTY SETTING: ${level}/1000
    Context: ${difficultyDescription}

    Instructions:
    1. Generate exactly ${count} multiple-choice questions.
    2. Adhere STRICTLY to the difficulty level of ${level}. 
       - If level is 10, questions must be trivial.
       - If level is 990, questions must be incredibly hard for a human to solve without reference.
    3. Provide 4 distinct options for each question.
    4. Ensure the correct answer is unambiguous.
    5. Return ONLY the JSON matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7, // Slight increase for variety while maintaining structure
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No text returned from Gemini API");
    }

    const rawQuestions = JSON.parse(jsonText);
    
    const questions: Question[] = rawQuestions.map((q: any, index: number) => ({
      id: index,
      text: q.text,
      options: q.options,
      correctAnswerIndex: q.correctAnswerIndex,
      explanation: q.explanation
    }));

    return questions;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate quiz questions. Please ensure your API key is valid and try again.");
  }
};