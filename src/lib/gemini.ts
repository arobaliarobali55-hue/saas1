import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export const model = genAI.getGenerativeModel(
  { model: "gemini-2.0-flash" },
  { apiVersion: "v1" }
);

export interface TodoItem {
  task: string;
  description: string;
  category: "Past" | "Present" | "Future";
}

export interface AnalysisResponse {
  todolist: TodoItem[];
  guide: string;
}

export async function analyzeStories(past: string, present: string, future: string): Promise<AnalysisResponse> {
  const prompt = `
    Analyze the following user stories and create a comprehensive To-Do list for their future plans, 
    considering their past experiences and current situation.
    
    Past Story: ${past}
    Present Situation: ${present}
    Future Plan: ${future}
    
    Return the response in JSON format:
    {
      "todolist": [
        { "task": "Short task name", "description": "Detailed explanation", "category": "Future" }
      ],
      "guide": "A detailed multi-paragraph guide/philosophy for their journey."
    }
  `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  // Clean the text if it contains markdown code blocks
  let cleanJson = text.trim();
  if (cleanJson.includes("```")) {
    cleanJson = cleanJson.replace(/```json|```/g, "").trim();
  }

  try {
    const parsed = JSON.parse(cleanJson);

    // Normalize keys in case AI uses camelCase or different naming
    return {
      todolist: parsed.todolist || parsed.todoList || parsed.items || [],
      guide: parsed.guide || parsed.analysis || parsed.philosophy || ""
    };
  } catch {
    console.error("Failed to parse AI response:", text);
    throw new Error("Invalid response format from AI");
  }
}
