import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Database } from "@/types/database";
import { Plus, Trash2, Receipt } from "lucide-react";
import { format } from "date-fns";

type Expense = Database['public']['Tables']['expenses']['Row'];

const Expenses = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ amount: "", category: "meals", description: "", date: format(new Date(), 'yyyy-MM-dd') });

  const fetchExpenses = async () => {
    const { data } = await supabase.from('expenses').select('*').eq('user_id', user.id).order('date', { ascending: false });
    if (data) setExpenses(data);
    setLoading(false);
  };

  useEffect(() => { fetchExpenses(); }, [user.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('expenses').insert({
      user_id: user.id,
      amount: parseFloat(form.amount),
      category: form.category,
      description: form.description,
      date: form.date,
      status: 'pending'
    });
    if (!error) {
      setShowForm(false);
      setForm({ amount: "", category: "meals", description: "", date: format(new Date(), 'yyyy-MM-dd') });
      fetchExpenses();
    }
  };

  const deleteExpense = async (id: string) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (!error) fetchExpenses();
  };

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>Expenses</h1>
        <button onClick={() => setShowForm(!showForm)} className='flex items-center gap-2 bg-primary-400 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-500 transition-colors'>
          <Plus className='w-5 h-5' />
          New Entry
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className='bg-white p-6 rounded-xl shadow-md border border-primary-100 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>Amount ($)</label>
            <input type='number' step='0.01' required value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-200 outline-none' />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>Category</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-200 outline-none'>
              <option value='meals'>Meals & Entertainment</option>
              <option value='travel'>Travel</option>
              <option value='office'>Office Supplies</option>
              <option value='software'>Software/Subs</option>
              <option value='other'>Other</option>
            </select>
          </div>
          <div className='md:col-span-2'>
            <label className='block text-sm font-medium mb-1'>Description</label>
            <input type='text' required value={form.description} onChange={e => setForm({...form, description: e.target.value})} className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-200 outline-none' />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>Date</label>
            <input type='date' required value={form.date} onChange={e => setForm({...form, date: e.target.value})} className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-200 outline-none' />
          </div>
          <div className='flex items-end'>
            <button type='submit' className='w-full bg-primary-400 text-white py-2 rounded-lg font-bold hover:bg-primary-500'>Save Expense</button>
          </div>
        </form>
      )}

      <div className='bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden'>
        <table className='w-full text-left'>
          <thead className='bg-slate-50 border-b border-slate-200'>
            <tr>
              <th className='px-6 py-4 text-sm font-semibold text-slate-600'>Date</th>
              <th className='px-6 py-4 text-sm font-semibold text-slate-600'>Description</th>
              <th className='px-6 py-4 text-sm font-semibold text-slate-600'>Category</th>
              <th className='px-6 py-4 text-sm font-semibold text-slate-600'>Amount</th>
              <th className='px-6 py-4 text-sm font-semibold text-slate-600'>Status</th>
              <th className='px-6 py-4 text-sm font-semibold text-slate-600 text-right'>Action</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-100'>
            {expenses.map(e => (
              <tr key={e.id} className='hover:bg-slate-50'>
                <td className='px-6 py-4 text-sm'>{format(new Date(e.date), 'MMM dd, yyyy')}</td>
                <td className='px-6 py-4 text-sm font-medium'>{e.description}</td>
                <td className='px-6 py-4 text-sm capitalize'>{e.category}</td>
                <td className='px-6 py-4 text-sm font-semibold'>${e.amount.toFixed(2)}</td>
                <td className='px-6 py-4 text-sm'>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                    e.status === 'pending' ? 'bg-orange-100 text-orange-600' : e.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>{e.status}</span>
                </td>
                <td className='px-6 py-4 text-right'>
                  {e.status === 'pending' && (
                    <button onClick={() => deleteExpense(e.id)} className='text-slate-400 hover:text-red-500'>
                      <Trash2 className='w-4 h-4' />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!loading && expenses.length === 0 && (
              <tr><td colSpan={6} className='px-6 py-12 text-center text-slate-400'>No expenses found. Add your first one!</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Expenses;