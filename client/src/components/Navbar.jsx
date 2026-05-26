import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="fixed w-full z-50 glass-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="transform transition-transform group-hover:scale-110">
              <Logo className="w-8 h-8" />
            </div>
            <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-white hidden sm:block">
              PinApp
            </span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl px-4 sm:px-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-2 pl-10 rounded-full focus:outline-none focus:ring-2 focus:ring-[#e60023] transition-all"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400">
                🔍
              </span>
            </form>
          </div>

          {/* Nav Links & Actions */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            
            {user ? (
              <>
                <Link to="/boards" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white font-medium transition-colors hidden sm:block">
                  Boards
                </Link>
                <Link to="/inbox" className="text-xl p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors" title="Inbox">
                  💬
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white px-4 py-2 rounded-full font-semibold transition-all shadow-sm text-sm shrink-0"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white font-medium transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="bg-[#e60023] hover:bg-[#ad081b] text-white px-5 py-2 rounded-full font-semibold transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
