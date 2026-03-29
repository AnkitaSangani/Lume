"use client";

import useSWR from "swr";
import { getTodayMetrics } from "@/actions/metrics";
import { useLumeStore } from "@/store/useLumeStore";
import { useEffect } from "react";

export function useHeartbeat() {
  const setSyncStatus = useLumeStore((state) => state.setSyncStatus);

  // Directly pass the imported Next.js Server Action into SWR’s fetcher parameter.
  const { data, error, mutate, isValidating } = useSWR(
    "today-metrics",
    () => getTodayMetrics(),
    {
      refreshInterval: 600000, // 600000ms = exactly 10 minutes
      revalidateOnFocus: true,
      onSuccess: () => {
        setSyncStatus(false, new Date());
      },
    }
  );

  useEffect(() => {
    if (isValidating) {
      setSyncStatus(true);
    }
  }, [isValidating, setSyncStatus]);

  return {
    metrics: data,
    isLoading: !error && data === undefined && isValidating,
    isError: error,
    isValidating,
    mutate,
  };
}
