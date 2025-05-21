import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../middleware/auth.middleware';

export class AuthController {
static async register(req: Request, res: Response): Promise<void> {
  try {
    const { username, password, avatar } = req.body;
    const user = await AuthService.register(username, password, avatar);
    res.status(201).json(user);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      const result = await AuthService.login(username, password);
      res.json(result);
    } catch (e: any) {
      res.status(401).json({ error: e.message });
    }
  }

  static async me(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = await AuthService.getUserById(req.userId!);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ id: user.id, username: user.username, avatar: user.avatar });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
}
