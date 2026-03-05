import React, { useCallback, useEffect, useState } from "react";
import { fetchStats, type StatsResponse } from "../api/stats";

type UsersStatsWidgetProps = {
  endpointUrl: string;
  className?: string;
};

function formatPercent(rate0to1: number): string {
  return `${(rate0to1 * 100).toFixed(1)}%`;
}

export function UsersStatsWidget({
  endpointUrl,
  className,
}: UsersStatsWidgetProps) {
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fetchStats(endpointUrl, controller.signal)
      .then((stats) => {
        setData(stats);
      })
      .catch((e: unknown) => {
        const isAbort =
          controller.signal.aborted ||
          (e instanceof Error && e.name === "AbortError") ||
          (e instanceof Error && e.message.toLowerCase().includes("aborted"));

        if (isAbort) return;

        setData(null);
        setError(e instanceof Error ? e.message : "Unknown error");
      })
      .finally(() => {
        setLoading(false);
      });

    return () => controller.abort();
  }, [endpointUrl]);

  useEffect(() => {
    const cleanup = load();
    return cleanup;
  }, [load]);

  if (loading) {
    return (
      <div className={className} aria-busy="true" aria-live="polite">
        Loading stats…
      </div>
    );
  }

  if (error) {
    return (
      <div className={className} role="alert">
        <div>Could not load stats: {error}</div>
        <button type="button" onClick={load}>
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return <div className={className}>No data available.</div>;
  }

  return (
    <section className={className} aria-label="User statistics">
      <div>
        <strong>Users:</strong> {data.users}
      </div>
      <div>
        <strong>Active today:</strong> {data.active_today}
      </div>
      <div>
        <strong>Conversion rate:</strong> {formatPercent(data.conversion_rate)}
      </div>
    </section>
  );
}
