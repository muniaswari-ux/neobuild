import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Trash2, Plus, Calendar, Tag, Filter } from 'lucide-react';
import { Task, Category } from './types';
import { supabase } from './lib/supabase';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Personal');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState<Category | 'All'>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: title.trim(),
          category,
          due_date: dueDate,
          completed: false,
        }])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setTasks([data, ...tasks]);
        setTitle('');
        setDueDate('');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', id);

      if (error) throw error;
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const filteredTasks = tasks
    .filter(t => filter === 'All' || t.category === filter)
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

  const categories: Category[] = ['Work', 'Personal', 'Shopping', 'Health', 'Education'];

  return (
    <div className='min-h-screen p-4 md:p-8 max-w-3xl mx-auto'>
      <header className='mb-10 text-center'>
        <h1 className='text-4xl font-bold text-slate-800 mb-2'>TaskMaster</h1>
        <p className='text-slate-500'>Stay organized and hit your deadlines</p>
      </header>

      <form onSubmit={addTask} className='bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-1 md:col-span-2'>
            <label className='text-sm font-medium text-slate-600'>Task Title</label>
            <input 
              type='text' 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className='w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all'
              placeholder='What needs to be done?'
            />
          </div>
          <div className='space-y-1'>
            <label className='text-sm font-medium text-slate-600'>Category</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value as Category)}
              className='w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all'
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className='space-y-1'>
            <label className='text-sm font-medium text-slate-600'>Due Date</label>
            <input 
              type='date' 
              value={dueDate} 
              onChange={(e) => setDueDate(e.target.value)}
              className='w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all'
            />
          </div>
        </div>
        <button 
          type='submit'
          className='w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors'
        >
          <Plus size={20} /> Add Task
        </button>
      </form>

      <div className='flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide'>
        <Filter size={18} className='text-slate-400 shrink-0' />
        <button 
          onClick={() => setFilter('All')}
          className={cn("px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors", filter === 'All' ? "bg-slate-800 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50")}
        >
          All
        </button>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn("px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors", filter === cat ? "bg-slate-800 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50")}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className='space-y-3'>
        {loading ? (
          <div className='text-center py-12'>
            <p className='text-slate-400 animate-pulse'>Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className='text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300'>
            <p className='text-slate-400'>No tasks found. Relax or add a new one!</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div 
              key={task.id} 
              className={cn("group bg-white p-4 rounded-xl border transition-all flex items-center gap-4 animate-slide-up", task.completed ? "border-slate-100 opacity-75" : "border-slate-200 shadow-sm hover:border-primary-200 hover:shadow-md")}
            >
              <button 
                onClick={() => toggleTask(task.id)}
                className={cn("shrink-0 transition-colors", task.completed ? "text-green-500" : "text-slate-300 hover:text-primary-500")}
              >
                {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </button>
              
              <div className='flex-1 min-w-0'>
                <h3 className={cn("font-medium truncate", task.completed ? "text-slate-400 line-through" : "text-slate-800")}>
                  {task.title}
                </h3>
                <div className='flex flex-wrap items-center gap-3 mt-1'>
                  <span className='flex items-center gap-1 text-xs text-slate-400'>
                    <Tag size={12} /> {task.category}
                  </span>
                  <span className='flex items-center gap-1 text-xs text-slate-400'>
                    <Calendar size={12} /> {new Date(task.due_date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => deleteTask(task.id)}
                className='text-slate-300 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50'
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;