import Board from '../models/Board.js';

export const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ user: req.user._id }).sort('-createdAt');
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBoard = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Board name is required' });

    const board = await Board.create({ name, user: req.user._id, pins: [] });
    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const savePin = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { url, alt, height } = req.body;

    const board = await Board.findOne({ _id: boardId, user: req.user._id });
    if (!board) return res.status(404).json({ message: 'Board not found' });

    // Ensure no duplicate URL is saved in the same board
    if (!board.pins.some((pin) => pin.url === url)) {
      board.pins.push({ url, alt, height });
      await board.save();
    }
    
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
