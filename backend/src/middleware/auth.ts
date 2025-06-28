import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

export default async function (req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const token = req.header('x-auth-token');

  if (!token) {
    res.status(401).json({ message: 'No token, authorization denied' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { user: { id: string } };
    // Fetch user from DB to get email
    const user = await User.findById(decoded.user.id).select('id email');
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }
    req.user = { id: user.id, email: user.email };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}