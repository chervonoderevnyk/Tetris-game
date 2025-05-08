import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db';

const SECRET = process.env.JWT_SECRET || 'tetris_secret';

export class AuthService {
  static async register(username: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) throw new Error('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, password: hashedPassword },
    });

    return { id: user.id, username: user.username };
  }

  static async login(username: string, password: string) {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) throw new Error('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');

    const tokenA = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1h' });
    return { tokenA };
  }
}
