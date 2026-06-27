import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    const result = await resetPassword(token, password);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-zinc-50 dark:bg-dark-bg -z-10" />

      <div className="max-w-md w-full space-y-8 glass-card p-10 rounded-4xl">
        <div className="flex flex-col items-center">
          <Logo className="w-12 h-12 mb-6" />
          <h2 className="text-center text-3xl font-extrabold text-zinc-900 dark:text-white mb-2">
            Set New Password
          </h2>
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            Please enter your new password below.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {success ? (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-300 p-3 rounded-xl text-sm text-center font-medium">
              Password has been reset successfully! Redirecting to login...
            </div>
          ) : null}
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-500 p-3 rounded-xl text-sm text-center font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="sr-only">New Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-2xl relative block w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 placeholder-zinc-500 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all"
                placeholder="New Password"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm New Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none rounded-2xl relative block w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 placeholder-zinc-500 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all"
                placeholder="Confirm New Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || success}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-primary transition-colors"
            >
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
