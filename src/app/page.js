import styles from "./page.module.css";
import AnimateHeadingsOnView from "../components/AnimateHeadingsOnView";
import AnimateHeadingsByPhrase from "../components/AnimateHeadingsByPhrase";
import AnimateMatrixOnView from "../components/AnimateMatrixOnView";

export default function Home() {
  return (
    <>
      <section id="home" className={styles.homeSection}>
        <div className={styles.homeContent}>
          {/* Marca los títulos que quieres dividir/animar */}
          <h1 data-split-chars className={styles.titleHome}>Design ForAI</h1>
          <p
            data-split-matrix
            data-matrix-speed="18"
            data-matrix-step="2"       // fija 2 caracteres por ciclo
            data-matrix-hold="900"
            data-matrix-mode="random"  // (opcional, es el default)
            // data-matrix-caret="true" // si quieres mostrar el cursor
          >
  A creative design studio for AI companies.
</p>

        </div>
      </section>


      {/* Montas los enhancers una sola vez por página */}
      <AnimateHeadingsOnView selector="[data-split-chars]" rootMargin="0px 0px -10% 0px" threshold={0.1} stagger={70} once />
      <AnimateHeadingsByPhrase selector="[data-split-phrases]" phraseStagger={100} stagger={70} />
      <AnimateMatrixOnView selector="[data-split-matrix]" data-split-matrix data-matrix-speed="1000" data-matrix-step="1"/>
    </>
  );
}
