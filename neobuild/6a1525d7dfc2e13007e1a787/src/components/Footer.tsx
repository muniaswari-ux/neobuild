import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className='w-full border-t border-gray-200 py-6 mt-auto bg-white'>
      <div className='container mx-auto px-4 text-center text-gray-600'>
        <p>&copy; {new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;