import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Boards() {
  const { user } = useAuth();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/boards', config);
        setBoards(data);
      } catch (error) {
        console.error('Error fetching boards', error);
      }
      setLoading(false);
    };

    if (user) {
      fetchBoards();
    }
  }, [user]);

  const handleDeleteBoard = async (boardId) => {
    if (!window.confirm('Are you sure you want to delete this board?')) {
      return;
    }
    
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`/api/boards/${boardId}`, config);
      setBoards(boards.filter(board => board._id !== boardId));
    } catch (error) {
      console.error('Error deleting board', error);
      alert('Failed to delete board');
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading boards...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 pt-24 min-h-[calc(100vh-4rem)]">
      <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-8">My Boards</h1>
      
      {boards.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          <p className="text-xl">You don't have any boards yet.</p>
          <p className="mt-2">Click the + icon on any image to create one and save it.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {boards.map(board => (
            <div key={board._id} className="bg-white dark:bg-zinc-800 rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start ml-2 mb-2">
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{board.name}</h2>
                  <p className="text-zinc-500 text-sm mt-1">{board.pins.length} pins</p>
                </div>
                <button 
                  onClick={() => handleDeleteBoard(board._id)}
                  className="text-zinc-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                  title="Delete board"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-2 h-48">
                {board.pins.slice(0, 4).map((pin, i) => (
                  <img 
                    key={i} 
                    src={pin.url} 
                    alt={pin.alt} 
                    className="w-full h-full object-cover rounded-xl"
                  />
                ))}
                {/* Fill empty spots if less than 4 pins */}
                {Array.from({ length: Math.max(0, 4 - board.pins.length) }).map((_, i) => (
                  <div key={`empty-${i}`} className="w-full h-full bg-zinc-100 dark:bg-zinc-700/50 rounded-xl"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
