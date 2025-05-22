import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <h1 className="text-8xl font-bold text-blue-800">404</h1>
      <h2 className="text-2xl font-semibold mt-4 mb-6 text-slate-700">Page Not Found</h2>
      <p className="text-slate-600 mb-8 text-center max-w-md">
        Page yang kamu cari tidak ditemui.
      </p>
      <Link 
        to="/" 
        className="btn-primary"
      >
        Back
      </Link>
    </div>
  );
};

export default NotFound;