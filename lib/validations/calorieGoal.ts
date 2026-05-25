import z from "zod";

export const calorieGoalSchema = z.object({
    dailyCalories: z.number().positive(),
});
