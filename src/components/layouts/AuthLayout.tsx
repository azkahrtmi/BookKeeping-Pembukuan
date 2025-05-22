import { Outlet } from 'react-router-dom';
import { Wallet } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Wallet className="h-12 w-12 text-blue-800" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
          FinTrack
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Pembukuan Personal kamu
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-lg sm:px-10 border border-slate-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;