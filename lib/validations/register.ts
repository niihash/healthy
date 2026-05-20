import z from "zod";

export const registerSchema = z.object({
    email: z.email().trim().toLowerCase(),
    password: z.string().min(8, "Senha deve ter ao menos 8 caracteres").max(60),
    passwordConfirmation: z.string(),
}).refine(
    (data) => data.password === data.passwordConfirmation,
    {
        message: "Senhas diferentes",
        path: ["passwordConfirmation"],
    }
)
