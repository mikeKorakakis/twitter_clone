import * as z from "zod";

export const profileSchema = z.object({
	displayName: z.string().min(3, "Display name must be at least 3 characters").max(32, "Display name must be at most 32 characters"),
	firstName: z.string().min(3, "First name must be at least 3 characters").max(100, "First name must be at most 100 characters"),
	lastName: z.string().min(3, "Last name must be at least 3 characters").max(100, "Last name must be at most 100 characters"),
    email: z.string().email().optional()
});
