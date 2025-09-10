import styles from "./page.module.css";
import AnimateHeadingsOnView from "../components/AnimateHeadingsOnView";
import AnimateHeadingsByPhrase from "../components/AnimateHeadingsByPhrase";
import AnimateMatrixOnView from "../components/AnimateMatrixOnView";
import AnimateRevealImage from "../components/AnimateRevealImage";

import Image from "next/image";

export default function Home() {
  return (
    <>
      <section id="home" className={styles.homeSection}>
        <div className={styles.homeContent}>
          {/* Marca los títulos que quieres dividir/animar */}
          <h1 data-split-chars className={styles.titleHome}>The future is IA</h1>
          <p className={ styles.subtitleHome }
              data-split-phrases>
  Solucuiones de publicidad creativas impulsadas por IA para tu negocio
</p>

        {/* Imagen con transición */}
          <div
            className={styles.revealImage}
            data-reveal-image
            style={{ "--reveal-duration": "1500ms" }} // puedes personalizar duración
          >
            <Image
              src="/imagen_home.jpg"
              alt="Imagen de inicio"
              width={1200}
              height={800}
              priority
            />
          </div>

        </div>
      </section>


      {/* Montas los enhancers una sola vez por página */}
      <AnimateHeadingsOnView selector="[data-split-chars]" rootMargin="0px 0px -10% 0px" threshold={0.1} stagger={50} once />
      <AnimateHeadingsByPhrase selector="[data-split-phrases]" phraseStagger={100} stagger={50} />
      <AnimateMatrixOnView selector="[data-split-matrix]" data-split-matrix data-matrix-speed="1000" data-matrix-step="1"/>
      <AnimateRevealImage />
    </>
  );
}
