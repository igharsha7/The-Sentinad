"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";

interface CountUpProps {
  to: number;
  from?: number;
  direction?: "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

export function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 2,
  className,
  onStart,
  onEnd,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const isInView = useInView(ref, { once: true, margin: "0px" });

  const motionValue = useMotionValue(direction === "down" ? to : from);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
    duration: duration * 1000,
  });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      const timeout = setTimeout(() => {
        onStart?.();
        motionValue.set(direction === "down" ? from : to);
        setHasAnimated(true);
      }, delay * 1000);

      return () => clearTimeout(timeout);
    }
  }, [isInView, hasAnimated, delay, direction, from, to, motionValue, onStart]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toLocaleString();
      }
    });
  }, [springValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (Math.round(latest) === to && hasAnimated) {
        onEnd?.();
      }
    });
    return unsubscribe;
  }, [springValue, to, hasAnimated, onEnd]);

  return (
    <span ref={ref} className={className}>
      {direction === "down" ? to : from}
    </span>
  );
}
