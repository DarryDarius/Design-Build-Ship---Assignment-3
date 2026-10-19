import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/EmptyState";
import { WeekView } from "./WeekView";

export const metadata: Metadata = { title: "This week" };

export default function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <WeekView />
    </Suspense>
  );
}
