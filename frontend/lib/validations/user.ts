import * as z from "zod";

export const userNameSchema = z.object({
	displayName: z.string().min(3).max(32),
	firstName: z.string().min(3).max(100),
	lastName: z.string().min(3).max(100),
});
