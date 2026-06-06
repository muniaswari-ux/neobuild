import React from 'react';
import { Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className='sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16 items-center'>
          <Link to='/' className='flex items-center space-x-2'>
            <Rocket className='h-8 w-8 text-primary' />
            <span className='text-xl font-bold tracking-tight'>SaaSify</span>
          </Link>
          <div className='hidden md:flex space-x-8'>
            <a href='/#features' className='text-gray-600 hover:text-primary transition-colors'>Features</a>
            <a href='/#pricing' className='text-gray-600 hover:text-primary transition-colors'>Pricing</a>
            <a href='#' className='text-gray-600 hover:text-primary transition-colors'>Resources</a>
          </div>
          <div className='flex items-center space-x-4'>
            {user ? (
              <>
                <span className="hidden sm:inline text-sm text-gray-600">{user.email}</span>
                <button 
                  onClick={() => signOut()}
                  className='text-gray-600 font-medium px-4 py-2 hover:text-primary transition-colors'
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to='/signin' className='text-gray-600 font-medium px-4 py-2 hover:text-primary transition-colors'>Log in</Link>
                <Link to='/signup' className='bg-primary text-white px-5 py-2 rounded-lg font-medium hover:bg-secondary transition-all shadow-md shadow-primary/10'>Get Started</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;