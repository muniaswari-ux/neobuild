import React from 'react';
import Navbar from './Navbar';

const Header: React.FC = () => {
  return (
    <header className='w-full border-b border-gray-200 bg-white'>
      <Navbar />
    </header>
  );
};

export default Header;