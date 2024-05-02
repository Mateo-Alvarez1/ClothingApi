import express, { json } from 'express'
import { corsMiddleware } from './middlewares/cors.js'
import { productRouter } from './routes/product.js'
import { categoryRouter } from './routes/category.js'
import { authRouter } from './routes/auth.js'

const PORT = process.env.PORT ?? 3000
const app = express()
app.use(corsMiddleware())
app.use(json())
app.disable('x-powered-by')

app.use('/product', productRouter)
app.use('/category' , categoryRouter)
app.use('/auth' , authRouter)

app.listen(PORT, () => {
    console.log(`Server listen in port: http://localhost:${PORT}`);
})

