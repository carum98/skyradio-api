import { z } from 'zod'

export const HexColorSchema = z.string().refine(value => /^#([0-9A-F]{3}){1,2}$/i.test(value), {
    message: 'Invalid hexadecimal color'
})
