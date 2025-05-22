import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
// import { useAuthStore } from '../../stores/authStore';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Isi semua Kolom');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast.success('Login Berhasil');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login Gagal');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Login dengan Akun Anda</h2>
      
      <form onSubmit={handleLogin} className="space-y-5">
        <div className="form-group">
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="you@example.com"
            required
          />
        </div>
        
        <div className="form-group">
          <div className="flex justify-between">
            <label htmlFor="password" className="label">
              Password
            </label>
            <Link to="#" className="text-sm text-blue-800 hover:text-blue-900">
              Lupa Password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pr-10"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            </div>
          ) : (
            'Sign in'
          )}
        </button>
        
        <div className="text-center text-sm text-slate-600">
         Belum ada Akun?{' '}
          <Link to="/signup" className="text-blue-800 hover:text-blue-900 font-medium">
            Register disini
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;