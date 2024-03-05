import { Router } from "express";
import { AuthController } from "../controller/auth.js"

export const authRouter = Router()

authRouter.post('/signup',AuthController.signup)
authRouter.post('/login',AuthController.login)
authRouter.get('/:email',AuthController.getByEmail)