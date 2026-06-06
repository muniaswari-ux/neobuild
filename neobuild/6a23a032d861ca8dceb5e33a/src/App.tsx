import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import AuthForm from './components/AuthForm';
import ContactManager from './components/ContactManager';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className='min-h-screen flex flex-col'>
          <Navbar />
          <main className='flex-grow'>
            <Routes>
              <Route path="/" element={
                <>
                  <Hero />
                  <Features />
                  <Pricing />
                </>
              } />
              <Route path="/signin" element={<AuthForm mode="signin" />} />
              <Route path="/signup" element={<AuthForm mode="signup" />} />
              <Route path="/contacts" element={<ContactManager />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;