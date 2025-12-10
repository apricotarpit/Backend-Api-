import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prismaClient } from '../index.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const tokenBlacklist = new Set<string>();
export const blacklistToken = (token: string) => tokenBlacklist.add(token);
export const isTokenBlacklisted = (token: string) => tokenBlacklist.has(token);


export type AuthRequest = Request & {
user?: any;
};

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: 'Missing authorization header' });


    const parts = auth.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Invalid authorization format' });


    const token = parts[1];
    if (!token) return res.status(401).json({ message: 'Missing token' });
    if (isTokenBlacklisted(token)) return res.status(401).json({ message: 'Token is logged out' });


    const payload: any = jwt.verify(token, JWT_SECRET);
    const user = await prismaClient.user.findUnique({ where: { id: payload.userId } });
    if (!user) return res.status(401).json({ message: 'User not found' });


    req.user = { id: user.id, email: user.email };
    next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};