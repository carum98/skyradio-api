import { z } from 'zod'

// Request schemas
export const AuthLoginSchema = z.object({
    user_name: z.string(),
    password: z.string().min(6)
})

export const AuthRegisterSchema = z.object({
    name: z.string(),
    user_name: z.string(),
    password: z.string().min(6)
})

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
