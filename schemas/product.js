import z from 'zod'


const productSchema = z.object({
    name: z.string(({
        invalid_type_error:'name must be a string'
    })),
    description: z.string().min(50),
    color: z.string().max(13),
    categoryId: z.number().int().positive(),
    price: z.number().int().min(0),
    stock: z.number().int().min(0),
    img_link: z.string().url({
        message:'is not valid url'
    })
})

export const validateProduct = (object) => {
    return productSchema.safeParse(object)
}

export const validatePartialProduct = (object) => {
    return productSchema.partial().safeParse(object)
}