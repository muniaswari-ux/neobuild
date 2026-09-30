import "./index.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  public state = { hasError: false };
  public static getDerivedStateFromError(): { hasError: boolean } { return { hasError: true }; }
  public render(): React.ReactNode { return this.state.hasError ? <main className='min-h-screen grid place-items-center p-6 text-center'><div><h1 className='text-2xl font-bold'>Something went wrong</h1><p className='mt-2 text-white/60'>Refresh the page to start a fresh game.</p></div></main> : this.props.children; }
}

createRoot(document.getElementById("root")!).render(<StrictMode><ErrorBoundary><AuthProvider><App /></AuthProvider></ErrorBoundary></StrictMode>);