import type { RequestHandler } from 'express';
import { ZodObject, ZodError } from 'zod';


export const validate = (schema: ZodObject<any>): RequestHandler => (req, res, next) => {
  try {
    const data = {
      body: req.body,
      query: req.query,
      params: req.params,
    };
    schema.parse(data);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: err.issues });
    }
    return res.status(400).json({ error: 'Validation failed' });
  }
};


