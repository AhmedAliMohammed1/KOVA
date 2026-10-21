import { notFound } from "next/navigation";
import { CheckoutForm } from "@/features/checkout/checkout-form";
import { isCheckoutPhoneOtpEnabled } from "@/features/checkout/config";
import { hasPaymobConfiguration } from "@/features/checkout/paymob";
import { getShippingLocations } from "@/features/shipping/repository";
import { getCustomerAddresses } from "@/features/addresses/repository";
import { isLocale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnvironment } from "@/lib/supabase/config";
import Link from "next/link";

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ discount?: string }>;
}) {
  const [{ locale }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams ? searchParams : Promise.resolve({ discount: undefined }),
  ]);
  if (!isLocale(locale)) notFound();
  if (!hasSupabaseEnvironment()) return <main className="page-shell min-h-[60vh] py-16"><p className="eyebrow text-[var(--brand-700)]">KOVA / CHECKOUT</p><h1 className="kova-editorial mt-4 text-4xl">{locale === "ar" ? "الدفع غير متاح حالياً" : "Checkout is temporarily unavailable"}</h1><p role="status" className="mt-6 max-w-lg text-[var(--text-muted)]">{locale === "ar" ? "لم يتم إرسال أي طلب. ما زالت اختياراتك محفوظة في حقيبتك. تواصل معنا للمساعدة أو حاول لاحقاً." : "No order has been placed. Your selections are still saved in your bag. Contact us for help or try again later."}</p><Link href={`/${locale}/cart`} className="kova-button mt-8">{locale === "ar" ? "العودة للحقيبة" : "Back to bag"}</Link></main>;
  const supabase = await createClient();

  const initialDiscountCode = resolvedSearchParams?.discount?.trim() ?? null;

  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub ?? null;

  const [productsResult, shippingResult, savedAddresses, profileResult] = await Promise.all([
    supabase
      .from("products")
      .select("id, cod_deposit_minor")
      .eq("status", "active"),
    getShippingLocations(supabase).catch((error) => {
      console.error("[checkout] Shipping locations could not be loaded", error);
      return [];
    }),
    userId ? getCustomerAddresses(supabase, userId) : Promise.resolve([]),
    userId
      ? supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", userId)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  const { data: products, error: productsError } = productsResult;
  const codDeposits = productsError
    ? null
    : Object.fromEntries(
        (products ?? []).map((product) => [
          String(product.id),
          product.cod_deposit_minor,
        ]),
      );

  return (
    <CheckoutForm
      locale={locale}
      shippingLocations={shippingResult}
      savedAddresses={savedAddresses}
      isAuthenticated={Boolean(userId)}
      customerProfile={profileResult.data ?? null}
      initialDiscountCode={initialDiscountCode}
      payments={{
        paymob: hasPaymobConfiguration(),
        vodafoneNumber: process.env.NEXT_PUBLIC_VODAFONE_CASH_NUMBER ?? null,
        instapayAddress: process.env.NEXT_PUBLIC_INSTAPAY_ADDRESS ?? null,
      }}
      codDeposits={codDeposits}
      otpEnabled={isCheckoutPhoneOtpEnabled()}
    />
  );
}

