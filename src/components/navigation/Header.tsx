// import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu} from 'lucide-react';

interface HeaderProps {
  toggleMobileMenu: () => void;
}

const Header = ({ toggleMobileMenu }: HeaderProps) => {
  const location = useLocation();
  
  // Get page title based on current route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/income':
        return 'Income';
      case '/expenses':
        return 'Expenses';
      default:
        return 'FinTrack';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-slate-100 h-16 flex items-center px-4 lg:px-6">
      {/* Mobile menu button */}
      <button 
        className="text-slate-600 hover:text-slate-900 focus:outline-none focus:text-slate-900 lg:hidden"
        onClick={toggleMobileMenu}
      >
        <Menu size={24} />
      </button>
      
      {/* Page title */}
      <h1 className="ml-4 lg:ml-0 text-xl font-semibold text-slate-800">
        {getPageTitle()}
      </h1>
      
      {/* Right side actions */}
      {/* <div className="ml-auto flex items-center gap-4">
        <div className="relative hidden md:block">
          <input 
            type="text" 
            placeholder="Search..." 
            className="py-1.5 pl-9 pr-3 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800/30 focus:border-blue-800 transition-all w-48 lg:w-64"
          />
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
        </div>
      </div> */}
    </header>
  );
};

export default Header;