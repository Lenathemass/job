import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Inbox() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/users', config);
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };
    if (user) fetchUsers();
  }, [user]);

  useEffect(() => {
    let interval;
    const fetchMessages = async () => {
      if (!activeUser) return;
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`/api/messages/${activeUser._id}`, config);
        setMessages(data);
        scrollToBottom();
      } catch (error) {
        console.error('Error fetching messages', error);
      }
    };

    if (activeUser) {
      fetchMessages();
      interval = setInterval(fetchMessages, 3000); // Polling every 3s
    }
    return () => clearInterval(interval);
  }, [activeUser, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeUser) return;

    const msgText = newMessage;
    setNewMessage('');
    
    // Optimistic UI update
    setMessages([...messages, { sender: user._id, receiver: activeUser._id, text: msgText, createdAt: new Date() }]);
    scrollToBottom();

    try {
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/messages', { receiverId: activeUser._id, text: msgText }, config);
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 pt-24 min-h-[calc(100vh-4rem)] flex gap-6">
      {/* Users List */}
      <div className="w-1/3 bg-white dark:bg-zinc-900 rounded-3xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800 hidden md:block">
        <h2 className="text-xl font-bold mb-4 px-2 text-zinc-900 dark:text-white">Inbox</h2>
        <div className="space-y-1">
          {users.length === 0 ? (
            <p className="text-zinc-500 p-2 text-sm">No other users found to message.</p>
          ) : (
            users.map(u => (
              <button 
                key={u._id}
                onClick={() => setActiveUser(u)}
                className={`w-full text-left p-3 rounded-2xl transition-colors ${activeUser?._id === u._id ? 'bg-[#e60023]/10 text-[#e60023] font-semibold' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'}`}
              >
                {u.email.split('@')[0]}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col overflow-hidden h-[calc(100vh-10rem)]">
        {activeUser ? (
          <>
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-bold text-lg text-zinc-900 dark:text-white">
                {activeUser.email.split('@')[0]}
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-zinc-500 mt-10">Start the conversation!</div>
              )}
              {messages.map((msg, i) => {
                const isMe = msg.sender === user._id;
                return (
                  <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${isMe ? 'bg-[#e60023] text-white rounded-br-sm' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-bl-sm'}`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-none rounded-full px-6 py-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-[#e60023]"
              />
              <button 
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-[#e60023] hover:bg-[#ad081b] text-white px-6 py-3 rounded-full font-semibold transition-colors disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-zinc-500 flex-col gap-4">
            <span className="text-6xl">💬</span>
            <p>Select a user to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
