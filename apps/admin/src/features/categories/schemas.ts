import { z } from "zod";

export const categorySlugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const categoryFormSchema = z.object({
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, "Slug must be at least 2 characters")
    .max(50, "Slug must be at most 50 characters")
    .regex(
      categorySlugRegex,
      "Slug must contain only lowercase letters, numbers, and hyphens (e.g. scrub-sets)",
    ),
  name_en: z
    .string()
    .trim()
    .min(2, "English name is required (minimum 2 characters)")
    .max(100, "English name must be at most 100 characters"),
  name_ar: z
    .string()
    .trim()
    .min(2, "Arabic name is required (minimum 2 characters)")
    .max(100, "Arabic name must be at most 100 characters"),
  description_en: z
    .string()
    .trim()
    .max(500, "Description must be at most 500 characters")
    .optional()
    .or(z.literal("")),
  description_ar: z
    .string()
    .trim()
    .max(500, "Description must be at most 500 characters")
    .optional()
    .or(z.literal("")),
  position: z.coerce
    .number()
    .int("Position must be an integer")
    .min(0, "Position cannot be negative")
    .default(0),
  is_active: z
    .union([z.boolean(), z.string()])
    .transform((val) => val === true || val === "true" || val === "on"),
});

export const updateCategorySchema = categoryFormSchema.extend({
  id: z.coerce.number().int().positive("Invalid category ID"),
});

export const deleteCategorySchema = z.object({
  id: z.coerce.number().int().positive("Invalid category ID"),
});
