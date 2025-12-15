import { Router } from "express";
import authRoutes from "./auth.ts";
import todosRoutes from './todo.ts';

const rootRouter: Router = Router();

rootRouter.use('/auth',authRoutes);
rootRouter.use('/todos', todosRoutes);


export default rootRouter; 

rootRouter.listen(3000, () => {
  console.log('Server is running on port 3000');
}   );