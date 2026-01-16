import { AnalysisResponse, TodoItem } from "@/types/ai";

const apiKey = process.env.GROQ_API_KEY || "";

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

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that returns only valid JSON."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "groq/compound",
            response_format: { type: "json_object" }
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Groq API Error:", errorText);
        throw new Error(`Groq API error: ${response.statusText}`);
    }

    const result = await response.json();
    let text = result.choices?.[0]?.message?.content || "";

    if (!text) {
        console.error("Empty response from Groq:", result);
        throw new Error("Empty response from AI");
    }

    // Clean the text if it contains markdown code blocks
    let cleanJson = text.trim();
    if (cleanJson.includes("```")) {
        const match = cleanJson.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (match) {
            cleanJson = match[1];
        } else {
            cleanJson = cleanJson.replace(/```json|```/g, "").trim();
        }
    }

    try {
        const parsed = JSON.parse(cleanJson);

        return {
            todolist: parsed.todolist || parsed.todoList || parsed.items || [],
            guide: parsed.guide || parsed.analysis || parsed.philosophy || ""
        };
    } catch {
        console.error("Failed to parse AI response:", text);
        throw new Error("Invalid response format from AI");
    }
}
