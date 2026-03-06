import * as React from "react";
import { fetchStats, type StatsResponse } from "../api/stats";

/**
 * Why this matters at scale:
 * Extracting fetch + state handling into a hook keeps UI components simple and consistent.
 * Multiple apps can reuse the same query logic (loading/error/retry/abort), reducing duplication and bugs.
 */

type StatsQueryState =
  | { status: "loading"; data: null; error: null; refetch: () => void }
  | { status: "error"; data: null; error: string; refetch: () => void }
  | {
      status: "success";
      data: StatsResponse;
      error: null;
      refetch: () => void;
    };

type StatsQueryInternalState =
  | { status: "loading"; data: null; error: null }
  | { status: "error"; data: null; error: string }
  | { status: "success"; data: StatsResponse; error: null };

export function useStatsQuery(endpointUrl: string): StatsQueryState {
  const [state, setState] = React.useState<StatsQueryInternalState>({
    status: "loading",
    data: null,
    error: null,
  });

  const refetch = React.useCallback(() => {
    const controller = new AbortController();

    setState({ status: "loading", data: null, error: null });

    fetchStats(endpointUrl, controller.signal)
      .then((stats) =>
        setState({ status: "success", data: stats, error: null })
      )
      .catch((e: unknown) => {
        const isAbort =
          controller.signal.aborted ||
          (e instanceof Error && e.name === "AbortError") ||
          (e instanceof Error && e.message.toLowerCase().includes("aborted"));

        if (isAbort) return;

        const message = e instanceof Error ? e.message : "Unknown error";
        setState({ status: "error", data: null, error: message });
      });

    return () => controller.abort();
  }, [endpointUrl]);

  React.useEffect(() => {
    const cleanup = refetch();
    return cleanup;
  }, [refetch]);

  return { ...state, refetch };
}
