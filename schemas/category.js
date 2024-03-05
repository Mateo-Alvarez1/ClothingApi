import z from 'zod'

const categorySchema = z.object({
    name: z.string(({
        invalid_type_error:'name must be a string'
    })),})

export const validateCategory = (object) => {
    return categorySchema.safeParse(object)
}

export const validatePartialCategory = (object) => {
    return categorySchema.partial().safeParse(object)
}