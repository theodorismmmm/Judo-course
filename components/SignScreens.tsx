"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

function redirectTarget(fallback: string, value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}

export function SignInScreen() {
  const params = useSearchParams();
  const redirect = redirectTarget("/ueben", params.get("redirect_url"));
  return <SignIn forceRedirectUrl={redirect} signUpUrl="/sign-up" />;
}

export function SignUpScreen() {
  const params = useSearchParams();
  const redirect = redirectTarget("/ueben", params.get("redirect_url"));
  return <SignUp forceRedirectUrl={redirect} signInUrl="/sign-in" />;
}
