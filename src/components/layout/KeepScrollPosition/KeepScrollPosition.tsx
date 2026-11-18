import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

// The browser restores scroll before the page has loaded its content. The page is still short then, so the
// restored position is clamped and ends up in the wrong place. We save the position when the page is left
// (reload or close), then apply it once the page is tall enough. Restoring stops if the user starts scrolling.
const STORAGE_KEY = "studienotater-scroll-positions";
const RESTORE_TIMEOUT_MS = 8000;
const USER_INPUT_EVENTS = ["wheel", "touchstart", "keydown"] as const;

const readPositions = (): Record<string, number> => {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
};

const savePosition = (key: string, top: number) => {
  try {
    const positions = readPositions();
    positions[key] = Math.round(top);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  } catch {
    // Scroll restore is a convenience only.
  }
};

const isReloadOrBackForward = () => {
  const [entry] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
  return entry?.type === "reload" || entry?.type === "back_forward";
};

export const KeepScrollPosition = () => {
  const { pathname, search, hash } = useLocation();
  const key = `${pathname}${search}${hash}`;
  const restoringRef = useRef(false);
  // Read once, on the first render, before anything else can change the saved value.
  const [initialTarget] = useState(() => {
    if (!isReloadOrBackForward()) return 0;
    return readPositions()[`${pathname}${search}${hash}`] ?? 0;
  });
  const restoredRef = useRef(false);

  useEffect(() => {
    const previous = history.scrollRestoration;
    history.scrollRestoration = "manual";
    return () => {
      history.scrollRestoration = previous;
    };
  }, []);

  // Save where the user is when the page is left. Do not save while scrolling: content changes between
  // pages make the page short for a moment, which would store a wrong position.
  useEffect(() => {
    const onPageHide = () => {
      if (!restoringRef.current) savePosition(key, window.scrollY);
    };
    window.addEventListener("pagehide", onPageHide);
    return () => window.removeEventListener("pagehide", onPageHide);
  }, [key]);

  // Restore once, for the page the app was opened on.
  useEffect(() => {
    if (restoredRef.current || initialTarget <= 0) return;
    restoredRef.current = true;
    const target = initialTarget;
    restoringRef.current = true;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      restoringRef.current = false;
      resizeObserver.disconnect();
      window.clearInterval(interval);
      window.clearTimeout(timeout);
      USER_INPUT_EVENTS.forEach((name) => window.removeEventListener(name, finish));
    };

    const attempt = () => {
      if (finished) return;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll < target) return;
      window.scrollTo({ top: target, behavior: "instant" });
      if (Math.abs(window.scrollY - target) < 2) finish();
    };

    const resizeObserver = new ResizeObserver(attempt);
    resizeObserver.observe(document.body);
    const interval = window.setInterval(attempt, 100);
    const timeout = window.setTimeout(finish, RESTORE_TIMEOUT_MS);
    USER_INPUT_EVENTS.forEach((name) => window.addEventListener(name, finish, { passive: true }));
    attempt();
  }, [initialTarget]);

  return null;
};
