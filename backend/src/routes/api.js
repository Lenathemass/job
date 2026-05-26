import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { getBoards, createBoard, savePin } from '../controllers/boardController.js';
import { getMessages, sendMessage, getUsers } from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected Routes
router.get('/profile', protect, (req, res) => {
  res.json({ message: 'This is protected data', user: req.user });
});

// Boards
router.route('/boards').get(protect, getBoards).post(protect, createBoard);
router.route('/boards/:boardId/pins').post(protect, savePin);

// Messages
router.route('/users').get(protect, getUsers);
router.route('/messages/:userId').get(protect, getMessages);
router.route('/messages').post(protect, sendMessage);

export default router;
