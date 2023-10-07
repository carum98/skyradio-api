import { z } from 'zod'

// Request schemas
export const AuthLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

export const AuthRegisterSchema = AuthLoginSchema.merge(z.object({
    name: z.string()
}))

export type AuthLoginSchemaType = z.infer<typeof AuthLoginSchema>
export type AuthRegisterSchemaType = z.infer<typeof AuthRegisterSchema>

// Response schemas
export const AuthLoginResponseSchema = z.object({
    token: z.string()
})

export const AuthRegisterResponseSchema = z.object({
    id: z.number(),
    name: z.string(),
    user_name: z.string(),
    password: z.string()
})

export type AuthLoginResponseSchemaType = z.infer<typeof AuthLoginResponseSchema>
export type AuthRegisterResponseSchemaType = z.infer<typeof AuthRegisterResponseSchema>
