"use client";

import { Suspense } from "react";
import { ThankYouPage } from "@/components/thank-you/ThankYouPage";

function ThankYouFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<ThankYouFallback />}>
      <ThankYouPage />
    </Suspense>
  );
}
