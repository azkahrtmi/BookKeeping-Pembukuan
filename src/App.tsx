import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { useAuthStore } from './stores/authStore';

// Layouts
import AppLayout from './components/layouts/AppLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Auth Pages
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';

// App Pages
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import NotFound from './pages/NotFound';

// Guards
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';

function App() {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check active session and set user on app initialization
    const initAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (data.session) {
        setUser(data.session.user);
      }
      
      if (error) {
        console.error("Error retrieving session:", error);
      }
      
      setIsLoading(false);
      
      // Listen for auth state changes
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            setUser(session.user);
          } else {
            setUser(null);
          }
        }
      );
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    };

    initAuth();
  }, [setUser]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
    </div>;
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
      </Route>
      
      {/* App Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expenses" element={<Expenses />} />
        </Route>
      </Route>
      
      {/* Redirect root to dashboard if logged in, otherwise to login */}
      <Route 
        path="/" 
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
      />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;