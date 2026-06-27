import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/api.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api', apiRoutes);


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Server is healthy' });
});


app.use(express.static(path.join(__dirname, '../../client/dist')));


app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', message: 'Something went wrong!' });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
