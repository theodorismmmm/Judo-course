import { SignInScreen } from "@/components/SignScreens";
import { Suspense } from "react";
import Link from "next/link";

export const metadata = { title: "Anmelden" };

export default function Page() {
  return (
    <main id="inhalt" className="auth-screen">
      <Link href="/" className="wordmark">
        JudoNOW
      </Link>
      <Suspense fallback={<p className="loading">Anmeldung wird geladen …</p>}>
        <SignInScreen />
      </Suspense>
    </main>
  );
}
