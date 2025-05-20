import {StartTaskResponse, Task} from "../types/task.js";


class TaskService {
	private tasks: Map<string, Task> = new Map();

	createTask(): StartTaskResponse {
		const taskId = Date.now().toString();
		this.tasks.set(taskId, { id: taskId, status: "pending" });
		return { taskId };
	}

	updateTask(taskId: string, updates: Partial<Task>): void {
		const task = this.tasks.get(taskId);
		if (task) {
			this.tasks.set(taskId, { ...task, ...updates });
		}
	}

	getTask(taskId: string): Task | undefined {
		return this.tasks.get(taskId);
	}
}

export const taskService = new TaskService();