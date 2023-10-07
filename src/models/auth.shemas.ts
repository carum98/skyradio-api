import { z } from 'zod'

export const AuthLoginSchema = z.object({
    user_name: z.string(),
    password: z.string().min(6)
})
