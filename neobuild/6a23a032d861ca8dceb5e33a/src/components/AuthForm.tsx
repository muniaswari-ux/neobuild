import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface AuthFormProps {
  mode: 'signin' | 'signup';
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
        {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border transition-all"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border transition-all"
            placeholder="••••••••"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 px-4 rounded-xl font-bold hover:bg-secondary transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
        >
          {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
      <div className="mt-6 text-center">
        <button 
          onClick={() => navigate(mode === 'signin' ? '/signup' : '/signin')}
          className="text-sm text-gray-600 hover:text-primary font-medium"
        >
          {mode === 'signin' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;