import { notFound, redirect } from "next/navigation";
import { AuthForm } from "@/features/auth/auth-form";
import { AuthShell } from "@/features/auth/auth-shell";
import { getViewerAccess } from "@/server/auth/roles";
import { hasSupabaseEnvironment } from "@/lib/supabase/config";
import { isLocale } from "@/lib/i18n";
import { signOutAction } from "@/features/auth/actions";
import { createClient } from "@/lib/supabase/server";
import { hasRequiredRole, type AppRole } from "@/server/auth/policy";
export default async function Account({params}: {params:Promise<{locale:string}>}) {
  const {locale}=await params;
  if (!isLocale(locale)) notFound();
  const ar=locale==='ar';
  const viewer=await getViewerAccess();
  if(viewer.canAccessAdmin) redirect(`/${locale}/admin`);
  if (viewer.isAuthenticated) {
    const client = await createClient();
    const { data } = await client.auth.getClaims();
    const id = data?.claims?.sub;
    if (id) {
      const result = await client.from("user_roles").select("role").eq("user_id", id);
      if (!result.error && hasRequiredRole(result.data.map(row => row.role as AppRole), ["support", "warehouse", "content_editor", "product_manager", "analyst"])) redirect(`/${locale}/admin/commercial`);
    }
  }
  return <AuthShell eyebrow="KOVA / ADMIN" title={ar?'إدارة المتجر':'Store administration'} body={ar?'سجل الدخول بحساب فريقك للوصول إلى أدوات المتجر.':'Sign in with your staff account to access store operations.'}>
    {!hasSupabaseEnvironment() ? <p role="status">{ar?'خدمة الدخول غير متاحة حالياً.':'Sign-in is unavailable until this deployment is configured.'}</p> : viewer.isAuthenticated ? <div><p role="alert">{ar?'هذا الحساب ليس لديه صلاحية الإدارة.':'This account does not have administration access.'}</p><form action={signOutAction}><input type="hidden" name="locale" value={locale}/><button className="kova-button mt-6" type="submit">{ar?'تسجيل الخروج':'Sign out'}</button></form></div> : <AuthForm mode="sign-in" locale={locale} staff/>}
  </AuthShell>;
}
