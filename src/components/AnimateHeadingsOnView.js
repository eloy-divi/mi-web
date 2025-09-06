'use client';
import { useEffect } from 'react';

/**
 * Divide headings en <span.char> y activa animación
 * cuando cada heading entra en viewport.
 */
export default function AnimateHeadingsOnView({
  selector = '[data-split-chars]', // marca qué headings quieres
  rootMargin = '0px 0px -10% 0px',
  threshold = 0.2,
  stagger = 22, // ms entre letras
  once = true,
} = {}) {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nodes = Array.from(document.querySelectorAll(selector));

    // 1) split a caracteres
    const split = (el) => {
      if (el.dataset.split === '1') return;
      const text = el.textContent ?? '';
      el.dataset.original = text;
      el.dataset.split = '1';
      el.setAttribute('aria-label', text);
      el.textContent = '';
      for (const ch of text) {
        const span = document.createElement('span');
        span.className = 'char';
        span.setAttribute('aria-hidden', 'true');
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        el.appendChild(span);
      }
    };
    nodes.forEach(split);

    if (reduce) {
      // sin animación: visibles desde ya
      nodes.forEach((el) =>
        el.querySelectorAll('.char').forEach((c) => {
          c.style.opacity = '1';
          c.style.transform = 'none';
        })
      );
      return;
    }

    // 2) observar y activar cuando entren
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const chars = Array.from(el.querySelectorAll('.char'));
          chars.forEach((c, i) => {
            const t = setTimeout(() => c.classList.add('active'), i * stagger);
            c._t = t;
          });
          if (once) io.unobserve(el);
        });
      },
      { rootMargin, threshold }
    );

    nodes.forEach((el) => io.observe(el));

    // cleanup: restaurar texto si se desmonta
    return () => {
      io.disconnect();
      nodes.forEach((el) => {
        const original = el.dataset.original;
        if (original == null) return;
        el.textContent = original;
        el.removeAttribute('aria-label');
        delete el.dataset.original;
        delete el.dataset.split;
      });
    };
  }, [selector, rootMargin, threshold, stagger, once]);

  return null;
}
