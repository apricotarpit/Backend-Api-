import { Router } from 'express';
import {requireAuth}  from '../middlewares/authmiddleware.ts';
import { createTodo, listTodos, updateTodo, deleteTodo } from '../controllers/todocontroller.ts';
import { createTodoRequest, updateTodoRequest } from '../schemas/zodschemas.ts';
import { validate } from '../middlewares/validate.ts';


const router:Router = Router();


router.use(requireAuth);
router.post('/create', validate(createTodoRequest), createTodo);
router.get('/list', listTodos);
router.put('/:id', validate(updateTodoRequest), updateTodo);
router.delete('/:id', deleteTodo);


export default router;