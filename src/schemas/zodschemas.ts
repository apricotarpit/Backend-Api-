import { z } from 'zod';


// Auth
export const loginRequest = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});


export const registerRequest = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});


export const logoutRequest = z.object({
  headers: z.object({
    authorization: z.string().regex(/^Bearer \S+$/, 'Invalid authorization header format'),
  }),
});


export const loginResponse = z.object({
accessToken: z.string(),
tokenType: z.literal('Bearer'),
expiresIn: z.string(),
});


// Todo
export const createTodoRequest = z.object({
  body: z.object({
    title: z.string().min(6),
  }),
});


export const todoResponse = z.object({
id: z.number(),
title: z.string(),
completed: z.boolean(),
userId: z.number(),
createdAt: z.string(),
updatedAt: z.string(),
});


export const listTodosResponse = z.array(todoResponse);


export const updateTodoRequest = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    completed: z.boolean().optional(),
  }),
});


export const listTodosQuery = z.object({
  query: z.object({
    sortBy: z.enum(['title', 'createdAt', 'updatedAt', 'completed', 'id']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    title: z.string().optional(),
    completed: z.string().optional(),
  }),
});


export const deleteTodoParams = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a valid number'),
  }),
});
