import { useStatsQuery } from "../hooks/useStatsQuery";

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
  const { status, data, error, refetch } = useStatsQuery(endpointUrl);

  if (status === "loading") {
    return (
      <div className={className} aria-busy="true" aria-live="polite">
        Loading stats…
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className={className} role="alert">
        <div>Could not load stats: {error}</div>
        <button type="button" onClick={refetch}>
          Retry
        </button>
      </div>
    );
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
