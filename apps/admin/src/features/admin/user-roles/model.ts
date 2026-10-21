import { z } from "zod";
import type { Locale } from "@/lib/i18n";

export const staffRoles = [
  "support",
  "warehouse",
  "content_editor",
  "product_manager",
  "analyst",
  "admin",
  "super_admin",
] as const;
export type StaffRole = (typeof staffRoles)[number];
export const roleChangeSchema = z.object({
  userId: z.uuid(),
  role: z.enum(staffRoles),
  operation: z.enum(["grant", "revoke"]),
  confirmed: z.literal("on"),
});
export const directorySchema = z.object({
  total: z.number().int().nonnegative(),
  users: z.array(
    z.object({
      id: z.uuid(),
      email: z.string(),
      fullName: z.string(),
      verified: z.boolean(),
      roles: z.array(z.enum(["customer", ...staffRoles])),
    }),
  ),
});
export type DirectoryUser = z.infer<typeof directorySchema>["users"][number];
export type RoleActionState = {
  status: "idle" | "success" | "error";
  message: string;
};
export const roleLabels: Record<string, Record<Locale, string>> = {
  customer: { en: "Customer", ar: "عميل" },
  support: { en: "Customer support", ar: "خدمة العملاء" },
  warehouse: { en: "Warehouse", ar: "المخزن" },
  content_editor: { en: "Content editor", ar: "محرر المحتوى" },
  product_manager: { en: "Product manager", ar: "مدير المنتجات" },
  analyst: { en: "Analyst", ar: "محلل البيانات" },
  admin: { en: "Admin", ar: "مدير" },
  super_admin: { en: "Super admin", ar: "المدير العام" },
};
export function roleError(message: string, locale: Locale) {
  const errors: Record<string, Record<Locale, string>> = {
    super_admin_required: {
      en: "Only a super admin can manage roles. Refresh the page to check your access.",
      ar: "إدارة الصلاحيات متاحة للمدير العام فقط. حدّث الصفحة للتحقق من صلاحياتك.",
    },
    last_super_admin: {
      en: "The last super admin cannot be removed.",
      ar: "لا يمكن إزالة صلاحية آخر مدير عام.",
    },
    cannot_revoke_own_super_admin: {
      en: "Another super admin must remove your super admin role.",
      ar: "يجب أن يزيل مدير عام آخر صلاحية المدير العام الخاصة بك.",
    },
    user_unverified: {
      en: "This user must verify their email before receiving a staff role.",
      ar: "يجب تأكيد البريد الإلكتروني قبل منح صلاحيات الإدارة.",
    },
    user_not_found: {
      en: "This user no longer exists. Refresh the user list.",
      ar: "هذا المستخدم لم يعد موجوداً. حدّث قائمة المستخدمين.",
    },
    role_not_assignable: {
      en: "The customer role is automatic and cannot be changed here.",
      ar: "صلاحية العميل أساسية ولا يمكن تعديلها هنا.",
    },
  };
  return (
    errors[message]?.[locale] ??
    (locale === "ar"
      ? "تعذر تحديث الصلاحية. حاول مرة أخرى."
      : "The role could not be updated. Please try again.")
  );
}
