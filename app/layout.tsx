import type { Metadata } from "next";
import { Onest, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const onest = Onest({
  variable: "--font",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-acc",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400"],
  style: ["italic"],
});

export const metadata: Metadata = {
  title: "Ведення вагітності Вінниця — від 9 970 ₴ · МЦ MED OK | Пакет з I по III триместр",
  description:
    "Пакетне ведення вагітності у МЦ MED OK, Вінниця. Фіксована ціна від 9 970 ₴/триместр. УЗД на Voluson E8, генетичний скринінг, контроль між візитами. Запис онлайн.",
  alternates: {
    canonical: "https://medok.check-up.in.ua/",
  },
  openGraph: {
    title: "Ведення вагітності у Вінниці — МЦ MED OK",
    description: "Пакетне ведення вагітності. Один лікар, фіксована ціна від 9 970 ₴, контроль між візитами.",
    locale: "uk_UA",
    type: "website",
    url: "https://medok.check-up.in.ua/",
  },
};

const schemaOrg = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalBusiness",
      "name": "МЦ MED OK",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Вінниця",
        "streetAddress": "вул. Зодчих, 20"
      },
      "telephone": "+380432659977",
      "medicalSpecialty": "Obstetric",
      "url": "https://medok.check-up.in.ua",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Ведення вагітності",
        "itemListElement": [
          { "@type": "Offer", "name": "Ведення вагітності I триместр", "price": "14540", "priceCurrency": "UAH" },
          { "@type": "Offer", "name": "Ведення вагітності II триместр", "price": "9970", "priceCurrency": "UAH" },
          { "@type": "Offer", "name": "Ведення вагітності III триместр", "price": "15320", "priceCurrency": "UAH" },
          { "@type": "Offer", "name": "Повне ведення вагітності", "price": "39830", "priceCurrency": "UAH" }
        ]
      }
    },
    { "@type": "Physician", "name": "Янюк Ольга Олександрівна", "medicalSpecialty": "Obstetric", "worksFor": { "@type": "MedicalBusiness", "name": "МЦ MED OK" } },
    { "@type": "Physician", "name": "Кельман Вікторія Володимирівна", "medicalSpecialty": "Obstetric", "worksFor": { "@type": "MedicalBusiness", "name": "МЦ MED OK" } },
    { "@type": "Physician", "name": "Трофімчук Тетяна Ігорівна", "medicalSpecialty": "Obstetric", "worksFor": { "@type": "MedicalBusiness", "name": "МЦ MED OK" } },
    { "@type": "Physician", "name": "Бондарчук Жанна Геннадіївна", "medicalSpecialty": "Diagnostic Radiology", "worksFor": { "@type": "MedicalBusiness", "name": "МЦ MED OK" } },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Що входить у програму ведення вагітності?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Всі планові консультації акушер-гінеколога, УЗД відповідно до триместру, аналізи крові та сечі, скринінги. Лікар контролює ваші показники між прийомами та зв'яжеться з вами, якщо щось потребує уваги."
          }
        },
        {
          "@type": "Question",
          "name": "Чи є програми для двоплідної вагітності?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Так, всі пакети мають окрему ціну для двійні. Ведення двоплідної вагітності передбачає частіші контролі та додаткові параметри при УЗД."
          }
        }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "check-up.in.ua", "item": "https://check-up.in.ua" },
        { "@type": "ListItem", "position": 2, "name": "Вагітність", "item": "https://pregnancy.check-up.in.ua" },
        { "@type": "ListItem", "position": 3, "name": "MED OK Вінниця" }
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk" className={`${onest.variable} ${cormorant.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body className="min-h-full flex flex-col" style={{ fontFamily: "var(--font), Onest, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
