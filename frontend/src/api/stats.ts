export type StatsResponse = {
  users: number;
  active_today: number;
  conversion_rate: number; // 0..1
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function toNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/**
 * Runtime validation so the UI won't crash on unexpected API responses.
 */
export function parseStats(data: unknown): StatsResponse {
  if (!isRecord(data)) throw new Error("Invalid response: expected an object");

  const users = toNumber(data.users);
  const activeToday = toNumber(data.active_today);
  const conversionRate = toNumber(data.conversion_rate);

  if (users === null || activeToday === null || conversionRate === null) {
    throw new Error("Invalid response: fields must be numeric");
  }
  if (users < 0 || activeToday < 0) {
    throw new Error("Invalid response: counts cannot be negative");
  }
  if (conversionRate < 0 || conversionRate > 1) {
    throw new Error("Invalid response: conversion_rate must be 0..1");
  }

  return { users, active_today: activeToday, conversion_rate: conversionRate };
}

export async function fetchStats(
  endpointUrl: string,
  signal?: AbortSignal
): Promise<StatsResponse> {
  const res = await fetch(endpointUrl, { signal });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as unknown;
  return parseStats(json);
}
