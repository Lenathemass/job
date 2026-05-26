import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function SaveToBoardModal({ isOpen, onClose, image }) {
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && user) {
      fetchBoards();
    }
  }, [isOpen, user]);

  const fetchBoards = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get('/api/boards', config);
      setBoards(data);
    } catch (error) {
      console.error('Failed to fetch boards', error);
    }
  };

  const createBoard = async (e) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;
    setLoading(true);
    try {
      const config = {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}` 
        },
      };
      const { data } = await axios.post('/api/boards', { name: newBoardName }, config);
      setBoards([data, ...boards]);
      setNewBoardName('');
    } catch (error) {
      console.error('Failed to create board', error);
    }
    setLoading(false);
  };

  const saveToBoard = async (boardId) => {
    setLoading(true);
    try {
      const config = {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}` 
        },
      };
      await axios.post(`/api/boards/${boardId}/pins`, { 
        url: image.url, 
        alt: image.alt, 
        height: image.height 
      }, config);
      onClose(); // Close on success
    } catch (error) {
      console.error('Failed to save pin', error);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Save to board</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500">
            ✕
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <img src={image?.url} alt="Preview" className="w-24 h-24 object-cover rounded-xl" />
            <div className="flex-1">
              <form onSubmit={createBoard} className="flex flex-col gap-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Create new board</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    placeholder="Board name"
                    className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-2 text-zinc-900 dark:text-white focus:ring-2 focus:ring-[#e60023]"
                  />
                  <button 
                    type="submit" 
                    disabled={loading || !newBoardName.trim()}
                    className="bg-[#e60023] hover:bg-[#ad081b] text-white px-4 py-2 rounded-xl font-semibold disabled:opacity-50 transition-colors"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>

          <h3 className="text-sm font-medium text-zinc-500 mb-3">All boards</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {boards.length === 0 ? (
              <p className="text-center text-zinc-500 text-sm py-4">No boards yet.</p>
            ) : (
              boards.map(board => (
                <div key={board._id} className="flex justify-between items-center p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group cursor-pointer" onClick={() => saveToBoard(board._id)}>
                  <div className="font-semibold text-zinc-900 dark:text-white">{board.name}</div>
                  <button className="bg-[#e60023] text-white px-4 py-1.5 rounded-full font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Save
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
