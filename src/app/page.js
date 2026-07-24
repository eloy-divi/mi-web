import styles from "./page.module.css";
import AnimateHeadingsByPhrase from "../components/AnimateHeadingsByPhrase";

export default function Home() {
  return (
    <>
      <section id="home" className={styles.homeSection}>
        <div className={styles.homeContent}>
          <h1 className={styles.titleHome} data-split-phrases>¡Nos vemos pronto!</h1>
          <p className={styles.subtitleHome} data-split-phrases>
            Agencia de marketing y publicidad especializada en impulsar tu negocio al siguiente nivel.
          </p>
        </div>
      </section>

      {/* Monta el enhancer una sola vez por página */}
      <AnimateHeadingsByPhrase selector="[data-split-phrases]" phraseStagger={100} stagger={50} />
    </>
  );
}
