import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { funnelDisplay } from "./fonts" // ✅ este sí existe

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.eloyblanco.com"),
  title: {
    default: "Eloy Blanco",
    template: "%s · Eloy Blanco",
  },
  description: "Portfolio y servicios.",
  openGraph: {
    type: "website",
    url: "/",
    title: "Eloy Blanco",
    description: "Portfolio y servicios.",
    siteName: "Eloy Blanco",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={funnelDisplay.className}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

