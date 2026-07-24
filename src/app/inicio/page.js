import BubbleMenu from "../../components/BubbleMenu";
import { MENU_ITEMS } from "../../components/menuItems";

export default function Inicio() {
  return (
    <>
      <BubbleMenu items={MENU_ITEMS} />
      <main>
        <h1>Inicio</h1>
      </main>
    </>
  );
}
