import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  // Settings, 
  LogOut, 
  Wallet 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

interface SidebarProps {
  isMobileOpen: boolean;
}

const Sidebar = ({ isMobileOpen }: SidebarProps) => {
  const location = useLocation();
  const { user } = useAuthStore();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <aside 
      className={`bg-white border-r border-slate-100 w-64 fixed inset-y-0 left-0 z-30 
                  transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto
                  ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-100">
        <Wallet className="h-6 w-6 text-blue-800" />
        <span className="text-xl font-semibold text-slate-900">FinTrack</span>
      </div>
      
      {/* User info */}
      <div className="px-6 py-4 border-b border-slate-100">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium text-slate-700 truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation links */}
      <nav className="p-4 space-y-1">
        <Link 
          to="/dashboard" 
          className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </Link>
        
        <Link 
          to="/income" 
          className={`nav-link ${isActive('/income') ? 'active' : ''}`}
        >
          <ArrowUpCircle size={18} className="text-green-500" />
          <span>Income</span>
        </Link>
        
        <Link 
          to="/expenses" 
          className={`nav-link ${isActive('/expenses') ? 'active' : ''}`}
        >
          <ArrowDownCircle size={18} className="text-red-500" />
          <span>Expenses</span>
        </Link>
        
        <div className="pt-4 mt-4 border-t border-slate-100">
          <button 
            className="nav-link w-full text-left"
            onClick={handleSignOut}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;