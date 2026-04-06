"use client";

import React, { Suspense } from "react";
import OutgoingVerificationContent from "./OutgoingVerificationContent";

export default function OutgoingVerificationPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#f8f9fc]">Loading...</div>}>
      <OutgoingVerificationContent />
    </Suspense>
  );
}