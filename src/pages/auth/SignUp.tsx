import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Isi semua kolom');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Password tidak sama');
      return;
    }
    
    if (password.length < 6) {
      toast.error('password minimal harus 6 karakter');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast.success('Account berhasil dibikin, silahkan login');
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Gagal membuat akun');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Buat akun baru</h2>
      
      <form onSubmit={handleSignUp} className="space-y-5">
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
          <label htmlFor="password" className="label">
            Password
          </label>
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
          <p className="text-xs text-slate-500 mt-1">
            minimal 6 karakter
          </p>
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword" className="label">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field"
            placeholder="••••••••"
            required
          />
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
            'Create account'
          )}
        </button>
        
        <div className="text-center text-sm text-slate-600">
          sudah punya akun?{' '}
          <Link to="/login" className="text-blue-800 hover:text-blue-900 font-medium">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;