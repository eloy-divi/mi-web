"use client";
import { useEffect } from "react";

export default function AnimateRevealImage({
  selector = "[data-reveal-image]",
  rootMargin = "0px 0px -10% 0px",
  threshold = 0.2,
} = {}) {
  useEffect(() => {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-open");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin, threshold });

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [selector, rootMargin, threshold]);

  return null;
}
