import express from 'express';
import cors from 'cors';
import { AuthController } from './auth/auth.controller';
import { authenticateToken } from './middleware/auth.middleware';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is protected', userId: (req as any).userId });
  });

app.post('/auth/register', AuthController.register);
app.post('/auth/login', AuthController.login);

const PORT = 3001;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
