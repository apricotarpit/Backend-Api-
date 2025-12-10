import {Router} from "express";
import { login ,logout,register} from "../controllers/auth.ts";
import { loginRequest } from '../schemas/zodschemas.ts';
import { validate } from '../middlewares/validate.ts';


const authrouter:Router=Router();

authrouter.post("/login",login);
authrouter.post("/register",register);
authrouter.post('/logout', logout);

export default authrouter;