import { z } from 'zod'

const rolesEnum = z.enum(['admin', 'user'])

export const UserSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
    role: rolesEnum,
    password: z.string(),
    created_at: z.date(),
    updated_at: z.date()
}).required()

export type UserSchemaType = z.infer<typeof UserSchema>

export const UserSchemaResponse = UserSchema.omit({
    password: true
})

export type UserSchemaResponseType = z.infer<typeof UserSchemaResponse>
