import type { Metadata } from "next";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { PokemonProvider } from "@/context/PokemonContext";
import { ContentProtector } from "@/utils/ContentProtector/ContentProtector";
import "./globals.scss";

export const metadata: Metadata = {
  title: "PokeDex Legends",
  description: "All Pokémon at one place",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
})
{
  return (
    <html lang="en">
      <body>
        <ContentProtector />
        <PokemonProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </PokemonProvider>
      </body>
    </html>
  );
}