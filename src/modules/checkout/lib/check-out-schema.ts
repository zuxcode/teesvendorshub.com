import z from "zod";

export const checkOutSchema = z.object({
  addressLine1: z.string().trim().min(1, "Street address is required"),

  addressLine2: z.string().trim().optional(),

  city: z.string().trim().min(1, "City is required"),

  country: z.literal("NIG"),

  deliveryInstructions: z.string().trim().optional(),

  email: z
    .email("Enter a valid email address")
    .trim()
    .min(1, "Email address is required"),

  fullName: z.string().trim().min(1, "First name is required"),

  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(/^\+234\d{10}$/, "Enter a valid Nigerian phone number"),

  postalCode: z.string().trim().optional(),

  state: z.string().min(1, "State is required"),
});

export const createCheckoutSchema = checkOutSchema.extend({
  items: z
    .array(
      z.object({
        productId: z.union([z.string(), z.number()]),
        quantity: z.number().int().positive(),
      }),
      { error: "Cart is empty" }
    )
    .min(1),
});

export type CheckOutSchemaValues = z.infer<typeof checkOutSchema>;
