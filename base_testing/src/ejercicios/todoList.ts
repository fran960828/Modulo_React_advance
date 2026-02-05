export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export class TodoService {
  private todos: Todo[] = [];

  addTodo(text: string): void {
    const newTodo: Todo = { id: Date.now(), text, completed: false };
    this.todos.push(newTodo);
  }

  toggleTodo(id: number): void {
    const todo = this.todos.find(t => t.id === id);
    if (todo) todo.completed = !todo.completed;
  }

  getPending(): Todo[] {
    return this.todos.filter(t => !t.completed);
  }

  getAll(): Todo[] {
    return this.todos;
  }
}