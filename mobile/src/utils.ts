import { Todo } from './types';

export const computeStats = (todos: Todo[]) => {
  const total = todos.length;
  let completed = 0;
  for (const t of todos) if (t.completed) completed++;
  const pending = total - completed;
  return { total, completed, pending };
};
