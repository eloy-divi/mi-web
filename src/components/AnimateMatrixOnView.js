"use client";
import { useEffect } from "react";

/**
 * Enhancer: anima elementos que tengan el atributo [data-split-matrix]
 * Opciones por data-attrs (opcionales):
 *   data-matrix-speed="20"   // ms por frame
 *   data-matrix-step="1"     // chars que se fijan por ciclo
 *   data-matrix-hold="900"   // pausa al completar (ms)
 *   data-matrix-chars="ABC..." // charset aleatorio
 *   data-matrix-once           // si existe, anima solo 1 vez
 */
export default function AnimateMatrixOnView({
  selector = "[data-split-matrix]",
  rootMargin = "0px 0px -10% 0px",
  threshold = 0.2,
} = {}) {
  useEffect(() => {
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    const els = Array.from(document.querySelectorAll(selector))
      // evita re-inicializar si ya lo tocamos
      .filter((el) => !el.__matrixInit);

    if (!els.length) return;

    // Observer para lanzar la animación al entrar en viewport
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          if (!entry.isIntersecting) return;

          if (prefersReduced) {
            // Accesibilidad: muestra el texto tal cual y no animes
            el.textContent = el.__matrixOriginal ?? el.textContent;
            io.unobserve(el);
            return;
          }

          animateElement(el);
          if (el.hasAttribute("data-matrix-once")) {
            io.unobserve(el);
          }
        });
      },
      { rootMargin, threshold }
    );

    els.forEach((el) => {
      el.__matrixInit = true;
      el.__matrixOriginal = el.textContent; // guardamos frase
      io.observe(el);
    });

    return () => io.disconnect();
  }, [selector, rootMargin, threshold]);

  return null;
}

function animateElement(el) {
  const phrase = el.__matrixOriginal ?? el.textContent ?? "";

  // ⚙️ Opciones por data-attrs
  const speed = toNum(el.getAttribute("data-matrix-speed"), 20);
  const step  = toNum(el.getAttribute("data-matrix-step"), 1);
  const hold  = toNum(el.getAttribute("data-matrix-hold"), 900);
  const mode  = (el.getAttribute("data-matrix-mode") || "random").toLowerCase(); // 'random' | 'ltr'
  const caretEnabled = toBool(el.getAttribute("data-matrix-caret"), false);      // por defecto: NO caret
  const charSet =
    el.getAttribute("data-matrix-chars") ||
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+-/«»·^:_=";

  const chars = charSet.split("");
  const target = phrase.split("");

  // 🚀 Orden de revelado
  let revealOrder;
  if (mode === "random") {
    // índices de caracteres que no son espacio, barajados
    revealOrder = target
      .map((_, i) => i)
      .filter((i) => target[i] !== " ")
      .sort(() => Math.random() - 0.5);
  } else {
    // izquierda -> derecha (saltando espacios)
    revealOrder = target
      .map((_, i) => i)
      .filter((i) => target[i] !== " ");
  }

  const fixed = new Set();  // índices definitivos
  let frame, pause;

  // caret opcional
  if (caretEnabled) ensureCaret(el); else removeCaret(el);

  function tick() {
    // Fijamos 'step' nuevos índices por ciclo
    for (let k = 0; k < step && revealOrder.length; k++) {
      const idx = revealOrder.shift();
      fixed.add(idx);
    }

    // Construimos línea actual
    const scramble = target.map((ch, i) => {
      if (ch === " ") return " ";
      if (fixed.has(i)) return ch;
      return chars[(Math.random() * chars.length) | 0];
    });

    const textNode = getOrCreateTextNode(el);
    textNode.nodeValue = scramble.join("");

    if (fixed.size >= target.filter((c) => c !== " ").length) {
      // Frase completa
      pause = setTimeout(() => {
        // Si quieres reiniciar automáticamente comenta/activa aquí.
        // fixed.clear(); revealOrder = shuffleAgain(...); tick();
      }, hold);
      return;
    }

    frame = setTimeout(tick, speed);
  }

  // Limpieza si se re-inicializa
  el.__matrixCleanup?.();
  el.__matrixCleanup = () => {
    if (frame) clearTimeout(frame);
    if (pause) clearTimeout(pause);
  };

  tick();
}

function toBool(v, def=false){
  if (v == null) return def;
  const s = String(v).trim().toLowerCase();
  return !(s === "false" || s === "0" || s === "no");
}

function removeCaret(el){
  const c = el.querySelector(":scope > .matrix-caret");
  if (c) c.remove();
}


function toNum(v, def) {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}

function getOrCreateTextNode(el) {
  // Mantenemos el último nodo como caret y el primero como texto
  if (!el.firstChild || el.firstChild.nodeType !== Node.TEXT_NODE) {
    el.insertBefore(document.createTextNode(""), el.firstChild || null);
  }
  return el.firstChild;
}

function ensureCaret(el) {
  if (el.querySelector(":scope > .matrix-caret")) return;
  const caret = document.createElement("span");
  caret.className = "matrix-caret";
  caret.setAttribute("aria-hidden", "true");
  el.appendChild(caret);
}
