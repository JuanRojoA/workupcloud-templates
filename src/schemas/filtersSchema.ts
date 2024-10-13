import { z } from "zod";

export const filtersSchema = z.object({
	name: z.string().optional(),
	email: z.string().email("Invalid email address").optional(),
	status: z.union([z.string(), z.array(z.string())]).optional(),
	createdAfter: z
		.date({
			required_error: "Please select a valid date",
			invalid_type_error: "Invalid date",
		})
		.optional(),
	favoriteColor: z.string().optional(),
	description: z.string().optional(),
	isVerified: z.array(z.string()).optional(),
	gender: z.string().optional(),
});
