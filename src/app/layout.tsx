import type { Metadata } from "next";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { PokemonProvider } from "@/context/PokemonContext";
import { ContentProtector } from "@/utils/ContentProtector/ContentProtector";
import "./globals.scss";
import Script from "next/script";

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
        <Script
          src="https://stats.aisa-studios.de/analytics"
          data-website-id="4d061078-9c8a-41f9-b628-648eca8bf067"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}