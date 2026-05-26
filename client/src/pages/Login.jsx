import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const isSignup = location.pathname === '/signup';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const action = isSignup ? register : login;
    const result = await action(email, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-zinc-50 dark:bg-[#121212] -z-10" />
      
      <div className="max-w-md w-full space-y-8 glass-card p-10 rounded-[32px]">
        <div className="flex flex-col items-center">
          <Logo className="w-12 h-12 mb-6" />
          <h2 className="text-center text-3xl font-extrabold text-zinc-900 dark:text-white mb-2">
            Welcome to PinApp
          </h2>
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            {isSignup ? 'Sign up to find new ideas' : 'Log in to find new ideas'}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-500 p-3 rounded-xl text-sm text-center font-medium">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-2xl relative block w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 placeholder-zinc-500 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-[#e60023] focus:border-transparent sm:text-sm transition-all"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isSignup ? "new-password" : "current-password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-2xl relative block w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 placeholder-zinc-500 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-[#e60023] focus:border-transparent sm:text-sm transition-all"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-[#e60023] hover:bg-[#ad081b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e60023] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : (isSignup ? 'Sign up' : 'Log in')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
