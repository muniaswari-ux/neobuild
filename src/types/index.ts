export type Category = 'Work' | 'Personal' | 'Shopping' | 'Health' | 'Education';

export interface Task {
  id: string;
  title: string;
  category: Category;
  due_date: string;
  completed: boolean;
  created_at: string;
}