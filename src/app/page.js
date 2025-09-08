import styles from "./page.module.css";
import AnimateHeadingsOnView from "../components/AnimateHeadingsOnView";
import AnimateHeadingsByPhrase from "../components/AnimateHeadingsByPhrase";

export default function Home() {
  return (
    <>
      <section id="home" className={styles.homeSection}>
        <div className={styles.homeContent}>
          {/* Marca los títulos que quieres dividir/animar */}
          <h1 data-split-chars className={styles.titleHome}>Design ForAI</h1>
          <p data-split-phrases>A creative design studio for AI companies. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ac est non tortor vestibulum auctor et non dui. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. </p>
        </div>
      </section>

      {/* Monta el enhancer UNA vez por página.
          Puedes cambiar el selector si quieres incluir más cosas */}
      <AnimateHeadingsOnView
        selector="[data-split-chars]"
        rootMargin="0px 0px -10% 0px"
        threshold={0.1}
        stagger={70}
        once
      />
      <AnimateHeadingsByPhrase
        selector="[data-split-phrases]"
        phraseStagger={100}  // intervalo entre frases
        stagger={50} // ms entre frases, ajusta al gusto
        once
      />
    </>
  );
}
