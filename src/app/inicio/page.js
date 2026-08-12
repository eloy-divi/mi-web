import BubbleMenu from "../../components/BubbleMenu";
import { MENU_ITEMS } from "../../components/menuItems";
import Hero from "../../components/Hero";

export default function Inicio() {
  return (
    <>
      <BubbleMenu items={MENU_ITEMS} />
      <Hero />
    </>
  );
}
