import BubbleMenu from "../../components/BubbleMenu";
import { MENU_ITEMS } from "../../components/menuItems";

export default function Proyectos() {
  return (
    <>
      <BubbleMenu items={MENU_ITEMS} />
      <main>
        <h1>Proyectos</h1>
      </main>
    </>
  );
}
