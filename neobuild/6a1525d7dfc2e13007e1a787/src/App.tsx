import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Expenses = lazy(() => import("@/pages/Expenses"));
const Approvals = lazy(() => import("@/pages/Approvals"));

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className='min-h-screen flex flex-col'>
          <Header />
          <main className='flex-grow container mx-auto px-4 py-8'>
            <Suspense fallback={<div className='flex items-center justify-center h-full'>Loading...</div>}>
              <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path='/expenses' element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
                <Route path='/approvals' element={<ProtectedRoute><Approvals /></ProtectedRoute>} />
                <Route path='*' element={<Navigate to='/' replace />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;