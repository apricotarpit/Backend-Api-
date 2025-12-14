import {Router} from "express";
import { login ,logout,register} from "../controllers/auth.ts";
import { loginRequest } from '../schemas/zodschemas.ts';
import { validate } from '../middlewares/validate.ts';


const authrouter:Router=Router();
authrouter.post("/login",validate(loginRequest),login);
authrouter.post("/register",validate(registerRequest),register);
authrouter.post('/logout',validate(logoutRequest), logout);


export default authrouter;
