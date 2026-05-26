import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Database } from "@/types/database";
import { Check, X, User } from "lucide-react";
import { format } from "date-fns";

type ExpenseWithUser = Database['public']['Tables']['expenses']['Row'] & { profiles: { full_name: string } };

const Approvals = () => {
  const { profile } = useAuth();
  const [items, setItems] = useState<ExpenseWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    const { data } = await supabase
      .from('expenses')
      .select('*, profiles(full_name)')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });
    if (data) setItems(data as any);
    setLoading(false);
  };

  useEffect(() => {
    if (profile?.role === 'manager') fetchPending();
  }, [profile]);

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase.from('expenses').update({ status }).eq('id', id);
    if (!error) fetchPending();
  };

  if (profile?.role !== 'manager') return <div className='p-8 text-center'>Access Denied. Only managers can view approvals.</div>;

  return (
    <div className='max-w-5xl mx-auto'>
      <h1 className='text-3xl font-bold mb-8'>Pending Approvals</h1>

      <div className='space-y-4'>
        {items.map(item => (
          <div key={item.id} className='bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div className='flex items-start gap-4'>
              <div className='bg-slate-100 p-3 rounded-full'>
                <User className='w-6 h-6 text-slate-500' />
              </div>
              <div>
                <p className='font-bold text-lg'>${item.amount.toFixed(2)}</p>
                <p className='text-slate-600 font-medium'>{item.description}</p>
                <div className='flex gap-4 mt-1 text-xs text-slate-400'>
                  <span>User: {item.profiles?.full_name}</span>
                  <span>Category: {item.category}</span>
                  <span>Date: {format(new Date(item.date), 'MMM dd, yyyy')}</span>
                </div>
              </div>
            </div>
            <div className='flex gap-2'>
              <button onClick={() => updateStatus(item.id, 'approved')} className='flex-1 md:flex-none flex items-center justify-center gap-1 bg-green-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 transition-colors'>
                <Check className='w-4 h-4' /> Approve
              </button>
              <button onClick={() => updateStatus(item.id, 'rejected')} className='flex-1 md:flex-none flex items-center justify-center gap-1 bg-white border border-red-200 text-red-500 px-4 py-2 rounded-lg font-bold hover:bg-red-50 transition-colors'>
                <X className='w-4 h-4' /> Reject
              </button>
            </div>
          </div>
        ))}
        {!loading && items.length === 0 && (
          <div className='bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-400'>
            All clear! No pending expenses to approve.
          </div>
        )}
      </div>
    </div>
  );
};
export default Approvals;