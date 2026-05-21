import z from "zod";

export const createMealSchema = z.object({
    description: z.string().trim().min(2),
    calories: z.number().positive(),
    mealType: z.enum([
        "BREAKFAST",
        "LUNCH",
        "SNACK",
        "DINNER",
        "SUPPER",
    ]),
    consumedAt: z.coerce.date(),
});
