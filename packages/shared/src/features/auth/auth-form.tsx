"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import type { Locale } from "@/lib/i18n";
import { hasSupabaseEnvironment } from "@/lib/supabase/config";
import {
  requestPasswordResetAction,
  signInAction,
  signUpAction,
  updatePasswordAction,
} from "./actions";
import type { AuthActionState } from "./actions";

type Mode = "sign-in" | "sign-up" | "forgot-password" | "update-password";

const content = {
  en: {
    fullName: "Full name",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm password",
    signIn: "Sign in",
    signUp: "Create account",
    forgot: "Send recovery link",
    update: "Update password",
    pending: "Please wait…",
    forgotLink: "Forgot your password?",
    newAccount: "New to KOVA Scrubs? Create an account",
    existingAccount: "Already have an account? Sign in",
    backToSignIn: "Back to sign in",
  },
  ar: {
    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    signIn: "تسجيل الدخول",
    signUp: "إنشاء حساب",
    forgot: "إرسال رابط الاستعادة",
    update: "تحديث كلمة المرور",
    pending: "يرجى الانتظار…",
    forgotLink: "نسيت كلمة المرور؟",
    newAccount: "جديد في كوفا سكراب؟ أنشئ حساباً",
    existingAccount: "لديك حساب بالفعل؟ سجل الدخول",
    backToSignIn: "العودة إلى تسجيل الدخول",
  },
} as const;

const actions = {
  "sign-in": signInAction,
  "sign-up": signUpAction,
  "forgot-password": requestPasswordResetAction,
  "update-password": updatePasswordAction,
};

const initialAuthState: AuthActionState = { status: "idle" };

function FieldError({ errors, id }: { errors?: string[]; id: string }) {
  if (!errors?.length) return null;
  return (
    <span id={id} className="mt-1.5 block text-[11px] font-medium text-[var(--color-accent)]">{errors[0]}</span>
  );
}

export function AuthForm({ mode, locale, staff = false }: { mode: Mode; locale: Locale; staff?: boolean }) {
  const t = content[locale];
  const available = hasSupabaseEnvironment();
  const [state, formAction, pending] = useActionState(
    actions[mode],
    initialAuthState,
  );
  const errorSummary = useRef<HTMLDivElement>(null);
  useEffect(() => { if (state.status === "error") errorSummary.current?.focus(); }, [state]);
  const isPasswordForm = mode !== "forgot-password";
  const submitLabel = {
    "sign-in": t.signIn,
    "sign-up": t.signUp,
    "forgot-password": t.forgot,
    "update-password": t.update,
  }[mode];

  const inputClasses =
    "mt-2 h-12 w-full rounded-xs border border-[var(--border-subtle)] bg-[var(--surface-canvas)] px-4 font-normal normal-case outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]";

  return (
    <form action={formAction} className="mt-8 space-y-5" noValidate>
      {state.status === "error" && <div ref={errorSummary} tabIndex={-1} role="alert" className="border border-[var(--status-danger)] bg-red-50 p-4 text-sm text-[var(--status-danger)]"><p>{state.message}</p>{state.fieldErrors && <ul className="mt-2 grid gap-2">{Object.entries(state.fieldErrors).filter(([,errors]) => errors?.length).map(([name,errors]) => <li key={name}><a href={`#auth-${name}`} className="underline">{errors[0]}</a></li>)}</ul>}</div>}
      <input type="hidden" name="locale" value={locale} />
      {mode === "sign-up" && (
        <label className="block text-xs font-bold uppercase tracking-[.12em] text-[var(--text-secondary)]">
          {t.fullName}
          <input
            type="text"
            name="fullName"
            id="auth-fullName"
            aria-invalid={Boolean(state.fieldErrors?.fullName?.length)}
            aria-describedby={state.fieldErrors?.fullName?.length ? "auth-fullName-error" : undefined}
            autoComplete="name"
            required
            className={inputClasses}
          />
          <FieldError id="auth-fullName-error" errors={state.fieldErrors?.fullName} />
        </label>
      )}
      {mode !== "update-password" && (
        <label className="block text-xs font-bold uppercase tracking-[.12em] text-[var(--text-secondary)]">
          {t.email}
          <input
            type="email"
            name="email"
            id="auth-email"
            aria-invalid={Boolean(state.fieldErrors?.email?.length)}
            aria-describedby={state.fieldErrors?.email?.length ? "auth-email-error" : undefined}
            autoComplete="email"
            required
            className={inputClasses}
          />
          <FieldError id="auth-email-error" errors={state.fieldErrors?.email} />
        </label>
      )}
      {isPasswordForm && (
        <label className="block text-xs font-bold uppercase tracking-[.12em] text-[var(--text-secondary)]">
          {t.password}
          <input
            type="password"
            name="password"
            id="auth-password"
            aria-invalid={Boolean(state.fieldErrors?.password?.length)}
            aria-describedby={state.fieldErrors?.password?.length ? "auth-password-error" : undefined}
            autoComplete={
              mode === "sign-in" ? "current-password" : "new-password"
            }
            required
            minLength={mode === "sign-in" ? 1 : 8}
            className={inputClasses}
          />
          <FieldError id="auth-password-error" errors={state.fieldErrors?.password} />
        </label>
      )}
      {(mode === "sign-up" || mode === "update-password") && (
        <label className="block text-xs font-bold uppercase tracking-[.12em] text-[var(--text-secondary)]">
          {t.confirmPassword}
          <input
            type="password"
            name="confirmPassword"
            id="auth-confirmPassword"
            aria-invalid={Boolean(state.fieldErrors?.confirmPassword?.length)}
            aria-describedby={state.fieldErrors?.confirmPassword?.length ? "auth-confirmPassword-error" : undefined}
            autoComplete="new-password"
            required
            minLength={8}
            className={inputClasses}
          />
          <FieldError id="auth-confirmPassword-error" errors={state.fieldErrors?.confirmPassword} />
        </label>
      )}
      {state.message && state.status !== "error" && (
        <p
          aria-live="polite"
          className={`rounded-xs border px-4 py-3 text-xs leading-5 ${
            state.status === "success"
              ? "border-[var(--brand-700)]/30 bg-[var(--brand-700)]/10 text-[var(--brand-950)]"
              : "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
          }`}
        >
          {state.message}
        </p>
      )}
      {!available && <p role="status" className="text-sm text-[var(--text-muted)]">{locale === "ar" ? "خدمة الحساب غير متاحة حالياً. يرجى المحاولة لاحقاً." : "Account services are temporarily unavailable. Please try again later."}</p>}
      <button
        type="submit"
        disabled={pending || !available}
        className="h-12 w-full rounded-xs bg-[var(--color-primary)] text-xs font-bold uppercase tracking-[.14em] text-white transition-all hover:bg-[var(--color-primary-hover)] active:scale-[0.99] disabled:cursor-wait disabled:opacity-55"
      >
        {pending ? t.pending : submitLabel}
      </button>
      <div className="space-y-3 text-center text-xs">
        {mode === "sign-in" && (
          <>
            <Link
              className="block underline underline-offset-4"
              href={`/${locale}/account/forgot-password`}
            >
              {t.forgotLink}
            </Link>
            {!staff && <Link
              className="block underline underline-offset-4"
              href={`/${locale}/account/sign-up`}
            >
              {t.newAccount}
            </Link>}
          </>
        )}
        {mode === "sign-up" && (
          <Link
            className="underline underline-offset-4"
            href={`/${locale}/account`}
          >
            {t.existingAccount}
          </Link>
        )}
        {mode === "forgot-password" && (
          <Link
            className="underline underline-offset-4"
            href={`/${locale}/account`}
          >
            {t.backToSignIn}
          </Link>
        )}
      </div>
    </form>
  );
}
