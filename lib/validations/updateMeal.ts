import z from "zod";

export const updateMealSchema = z.object({
    description: z.string().trim().min(2).optional(),
    calories: z.number().positive().optional(),
    mealType: z.enum([
        "BREAKFAST",
        "LUNCH",
        "SNACK",
        "DINNER",
        "SUPPER",
    ]).optional(),
    consumedAt: z.coerce.date().optional(),
});
