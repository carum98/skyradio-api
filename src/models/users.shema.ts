import { z } from 'zod'

export const UserSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    created_at: z.date(),
    updated_at: z.date()
}).required()

export type UserSchemaType = z.infer<typeof UserSchema>

export const UserSchemaResponse = UserSchema.omit({
    password: true
})

export type UserSchemaResponseType = z.infer<typeof UserSchemaResponse>
