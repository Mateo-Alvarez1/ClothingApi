import z from 'zod'

const authSchema = z.object({
    name: z.string({
      invalid_type_error: 'Name must be String'
    }),
    lastname: z.string({
      invalid_type_error: 'Lastname must be String'
    }),
    email: z.string().email(),
    password: z.string().min(5)
  })
  
  export const validateUserdata = (object) => {
    return authSchema.safeParse(object)
  }
  
  export const validatePartialUserdata = (object) => {
    return authSchema.partial().safeParse(object)
  }