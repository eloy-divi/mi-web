"use client";

import { useEffect, useRef, useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null); // <- NUEVO

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      // Altura dinámica real para la transición
      if (panelRef.current) {
        panelRef.current.style.maxHeight = panelRef.current.scrollHeight + "px";
      }
    } else {
      document.body.style.overflow = "";
      if (panelRef.current) {
        panelRef.current.style.maxHeight = "0px";
      }
    }
    return () => (document.body.style.overflow = "");
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="site-header">
      {/* Logo */}
      <a href="/" className="logo" aria-label="Ir a inicio" onClick={close}>
        <span className="dot-wrap" aria-hidden="true">
          <span className="dot" />
          <span className="dot dot-pulse" />
        </span>
        <span className="logo-text">Eloy Blanco</span>
      </a>

      {/* Menú de escritorio */}
      <nav className="nav-desktop" aria-label="Navegación principal">
        <a href="#works">Works</a>
        <a href="#services">Services</a>
        <a href="#pricing">Pricing</a>
        <a href="#testimonials">Testimonials</a>
        <a href="#mission">Mission</a>
        <a href="#archive">Archive</a>
      </nav>

      {/* Botón Contact */}
      <a href="#contact" className="btn-contact">Contact</a>

      {/* Burger / Close */}
        <button
          className={`burger ${open ? "is-open" : ""}`}
          aria-label="Abrir o cerrar menú"
          aria-controls="mobile-menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
        </button>

      {/* Overlay clicable */}
      <div
        className={`backdrop ${open ? "show" : ""}`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Menú móvil con altura dinámica y animación suave */}
      <div
        id="mobile-menu"
        className={`nav-mobile ${open ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        ref={panelRef}              // <- NUEVO
        style={{ maxHeight: "0px" }}// <- NUEVO (valor inicial)
      >
        <nav className="nav-mobile-inner" aria-label="Navegación móvil">
          <a href="#works" onClick={close}>Works</a>
          <a href="#services" onClick={close}>Services</a>
          <a href="#pricing" onClick={close}>Pricing</a>
          <a href="#testimonials" onClick={close}>Testimonials</a>
          <a href="#mission" onClick={close}>Mission</a>
          <a href="#archive" onClick={close}>Archive</a>
        </nav>
      </div>
    </header>
  );
}
