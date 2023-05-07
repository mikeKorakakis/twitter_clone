import * as z from "zod"

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3).max(100),
})

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(3).max(100),
    firstName: z.string().min(3).max(100),
    lastName: z.string().min(3).max(100),
    displayName: z.string().min(3).max(100)
  })
  
