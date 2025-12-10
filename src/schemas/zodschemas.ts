import { z } from 'zod';


// Auth
export const loginRequest = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
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
    title: z.string().min(1),
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