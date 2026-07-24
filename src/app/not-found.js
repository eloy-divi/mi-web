import Link from "next/link";
import styles from "./page.module.css";
import AnimateHeadingsByPhrase from "../components/AnimateHeadingsByPhrase";
import BubbleMenu from "../components/BubbleMenu";
import { MENU_ITEMS } from "../components/menuItems";

export default function NotFound() {
  return (
    <>
      <BubbleMenu items={MENU_ITEMS} />
      <section className={styles.homeSection}>
        <div className={styles.homeContent}>
          <h1 className={styles.titleHome} data-split-phrases>Página no encontrada</h1>
          <p className={styles.subtitleHome} data-split-phrases>
            Puede que el enlace esté roto o la página ya no exista.{" "}
            <Link href="/">Volver al inicio</Link>
          </p>
        </div>
      </section>

      <AnimateHeadingsByPhrase selector="[data-split-phrases]" phraseStagger={100} stagger={50} />
    </>
  );
}
