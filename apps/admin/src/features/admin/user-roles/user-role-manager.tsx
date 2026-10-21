"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { ShieldCheck, UserRound, X } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { changeUserRoleAction } from "./actions";
import {
  roleLabels,
  staffRoles,
  type DirectoryUser,
  type RoleActionState,
  type StaffRole,
} from "./model";

const initialState: RoleActionState = { status: "idle", message: "" };

export function UserRoleManager({
  users,
  viewerId,
  locale,
}: {
  users: DirectoryUser[];
  viewerId: string;
  locale: Locale;
}) {
  const ar = locale === "ar";
  const [selected, setSelected] = useState<DirectoryUser | null>(null);
  const [role, setRole] = useState<StaffRole>("support");
  const [state, action, pending] = useActionState(
    changeUserRoleAction,
    initialState,
  );
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const feedback = useRef<HTMLParagraphElement>(null);
  const grant = !selected?.roles.includes(role);
  const blocked =
    (role === "super_admin" && selected?.id === viewerId && !grant) ||
    (grant && selected?.verified === false);

  useEffect(() => {
    const el = dialog.current;
    if (selected && !el?.open) el?.showModal();
    if (!selected && el?.open) el.close();
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [selected]);
  useEffect(() => {
    if (state.status === "success") {
      dialog.current?.close();
    }
    if (state.status === "error") feedback.current?.focus();
  }, [state]);

  function close() {
    if (!pending) {
      setSelected(null);
      trigger.current?.focus();
    }
  }

  return (
    <>
      {state.status === "success" && (
        <p
          role="status"
          className="mb-5 border border-[var(--status-success)] bg-white p-4 text-sm text-[var(--status-success)]"
        >
          {state.message}
        </p>
      )}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {users.map((user) => (
          <article
            key={user.id}
            className="flex min-w-0 flex-col border border-[var(--border-subtle)] bg-white p-5 md:p-6"
          >
            <div className="flex items-start gap-3">
              <span className="grid size-11 shrink-0 place-items-center bg-[var(--brand-surface)] text-[var(--brand-700)]">
                <UserRound size={20} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h2 className="break-words font-semibold">
                  {user.fullName || (ar ? "مستخدم كوفا" : "KOVA customer")}
                </h2>
                <p className="mt-1 break-all text-sm text-[var(--text-muted)]">
                  <bdi>
                    {user.email ||
                      (ar ? "بدون بريد إلكتروني" : "No email address")}
                  </bdi>
                </p>
              </div>
            </div>
            <div
              className="mt-4 flex flex-wrap gap-2"
              aria-label={ar ? "الصلاحيات الحالية" : "Current roles"}
            >
              {user.roles.map((r) => (
                <span
                  key={r}
                  className={`border px-2.5 py-1 text-xs ${r === "super_admin" ? "border-[var(--brand-700)] bg-[var(--brand-100)] text-[var(--brand-950)]" : "border-[var(--border-subtle)] text-[var(--text-muted)]"}`}
                >
                  {roleLabels[r][locale]}
                </span>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-4">
              <p className="text-xs text-[var(--text-muted)]">
                {user.id === viewerId
                  ? ar
                    ? "حسابك"
                    : "Your account"
                  : user.verified
                    ? ar
                      ? "البريد مؤكد"
                      : "Email verified"
                    : ar
                      ? "البريد غير مؤكد"
                      : "Email unverified"}
              </p>
              <button
                type="button"
                className="inline-flex min-h-11 items-center gap-2 px-2 text-sm font-semibold text-[var(--brand-700)] underline underline-offset-4 hover:text-[var(--brand-950)]"
                onClick={(event) => {
                  trigger.current = event.currentTarget;
                  setRole("support");
                  setSelected(user);
                }}
              >
                <ShieldCheck size={16} aria-hidden="true" />
                {ar ? "إدارة الصلاحيات" : "Manage roles"}
                <span className="sr-only">: {user.email}</span>
              </button>
            </div>
          </article>
        ))}
      </div>
      <dialog
        ref={dialog}
        aria-labelledby="role-dialog-title"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClose={() => {
          setSelected(null);
          trigger.current?.focus();
        }}
        className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-lg overflow-y-auto border border-[var(--border-subtle)] bg-white p-0 text-[var(--text-strong)] shadow-xl backdrop:bg-[var(--brand-950)]/65"
      >
        <div className="flex items-center justify-between gap-4 border-b border-[var(--border-subtle)] px-6 py-5">
          <h2 id="role-dialog-title" className="font-serif text-2xl">
            {ar ? "إدارة صلاحيات المستخدم" : "Manage user roles"}
          </h2>
          <button
            type="button"
            disabled={pending}
            onClick={close}
            aria-label={ar ? "إغلاق" : "Close"}
            className="grid size-11 shrink-0 place-items-center"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        {selected && (
          <form action={action} className="grid gap-5 p-6" key={selected.id}>
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="userId" value={selected.id} />
            <input
              type="hidden"
              name="operation"
              value={grant ? "grant" : "revoke"}
            />
            <div>
              <p className="font-semibold">{selected.fullName}</p>
              <p className="break-all text-sm text-[var(--text-muted)]">
                <bdi>{selected.email}</bdi>
              </p>
            </div>
            <div>
              <label
                htmlFor="staff-role"
                className="mb-2 block text-sm font-semibold"
              >
                {ar ? "الصلاحية" : "Role"}
              </label>
              <select
                id="staff-role"
                name="role"
                value={role}
                disabled={pending}
                onChange={(event) => setRole(event.target.value as StaffRole)}
                className="w-full border bg-white px-3 py-3"
              >
                {staffRoles.map((r) => (
                  <option key={r} value={r}>
                    {roleLabels[r][locale]} ·{" "}
                    {selected.roles.includes(r)
                      ? ar
                        ? "ممنوحة"
                        : "Granted"
                      : ar
                        ? "غير ممنوحة"
                        : "Not granted"}
                  </option>
                ))}
              </select>
            </div>
            <p
              className={`border-s-2 p-4 text-sm ${grant ? "border-[var(--brand-700)] bg-[var(--brand-surface)]" : "border-[var(--status-danger)] bg-[var(--surface-canvas)]"}`}
            >
              {ar
                ? `${grant ? "ستمنح" : "ستزيل"} صلاحية ${roleLabels[role].ar} ${grant ? "لهذا المستخدم" : "من هذا المستخدم"}.`
                : `${grant ? "Grant" : "Revoke"} ${roleLabels[role].en} ${grant ? "access for" : "access from"} this user.`}
              {role === "super_admin" && (
                <span className="mt-2 block">
                  {ar
                    ? "المدير العام يستطيع منح وإزالة صلاحيات جميع المستخدمين."
                    : "Super admins can grant and revoke roles for all users."}
                </span>
              )}
            </p>
            {blocked ? (
              <p className="text-sm text-[var(--status-danger)]">
                {!selected.verified
                  ? ar
                    ? "يجب تأكيد البريد الإلكتروني أولاً."
                    : "The email must be verified first."
                  : ar
                    ? "يجب أن يزيل مدير عام آخر صلاحيتك."
                    : "Another super admin must remove your super admin role."}
              </p>
            ) : (
              <label className="flex min-h-11 items-start gap-3 text-sm">
                <input
                  key={role}
                  type="checkbox"
                  name="confirmed"
                  required
                  disabled={pending}
                  className="mt-1 size-5 shrink-0 accent-[var(--brand-700)]"
                />
                {ar
                  ? "أؤكد أنني أريد تطبيق هذا التغيير."
                  : "I confirm that I want to apply this change."}
              </label>
            )}
            <p className="text-xs text-[var(--text-muted)]">
              {ar
                ? "صلاحية العميل أساسية. تُسجل تغييرات الصلاحيات، وتُطبق على الطلبات التالية."
                : "Customer access is automatic. Role changes are recorded and apply to subsequent requests."}
            </p>
            {state.status === "error" && (
              <p
                ref={feedback}
                tabIndex={-1}
                role="alert"
                className="text-sm text-[var(--status-danger)]"
              >
                {state.message}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={pending || blocked}
                className={`min-h-12 flex-1 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50 ${grant ? "bg-[var(--brand-950)] hover:bg-[var(--brand-800)]" : "bg-[var(--status-danger)] hover:opacity-90"}`}
              >
                {pending
                  ? ar
                    ? "جارٍ الحفظ…"
                    : "Saving…"
                  : grant
                    ? ar
                      ? "تأكيد المنح"
                      : "Confirm grant"
                    : ar
                      ? "تأكيد الإزالة"
                      : "Confirm revoke"}
              </button>
              <button
                type="button"
                onClick={close}
                disabled={pending}
                className="min-h-12 border border-[var(--border-control)] px-5 py-3 text-sm"
              >
                {ar ? "إلغاء" : "Cancel"}
              </button>
            </div>
          </form>
        )}
      </dialog>
    </>
  );
}
