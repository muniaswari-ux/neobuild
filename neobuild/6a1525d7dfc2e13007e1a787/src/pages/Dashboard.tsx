import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Database } from "@/types/database";
import { TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";
import { format, startOfMonth, endOfMonth } from "date-fns";

type Expense = Database['public']['Tables']['expenses']['Row'];

const Dashboard = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      const start = startOfMonth(new Date()).toISOString();
      const end = endOfMonth(new Date()).toISOString();
      const { data } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', start)
        .lte('date', end);
      if (data) setExpenses(data);
      setLoading(false);
    };
    fetchExpenses();
  }, [user.id]);

  const stats = {
    total: expenses.reduce((sum, e) => sum + e.amount, 0),
    pending: expenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0),
    approved: expenses.filter(e => e.status === 'approved').reduce((sum, e) => sum + e.amount, 0),
    rejected: expenses.filter(e => e.status === 'rejected').reduce((sum, e) => sum + e.amount, 0)
  };

  const categories = [...new Set(expenses.map(e => e.category))];
  const catTotals = categories.map(cat => ({
    name: cat,
    total: expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
  })).sort((a, b) => b.total - a.total);

  if (loading) return <div>Loading Summary...</div>;

  return (
    <div className='space-y-8'>
      <div className='flex justify-between items-end'>
        <div>
          <h1 className='text-3xl font-bold text-slate-800'>Monthly Summary</h1>
          <p className='text-slate-500'>{format(new Date(), 'MMMM yyyy')}</p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <StatCard title='Total Expenses' value={stats.total} icon={<TrendingUp className='text-primary-400' />} color='bg-primary-50' />
        <StatCard title='Pending Approval' value={stats.pending} icon={<Clock className='text-orange-400' />} color='bg-orange-50' />
        <StatCard title='Approved' value={stats.approved} icon={<CheckCircle className='text-green-400' />} color='bg-green-50' />
        <StatCard title='Rejected' value={stats.rejected} icon={<XCircle className='text-red-400' />} color='bg-red-50' />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <div className='bg-white p-6 rounded-xl shadow-sm border border-slate-100'>
          <h2 className='text-lg font-semibold mb-4'>Expenses by Category</h2>
          <div className='space-y-4'>
            {catTotals.map(cat => (
              <div key={cat.name}>
                <div className='flex justify-between text-sm mb-1'>
                  <span className='capitalize'>{cat.name}</span>
                  <span className='font-medium'>${cat.total.toFixed(2)}</span>
                </div>
                <div className='w-full bg-slate-100 h-2 rounded-full overflow-hidden'>
                  <div className='bg-primary-300 h-full' style={{ width: `${(cat.total / stats.total) * 100}%` }}></div>
                </div>
              </div>
            ))}
            {catTotals.length === 0 && <p className='text-slate-400 text-center py-8'>No data this month</p>}
          </div>
        </div>

        <div className='bg-white p-6 rounded-xl shadow-sm border border-slate-100'>
          <h2 className='text-lg font-semibold mb-4'>Recent Activity</h2>
          <div className='space-y-4'>
            {expenses.slice(0, 5).map(e => (
              <div key={e.id} className='flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors'>
                <div className='flex items-center gap-3'>
                  <div className={`w-2 h-2 rounded-full ${e.status === 'pending' ? 'bg-orange-400' : e.status === 'approved' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <div>
                    <p className='font-medium text-sm'>{e.description || e.category}</p>
                    <p className='text-xs text-slate-400'>{format(new Date(e.date), 'MMM dd')}</p>
                  </div>
                </div>
                <span className='font-semibold text-sm'>${e.amount.toFixed(2)}</span>
              </div>
            ))}
            {expenses.length === 0 && <p className='text-slate-400 text-center py-8'>No recent expenses</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: any) => (
  <div className='bg-white p-6 rounded-xl shadow-sm border border-slate-100'>
    <div className='flex items-start justify-between'>
      <div>
        <p className='text-sm text-slate-500'>{title}</p>
        <p className='text-2xl font-bold mt-1'>${value.toFixed(2)}</p>
      </div>
      <div className={`${color} p-2 rounded-lg`}>{icon}</div>
    </div>
  </div>
);

export default Dashboard;