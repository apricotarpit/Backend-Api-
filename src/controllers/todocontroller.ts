import type { Request, Response } from 'express';
import { prismaClient } from '../index.ts';
import type {AuthRequest}  from '../middlewares/authmiddleware.ts';



export const createTodo = async (req: AuthRequest, res: Response) => {
    console.log("BODY RECEIVED:", req.body);

    const { title } = req.body;
     if (!title || typeof title !== "string") {
        return res.status(400).json({
            error: "title is required and must be a string"
        });
    }
    const todo = await prismaClient.todo.create({ 
        data:{ 
        title:req.body.title,
        userId: req.user.id 
        } 
    });
    return res.status(201).json(todo);
};

export const listTodos = async (req: AuthRequest, res: Response) => {

    console.log('query',req.query);
    

  const titleQuery = typeof req.query.title !== 'undefined' ? String(req.query.title).trim() : undefined;
  const completedQuery = typeof req.query.completed !== 'undefined' ? String(req.query.completed).trim().toLowerCase() : undefined;

  const where: any = { userId: req.user.id };

  const sortQueryRaw = typeof req.query.sortBy !== 'undefined' ? String(req.query.sortBy) : 'createdAt';
  const sortQuery = sortQueryRaw.trim();

  const sortOrderRaw = typeof req.query.sortOrder !== 'undefined' ? String(req.query.sortOrder) : 'desc';
  const sortOrder = sortOrderRaw.toLowerCase() === 'asc' ? 'asc' : 'desc';

  const ALLOWED_SORT_FIELDS = ['title', 'createdAt', 'updatedAt', 'completed', 'id'];

  if (!ALLOWED_SORT_FIELDS.includes(sortQuery)) {
    return res.status(400).json({
      error: `Invalid sortBy field. Allowed: ${ALLOWED_SORT_FIELDS.join(', ')}`,
    });
  }

  if (titleQuery) {
    where.title = {
      startsWith: titleQuery,
      mode: 'insensitive',
    };
  }

  if (typeof completedQuery !== 'undefined') {
    if (completedQuery === 'true' || completedQuery === '1') {
      where.completed = true;
    } else if (completedQuery === 'false' || completedQuery === '0') {
      where.completed = false;
    } else {
      return res.status(400).json({ error: 'completed must be true/false or 1/0' });
    }
  }

  const orderBy: any = {};
  orderBy[sortQuery] = sortOrder;

  const todos = await prismaClient.todo.findMany({
    where,
    orderBy,
  });
  return res.json(todos);
};


export const updateTodo = async (req: AuthRequest, res: Response) => {
    const id = Number(req.params.id);
    const payload = req.body;
    const todo = await prismaClient.todo.findUnique({ where: { id } });
    if (!todo || todo.userId !== req.user.id) return res.status(404).json({ message: 'Todo not found' });
    const updated = await prismaClient.todo.update({ where: { id }, data: payload });
    return res.json(updated);
};


export const deleteTodo = async (req: AuthRequest, res: Response) => {
    const id = Number(req.params.id);
    const todo = await prismaClient.todo.findUnique({ where: { id } });
    if (!todo || todo.userId !== req.user.id) return res.status(404).json({ message: 'Todo not found' });
    await prismaClient.todo.delete({ where: { id } });
    return res.json({ message: 'Deleted' });

};
