"use server";

import { revalidatePath } from "next/cache";
import { requireRoles } from "@/server/auth/roles";
import { roleChangeSchema, roleError, type RoleActionState } from "./model";

export async function changeUserRoleAction(
  _state: RoleActionState,
  form: FormData,
): Promise<RoleActionState> {
  const locale = form.get("locale") === "ar" ? "ar" : "en";
  // Every invocation verifies current database roles, independently of the UI.
  const { supabase } = await requireRoles(["super_admin"]);
  const parsed = roleChangeSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success)
    return {
      status: "error",
      message:
        locale === "ar"
          ? "اختر صلاحية صحيحة وأكد التغيير."
          : "Choose a valid role and confirm the change.",
    };
  const { userId, role, operation } = parsed.data;
  const { error } = await supabase.rpc("super_admin_change_role", {
    p_user_id: userId,
    p_role: role,
    p_enabled: operation === "grant",
  });
  if (error)
    return { status: "error", message: roleError(error.message, locale) };
  revalidatePath("/ar/admin", "layout");
  revalidatePath("/en/admin", "layout");
  return {
    status: "success",
    message:
      locale === "ar" ? "تم تحديث صلاحيات المستخدم." : "User roles updated.",
  };
}
