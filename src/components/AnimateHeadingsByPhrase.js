'use client';
import { useEffect } from 'react';

export default function AnimateHeadingsByPhraseWords({
  selector = '[data-split-phrases]',
  rootMargin = '0px 0px -10% 0px',
  threshold = 0.2,
  phraseStagger = 700,   // ms entre frases
  wordStagger = 60,      // ms entre palabras dentro de la frase
  once = true,
} = {}) {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nodes = Array.from(document.querySelectorAll(selector));

    // Split a frases y luego a palabras
    const split = (el) => {
      if (el.dataset.split === '1') return;
      const text = el.textContent ?? '';
      el.dataset.original = text;
      el.dataset.split = '1';
      el.setAttribute('aria-label', text);
      el.textContent = '';

      // dividir por (punto|!|?) + espacios o salto de línea
      const phrases = text.split(/(?<=[.!?])\s+|\n/);

      phrases.forEach((phrase, idx) => {
        const p = document.createElement('span');
        p.className = 'phrase';
        p.setAttribute('aria-hidden', 'true');

        // split por espacios conservando los mismos
        const tokens = phrase.split(/(\s+)/); // palabras y separadores
        tokens.forEach((tok) => {
          if (tok.trim() === '') {
            p.appendChild(document.createTextNode(tok)); // mantener espacios exactos
          } else {
            const w = document.createElement('span');
            w.className = 'word';
            w.textContent = tok;
            p.appendChild(w);
          }
        });

        // añadir espacio entre frases si no es la última
        el.appendChild(p);
        if (idx < phrases.length - 1) el.appendChild(document.createTextNode(' '));
      });
    };

    nodes.forEach(split);

    // reduced motion → todo visible
    if (reduce) {
      nodes.forEach((el) => {
        el.querySelectorAll('.phrase,.word').forEach((n) => {
          n.style.opacity = '1';
          n.style.transform = 'none';
        });
      });
      return;
    }

    // Observer
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;

          const phrases = Array.from(el.querySelectorAll('.phrase'));

          // para cada frase: activar la frase y luego sus palabras con wordStagger
          phrases.forEach((ph, i) => {
            const start = i * phraseStagger;

            // activa la caja de la frase (slide lateral)
            const t1 = setTimeout(() => {
              ph.classList.add('active');

              // ahora stagger por palabra
              const words = Array.from(ph.querySelectorAll('.word'));
              words.forEach((w, j) => {
                const t2 = setTimeout(() => w.classList.add('w-active'), j * wordStagger);
                w._t2 = t2;
              });
            }, start);

            ph._t1 = t1;
          });

          if (once) io.unobserve(el);
        });
      },
      { rootMargin, threshold }
    );

    nodes.forEach((el) => io.observe(el));

    // cleanup: restaurar texto original
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
  }, [selector, rootMargin, threshold, phraseStagger, wordStagger, once]);

  return null;
}
