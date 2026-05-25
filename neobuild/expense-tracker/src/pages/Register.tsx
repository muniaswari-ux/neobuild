import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Receipt } from "lucide-react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<'employee' | 'manager'>('employee');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName,
        role: role
      });
      if (profileError) {
        setError(profileError.message);
        setLoading(false);
      } else {
        navigate("/");
      }
    }
  };

  return (
    <div className='max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow-lg border border-slate-100'>
      <div className='flex flex-col items-center mb-8'>
        <div className='bg-primary-50 p-3 rounded-full mb-4'>
          <Receipt className='w-8 h-8 text-primary-400' />
        </div>
        <h1 className='text-2xl font-bold'>Join ExpenseTracker</h1>
        <p className='text-slate-500'>Create your team account</p>
      </div>

      <form onSubmit={handleRegister} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-slate-700 mb-1'>Full Name</label>
          <input type='text' value={fullName} onChange={(e) => setFullName(e.target.value)} required className='w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200' placeholder='John Doe' />
        </div>
        <div>
          <label className='block text-sm font-medium text-slate-700 mb-1'>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value as 'employee' | 'manager')} className='w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200'>
            <option value='employee'>Employee</option>
            <option value='manager'>Manager</option>
          </select>
        </div>
        <div>
          <label className='block text-sm font-medium text-slate-700 mb-1'>Email</label>
          <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} required className='w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200' placeholder='you@example.com' />
        </div>
        <div>
          <label className='block text-sm font-medium text-slate-700 mb-1'>Password</label>
          <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} required className='w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200' placeholder='••••••••' />
        </div>
        {error && <p className='text-red-500 text-sm'>{error}</p>}
        <button type='submit' disabled={loading} className='w-full bg-primary-400 text-white py-2 rounded-lg font-semibold hover:bg-primary-500 transition-colors disabled:opacity-50'>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className='mt-6 text-center text-slate-600 text-sm'>
        Already have an account? <Link to='/login' className='text-primary-400 font-semibold hover:underline'>Login</Link>
      </p>
    </div>
  );
};
export default Register;