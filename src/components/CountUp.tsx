"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

/**
 * Count-up on scroll — anti-slop compliant.
 * Starts at 85% of the REAL target value (content visible from first paint,
 * never "$0"), then counts up to the true value when scrolled into view.
 * If `target` is 0, renders 0 immediately (no fake animation).
 */
export default function CountUp({
  target,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1400,
  className,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(() =>
    (target * 0.85).toFixed(decimals)
  );

  useEffect(() => {
    if (!inView) return;
    if (target <= 0) {
      setDisplay("0");
      return;
    }

    const start = target * 0.85;
    const startTime = performance.now();

    let raf: number;
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // easeOutCubic — decelerating, purposeful
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = start + (target - start) * eased;
      setDisplay(value.toFixed(decimals));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, decimals, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
