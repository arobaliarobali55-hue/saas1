
const apiKey = process.env.BYTEZ_API_KEY || "";

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

    const response = await fetch("https://api.bytez.com/models/v2/Qwen/Qwen3-4B", {
        method: "POST",
        headers: {
            "Authorization": apiKey,
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
            stream: false,
            params: {
                max_length: 2000,
                temperature: 0.7
            }
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Bytez API Error:", errorText);
        throw new Error(`Bytez API error: ${response.statusText}`);
    }

    const result = await response.json();

    // Bytez v2 format: { error: null, output: { role: 'assistant', content: '...' } }
    let text = "";
    if (result.output && typeof result.output === 'object') {
        text = result.output.content || "";
    } else if (result.choices?.[0]?.message?.content) {
        text = result.choices[0].message.content;
    } else if (typeof result.output === 'string') {
        text = result.output;
    }

    if (!text) {
        console.error("Empty response from Bytez:", result);
        throw new Error("Empty response from AI");
    }

    // Strip <think>...</think> tags if present
    text = text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

    // Clean the text if it contains markdown code blocks
    let cleanJson = text;
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
