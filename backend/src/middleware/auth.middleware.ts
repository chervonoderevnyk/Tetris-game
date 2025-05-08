import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'tetris_secret';

export interface AuthRequest extends Request {
  userId?: number;
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers['authorization'];
    console.log('Authorization Header:', authHeader);
  
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      console.log('No token provided');
      res.sendStatus(401);
      return;
    }
  
    jwt.verify(token, SECRET, (err, payload: any) => {
      if (err) {
        console.log('Token error:', err.message);
        res.sendStatus(403);
        return;
      }
  
      req.userId = payload.userId;
      next();
    });
  }  
