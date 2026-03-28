import type { Metadata } from "next";
import { Playfair_Display, Nunito } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Ведення вагітності — МЦ MED OK Вінниця",
  description:
    "Пакет «Довіра» — ведення вагітності від I до III триместру. FMF London, Voluson E8, CAREWAY App 24/7. Вінниця, вул. Зодчих 20.",
  openGraph: {
    title: "Ведення вагітності — МЦ MED OK Вінниця",
    description: "Персоналізоване ведення вагітності. Один лікар, фіксована ціна, CAREWAY App 24/7.",
    locale: "uk_UA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk" className={`${playfair.variable} ${nunito.variable}`}>
      <body className="min-h-full flex flex-col" style={{ fontFamily: "var(--font-nunito), Nunito, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
