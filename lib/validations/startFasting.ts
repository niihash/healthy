import z from "zod";

export const startFastingSchema = z.object({
    plannedType: z.enum([
        "FAST_16_8",
        "FAST_18_6",
        "FAST_20_4",
        "FAST_24H",
        "CUSTOM",
    ]),
});
