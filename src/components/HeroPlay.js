'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';

// Cargamos el enhancer en lazy y solo en cliente
const AnimateHeadingsOnClass = dynamic(
  () => import('./AnimateHeadingsOnView'),
  { ssr: false }
);

export default function HeroPlay() {
  const [play, setPlay] = useState(false);

  return (
    <section style={{ textAlign: 'center', padding: '80px 0' }}>
      {/* Marca qué headings podrán animarse con data-atributo (para no tocar todos) */}
      <h1 data-split-chars className={play ? 'animate-now' : ''}>Design ForAI</h1>
      <h2 data-split-chars className={play ? 'animate-now' : ''}>
        A creative design studio for AI companies.
      </h2>
      <h3 data-split-chars className={play ? 'animate-now' : ''}>
        Let’s build something awesome.
      </h3>

      <div style={{ marginTop: 24 }}>
        <button
          onClick={() => setPlay(true)}
          style={{ padding: '10px 16px', borderRadius: 999, background: '#111', color: '#fff', border: 0 }}
        >
          Play animation
        </button>
      </div>

      {/* Montamos el enhancer SOLO cuando quieres animar */}
      {play && (
        <AnimateHeadingsOnClass
          selector='[data-split-chars].animate-now'
          stagger={22}
        />
      )}
    </section>
  );
}
