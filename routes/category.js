import { Router } from "express";
import { CategoryController } from "../controller/category.js";

export const categoryRouter = Router()

categoryRouter.post('/', CategoryController.create)
categoryRouter.get('/getAll', CategoryController.getAll)
categoryRouter.get('/:id', CategoryController.getById)
categoryRouter.delete('/:id', CategoryController.delete)
categoryRouter.patch('/:id', CategoryController.update)