// app/dashboard/page.tsx
import React, { Suspense } from "react";
import SecurityDashboard from "./component";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <SecurityDashboard />
    </Suspense>
  );
}
