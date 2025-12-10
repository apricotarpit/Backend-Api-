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
    const todos = await prismaClient.todo.findMany({ where: { userId: req.user.id }, orderBy: { createdAt: 'desc' } });
      
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