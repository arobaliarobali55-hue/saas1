
export interface TodoItem {
    task: string;
    description: string;
    category: "Past" | "Present" | "Future";
}

export interface AnalysisResponse {
    todolist: TodoItem[];
    guide: string;
}
