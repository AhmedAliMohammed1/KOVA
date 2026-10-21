"use server";

import { revalidatePath } from "@/lib/revalidate-storefront";
import { requireRoles } from "@/server/auth/roles";
import type { ReviewActionState } from "@/features/reviews/types";
import {
  formatReviewError,
  reviewModerationSchema,
} from "@/features/reviews/validation";

const initialError = (
  locale: "en" | "ar",
  fieldErrors: Record<string, string[]>,
) => ({
  status: "error" as const,
  message:
    locale === "ar"
      ? "راجع الحقول المحددة وأكمل البيانات المطلوبة."
      : "Check the highlighted fields and complete the required details.",
  fieldErrors,
});

export async function moderateReviewAction(
  _state: ReviewActionState,
  formData: FormData,
): Promise<ReviewActionState> {
  const locale = formData.get("locale") === "ar" ? "ar" : "en";
  const parsed = reviewModerationSchema.safeParse({
    locale: formData.get("locale"),
    reviewId: formData.get("reviewId"),
    status: formData.get("status"),
    isFeatured: formData.get("isFeatured"),
    adminResponse: formData.get("adminResponse") ?? "",
    moderationNote: formData.get("moderationNote") ?? "",
  });
  if (!parsed.success)
    return initialError(locale, parsed.error.flatten().fieldErrors);

  const { supabase } = await requireRoles(["content_editor", "product_manager", "admin", "super_admin"]);
  const { error } = await supabase.rpc("admin_moderate_product_review", {
    p_review_id: parsed.data.reviewId,
    p_status: parsed.data.status,
    p_is_featured: parsed.data.status === "approved" && parsed.data.isFeatured,
    p_admin_response: parsed.data.adminResponse,
    p_moderation_note: parsed.data.moderationNote,
  });
  if (error)
    return {
      status: "error",
      message: formatReviewError(error.message, locale),
    };

  revalidatePath(`/${parsed.data.locale}/admin/reviews`);
  revalidatePath(`/${parsed.data.locale}/products`, "layout");
  return {
    status: "success",
    message: locale === "ar" ? "تم تحديث التقييم." : "Review updated.",
  };
}
