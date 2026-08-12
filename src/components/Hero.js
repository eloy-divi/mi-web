'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

import styles from './Hero.module.css';

gsap.registerPlugin(ScrollTrigger, SplitText);

const ICONS = [
  'bigquery',
  'clarity',
  'claude-code',
  'claude',
  'data-studio',
  'ga4',
  'gemini',
  'gohighlevel',
  'google-ads',
  'linkedin',
  'meta',
  'openai',
  'search-console',
  'shopify',
  'tiktok',
];

export default function Hero() {
  const sectionRef = useRef(null);
  const outerRefs = useRef([]);
  const innerRefs = useRef([]);
  const textGroupRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const title2Ref = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const outers = outerRefs.current.filter(Boolean);
    const inners = innerRefs.current.filter(Boolean);
    if (!section || !outers.length) return;

    const n = outers.length;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let scatter = [];
    let line = [];
    let circle = [];
    let circleRotation = [];
    let arc = [];
    let arcRotation = [];
    let arcScale = 1;
    let exitLine = [];

    const computeLayouts = () => {
      const w = section.offsetWidth;
      const h = section.offsetHeight;
      const iconSize = outers[0].getBoundingClientRect().width || 56;

      scatter = outers.map(() => ({
        x: gsap.utils.random(-w * 0.42, w * 0.42),
        y: gsap.utils.random(-h * 0.36, h * 0.36),
        rotation: gsap.utils.random(-50, 50),
      }));

      const lineGap = Math.min((w * 0.88) / (n - 1), 70);
      const lineWidth = lineGap * (n - 1);
      line = outers.map((_, i) => ({
        x: -lineWidth / 2 + i * lineGap,
        y: 0,
      }));

      // El radio se calcula a partir del tamaño real del bloque de texto
      // inicial (título + subtítulo) para que el anillo de iconos lo rodee
      // sin taparlo. El segundo texto solo aparece cuando los iconos ya
      // están en el arco, así que no participa en este cálculo.
      const textBox = textGroupRef.current?.getBoundingClientRect();
      const textHalfDiagonal = textBox
        ? Math.hypot(textBox.width / 2, textBox.height / 2)
        : 0;
      const textClearance = textHalfDiagonal + iconSize / 2 + 12;

      const overlapFreeRadius = (iconSize * 1.15 * n) / (2 * Math.PI);
      const baselineRadius = Math.min(w, h) * 0.3;
      const maxRadius = Math.min(w, h) / 2 - iconSize / 2 - 8;
      const radius = Math.min(
        Math.max(baselineRadius, overlapFreeRadius, textClearance),
        maxRadius,
      );
      // Rotación "pétalo": cada icono se inclina siguiendo la tangente de
      // su posición en el círculo, en vez de quedarse siempre derecho.
      // El offset de arranque (arriba-derecha, no arriba del todo) marca
      // dónde está la "costura" del círculo: el icono i=0 (primero en
      // moverse, ya que el stagger sigue el orden del array) empieza ahí,
      // igual que en la referencia.
      const circleAngleStart = (-35 * Math.PI) / 180;
      circle = outers.map((_, i) => {
        const angle = (i / n) * Math.PI * 2 + circleAngleStart;
        return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
      });
      circleRotation = outers.map((_, i) => {
        const angle = (i / n) * Math.PI * 2 + circleAngleStart;
        return (angle * 180) / Math.PI + 90;
      });

      // La línea final siempre usa el ancho disponible completo; si con el
      // tamaño normal del icono no entran los 15 con una separación decente,
      // se ajusta el tamaño para que quepan sin superponerse (ver
      // buildScrollTimeline). Con espacio de sobra los iconos CRECEN al
      // formar la línea (hasta 1.4x).
      const maxSpread = Math.min(w * 0.92, 980);
      const gapAvailable = maxSpread / (n - 1);
      const noOverlapCap = gapAvailable / (iconSize * 1.1);
      arcScale = Math.min(1.4, Math.max(0.6, noOverlapCap));
      const spread = maxSpread;
      const lineY = h / 2 - Math.max(iconSize * 1.1, 56);
      arc = outers.map((_, i) => {
        const t = n === 1 ? 0.5 : i / (n - 1);
        return { x: -spread / 2 + t * spread, y: lineY };
      });
      // Los iconos quedan derechos (rotación 0) en la línea final. Se ajusta
      // al camino más corto desde circleRotation (que recorre 0-360°) para
      // evitar un giro largo/brusco al empezar el desenrollado.
      arcRotation = outers.map((_, i) => {
        const from = circleRotation[i];
        const delta = (((0 - from + 180) % 360) + 360) % 360 - 180;
        return from + delta;
      });
      // Tras formar la línea, todo el grupo se desliza hacia la izquierda
      // lo suficiente para que hasta el icono más a la derecha quede fuera
      // del viewport (el overflow:hidden de .hero hace el resto).
      const exitShift = spread + w;
      exitLine = outers.map((_, i) => ({
        x: arc[i].x - exitShift,
        y: lineY,
      }));
    };

    computeLayouts();

    let textRevealed = reduceMotion;
    const onLinesSplit = (splitInstance) => {
      gsap.set(splitInstance.lines, { yPercent: textRevealed ? 0 : 100 });
    };
    const titleSplit = SplitText.create(titleRef.current, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit: onLinesSplit,
    });
    const subtitleSplit = SplitText.create(subtitleRef.current, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit: onLinesSplit,
    });
    // El segundo texto se revela al ritmo del scroll (scrub), no una sola
    // vez: sus líneas siempre arrancan ocultas y el propio scrollTl decide
    // cuánto se muestran según la posición de scroll.
    //
    // autoSplit también observa el ancho del elemento (ResizeObserver) y
    // puede volver a repartir las líneas si cambia levemente después del
    // layout inicial (p. ej. por el swap de la fuente). Si eso pasa DESPUÉS
    // de construir el scrollTl, el tween ya creado queda apuntando a
    // elementos de línea viejos. Por eso, si ya existe un scrollTl activo,
    // el propio onSplit reconstruye el tween apuntando a las líneas nuevas.
    let scrollTlRef = null;
    // Se guardan TODOS los tweens creados (no solo el último) porque un
    // resplit puede llegar antes de que el anterior haya sido reemplazado
    // por completo; matar solo "el último" dejaba tweens huérfanos vivos
    // apuntando a líneas ya desmontadas.
    let title2Tweens = [];
    const buildTitle2Tween = (splitInstance) => {
      title2Tweens.forEach((t) => t.kill());
      const tween = scrollTlRef.to(splitInstance.lines, {
        yPercent: 0,
        duration: 0.4,
        ease: 'none',
        stagger: 0.04,
      }, 0.9);
      title2Tweens = [tween];
      return tween;
    };
    const title2Split = SplitText.create(title2Ref.current, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit: (splitInstance) => {
        gsap.set(splitInstance.lines, { yPercent: 100 });
        if (scrollTlRef) {
          buildTitle2Tween(splitInstance);
          // Un hijo agregado a un timeline que ya tenía progreso no se
          // renderiza hasta el próximo cambio de progreso del padre. Forzar
          // un re-render inmediato (mismo valor) evita que quede "colgado"
          // hasta el siguiente tick de scroll.
          scrollTlRef.progress(scrollTlRef.progress());
        }
      },
    });

    // autoSplit re-reparte las líneas cuando las fuentes terminan de
    // cargar (evento nativo "loadingdone" de document.fonts). Si eso pasa
    // después de crear un tween que apunta a titleSplit.lines/etc., el
    // tween queda enganchado a elementos de línea viejos y ya desmontados.
    // Esperar a que las fuentes estén listas antes de construir cualquier
    // timeline evita esa carrera.
    let cancelled = false;
    let ctx = null;

    document.fonts.ready.then(() => {
      if (cancelled) return;

      ctx = gsap.context((self) => {
        // Creado solo cuando los iconos ya están en su posición de círculo:
        // si el ScrollTrigger (scrub) se crea antes, su render inicial a
        // progreso 0 captura el valor "from" en ese instante y lo reimpone
        // en cada refresh, pisando la animación de entrada todavía en curso.
        const buildScrollTimeline = () => {
          const scrollTl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: '+=150%',
              scrub: 0.6,
              pin: true,
              anticipatePin: 1,
            },
          });

          // El círculo se desenrolla hacia la línea horizontal inferior: los
          // iconos crecen (o se ajustan si no hay espacio, ver arcScale),
          // quedan derechos y el stagger en orden de índice (= orden
          // alrededor del círculo) hace que el desenrollado sea
          // secuencial/direccional, no simultáneo.
          scrollTl.to(outers, {
            x: (i) => arc[i].x,
            y: (i) => arc[i].y,
            rotation: (i) => arcRotation[i],
            scale: arcScale,
            duration: 1,
            ease: 'none',
            stagger: 0.03,
          }, 0);

          scrollTl.to([titleRef.current, subtitleRef.current], {
            opacity: 0,
            y: -16,
            duration: 0.35,
            ease: 'none',
          }, 0);

          scrollTlRef = scrollTl;
          buildTitle2Tween(title2Split);

          // Una vez formada la línea y revelado el segundo texto, todo el
          // grupo se desliza y desaparece por la izquierda (clip natural del
          // overflow:hidden de .hero).
          scrollTl.to(outers, {
            x: (i) => exitLine[i].x,
            duration: 0.7,
            ease: 'power1.in',
          }, 1.55);
        };

        if (reduceMotion) {
          gsap.set(outers, {
            x: (i) => circle[i].x,
            y: (i) => circle[i].y,
            rotation: (i) => circleRotation[i],
          });
          buildScrollTimeline();
        } else {
          gsap.set(outers, {
            x: (i) => scatter[i].x,
            y: (i) => scatter[i].y,
            rotation: (i) => scatter[i].rotation,
          });
          gsap.set(inners, { opacity: 0 });

          const intro = gsap.timeline({
            delay: 0.2,
            onComplete: () => self.add(buildScrollTimeline),
          });

          intro.to(inners, {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
            stagger: { each: 0.03, from: 'random' },
            onComplete: () => gsap.set(inners, { clearProps: 'opacity' }),
          }, 0);

          intro.to(outers, {
            x: (i) => line[i].x,
            y: (i) => line[i].y,
            rotation: 0,
            duration: 0.9,
            ease: 'power3.inOut',
            stagger: 0.015,
          }, 0.65);

          intro.to(outers, {
            x: (i) => circle[i].x,
            y: (i) => circle[i].y,
            rotation: (i) => circleRotation[i],
            duration: 1,
            ease: 'power3.inOut',
            stagger: 0.015,
          }, '+=0.3');

          // Reveal de líneas (título primero, subtítulo con un pequeño
          // desfase) en vez de un simple fade. Se registra vía self.add()
          // porque intro.call() lo dispara de forma asíncrona, fuera de la
          // ejecución síncrona de gsap.context().
          intro.call(() => {
            self.add(() => {
              gsap.timeline({ onComplete: () => { textRevealed = true; } })
                .to(titleSplit.lines, {
                  yPercent: 0,
                  duration: 0.8,
                  ease: 'power3.out',
                  stagger: 0.08,
                })
                .to(subtitleSplit.lines, {
                  yPercent: 0,
                  duration: 0.7,
                  ease: 'power3.out',
                  stagger: 0.06,
                }, '-=0.45');
            });
          }, [], '-=0.5');
        }
      }, section);
    });

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        computeLayouts();
        ScrollTrigger.refresh();
      }, 200);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelled = true;
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      ctx?.revert();
      titleSplit.revert();
      subtitleSplit.revert();
      title2Split.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.hero}>
      <div className={styles.field} aria-hidden="true">
        {ICONS.map((name, i) => (
          <div
            key={name}
            className={styles.iconOuter}
            ref={(el) => { outerRefs.current[i] = el; }}
          >
            <span
              className={styles.iconInner}
              ref={(el) => { innerRefs.current[i] = el; }}
            >
              <Image
                src={`/icons/${name}.png`}
                alt=""
                width={56}
                height={56}
                sizes="(max-width: 480px) 32px, (max-width: 900px) 44px, 56px"
                className={styles.icon}
              />
            </span>
          </div>
        ))}
      </div>

      <div className={styles.textLayer}>
        <div ref={textGroupRef} className={styles.textGroup}>
          <h1 ref={titleRef} className={styles.title}>
            <span className={styles.titleSemibold}>eloyblanco</span>
            <span className={styles.titleLight}>&co</span>
          </h1>
          <p ref={subtitleRef} className={`${styles.subtitle} ${styles.subtitleSecondary}`}>
            Combino las mejores herramientas para hacer crecer tus anuncios.
          </p>
        </div>
        <div className={styles.textGroup}>
          <h2 ref={title2Ref} className={`${styles.title} ${styles.titleMedium}`}>
            Ayudo a <span className={styles.accentUnderline}>agencias y empresas</span> a
            generar más oportunidades de negocio mediante{' '}
            <span className={styles.accentUnderline}>Paid Media, analítica y automatización</span>.
          </h2>
        </div>
      </div>
    </section>
  );
}
