import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Receipt, LayoutDashboard, CheckSquare, LogOut } from "lucide-react";

const Navbar: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <nav className='bg-white border-b border-slate-200 sticky top-0 z-50'>
      <div className='container mx-auto px-4 h-16 flex items-center justify-between'>
        <Link to='/' className='flex items-center gap-2 font-bold text-xl text-primary-400'>
          <Receipt className='w-6 h-6' />
          <span>ExpenseTracker</span>
        </Link>
        
        <div className='flex items-center gap-6'>
          <Link to='/' className='flex items-center gap-1 text-slate-600 hover:text-primary-400 transition-colors'>
            <LayoutDashboard className='w-4 h-4' />
            <span className='hidden sm:inline'>Dashboard</span>
          </Link>
          <Link to='/expenses' className='flex items-center gap-1 text-slate-600 hover:text-primary-400 transition-colors'>
            <Receipt className='w-4 h-4' />
            <span className='hidden sm:inline'>Expenses</span>
          </Link>
          {profile?.role === 'manager' && (
            <Link to='/approvals' className='flex items-center gap-1 text-slate-600 hover:text-primary-400 transition-colors'>
              <CheckSquare className='w-4 h-4' />
              <span className='hidden sm:inline'>Approvals</span>
            </Link>
          )}
          <button onClick={handleLogout} className='flex items-center gap-1 text-slate-600 hover:text-red-500 transition-colors'>
            <LogOut className='w-4 h-4' />
            <span className='hidden sm:inline'>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;