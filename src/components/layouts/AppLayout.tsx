import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../navigation/Sidebar';
import Header from '../navigation/Header';

const AppLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const location = useLocation();

  // Handle animation on route change
  useEffect(() => {
    setIsMounted(false);
    const timeout = setTimeout(() => {
      setIsMounted(true);
    }, 10);
    return () => clearTimeout(timeout);
  }, [location]);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar - hidden on mobile */}
      <Sidebar isMobileOpen={isMobileMenuOpen} />
      
      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        
        {/* Main content with transition */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <div 
            className={`page-transition ${isMounted ? 'opacity-100' : 'opacity-0'}`}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;