"use client";

import { useEffect, useRef } from "react";

/**
 * Runs `task` now and then every `intervalMs` while the tab is visible.
 * - never overlaps: a slow request delays the next tick instead of stacking
 * - pauses in background tabs and refreshes immediately on return
 * - restarts when `key` changes (e.g. another conversation is opened)
 * - fully cleaned up on unmount
 */
export function usePolling(task: () => Promise<void>, intervalMs: number, key: unknown = null) {
  const taskRef = useRef(task);
  taskRef.current = task;

  useEffect(() => {
    let cancelled = false;
    let inFlight = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const run = async () => {
      if (cancelled || inFlight || document.visibilityState !== "visible") return;
      inFlight = true;
      try {
        await taskRef.current();
      } catch {
        // The task reports its own errors; keep polling.
      } finally {
        inFlight = false;
      }
    };

    const loop = async () => {
      await run();
      if (!cancelled) timer = setTimeout(loop, intervalMs);
    };

    const onVisible = () => {
      if (document.visibilityState === "visible") void run();
    };

    void loop();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [intervalMs, key]);
}
