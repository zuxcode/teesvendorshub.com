import z from "zod";

const checkoutBaseSchema = z.object({
  email: z.email("Enter a valid email address").trim(),
});

export const cartItemsSchema = z
  .array(
    z.object({
      productId: z.union([z.string(), z.number()]),
      quantity: z.number().int().positive(),
    }),
    { error: "Cart is empty" }
  )
  .min(1);

export const checkoutDigitalSchema = checkoutBaseSchema.extend({
  // Digital products only require an email address.
});

export const checkoutPhysicalSchema = checkoutBaseSchema.extend({
  addressLine1: z.string().trim().min(1, "Street address is required"),

  addressLine2: z.string().trim().optional(),

  city: z.string().trim().min(1, "City is required"),

  country: z.string().min(1, "Country is required"),

  deliveryInstructions: z.string().trim().optional(),

  fullName: z.string().trim().min(1, "Full name is required"),

  phone: z
    .string()
    .trim()
    .regex(/^\+234\d{10}$/, "Enter a valid Nigerian phone number"),

  postalCode: z.string().trim().optional(),

  state: z.string().trim().min(1, "State is required"),
});

export const createDigitalCheckoutSchema = checkoutDigitalSchema.extend({
  items: cartItemsSchema,
});

export const createPhysicalCheckoutSchema = checkoutPhysicalSchema.extend({
  items: cartItemsSchema,
});

export function getCheckoutSchema(cartHasPhysicalProduct: boolean) {
  return cartHasPhysicalProduct
    ? checkoutPhysicalSchema
    : checkoutDigitalSchema;
}

export type CheckoutDigitalSchemaValues = z.infer<typeof checkoutDigitalSchema>;

export type CheckoutPhysicalSchemaValues = z.infer<
  typeof checkoutPhysicalSchema
>;

export type CreateDigitalCheckoutSchemaValues = z.infer<
  typeof createDigitalCheckoutSchema
>;

export type CreatePhysicalCheckoutSchemaValues = z.infer<
  typeof createPhysicalCheckoutSchema
>;
