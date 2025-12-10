import type { Request, Response } from 'express';
import { prismaClient } from '../index.ts';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {blacklistToken} from '../middlewares/authmiddleware.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = '1h';


export const register = async (req: Request, res: Response) => {
  const { email, password,} = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  const exists = await prismaClient.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: 'email already in use' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await prismaClient.user.create({
    data: { email, password: hashed},
  });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  res.status(201).json({ user: { id: user.id, email: user.email }, token });
};


export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
      console.log("create todo");
    const user = await prismaClient.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });


    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });


    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return res.json({ accessToken: token, tokenType: 'Bearer', expiresIn: JWT_EXPIRES_IN });
};

export const logout = async (req: Request, res: Response) => {
    const auth = req.headers.authorization;
    if (!auth) return res.status(400).json({ message: 'Missing authorization header' });
    const parts = auth.split(' ');
    if (parts.length !== 2) return res.status(400).json({ message: 'Invalid authorization format' });
    const token = parts[1];
    if (!token) return res.status(400).json({ message: 'Missing token' });
    blacklistToken(token);
    return res.json({ message: 'Logged out' });
};