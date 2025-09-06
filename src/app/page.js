import styles from "./page.module.css";
import AnimateHeadingsOnView from "../components/AnimateHeadingsOnView";

export default function Home() {
  return (
    <>
      <section id="home" className={styles.homeSection}>
        <div className={styles.homeContent}>
          {/* Marca los títulos que quieres dividir/animar */}
          <h1 data-split-chars className={styles.titleHome}>Design ForAI</h1>
          <p data-split-chars>A creative design studio for AI companies.</p>
        </div>
      </section>

      {/* Monta el enhancer UNA vez por página.
          Puedes cambiar el selector si quieres incluir más cosas */}
      <AnimateHeadingsOnView
        selector="[data-split-chars]"
        rootMargin="0px 0px -10% 0px"
        threshold={0.2}
        stagger={22}
        once
      />
    </>
  );
}
