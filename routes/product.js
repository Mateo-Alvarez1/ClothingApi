import { Router } from "express";
import { ProductController } from '../controller/product.js'

export const productRouter = Router()

productRouter.post('/', ProductController.create)
productRouter.get('/getAll',ProductController.getAll)
productRouter.get('/:id' , ProductController.getById)
productRouter.delete('/:id',ProductController.delete)
productRouter.patch('/:id',ProductController.update)