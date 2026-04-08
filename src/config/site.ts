// src/config/site.ts
// Główny plik konfiguracyjny - SSOT (Single Source of Truth)
// Edytując te parametry zaktualizujesz informacje we wszystkich sekcjach aplikacji (kontakt, stopki, meta tagi SEO).

export const siteConfig = {
  name: "Gmina Miedzna",
  description: "Oficjalny portal informacyjny Urzędu Gminy w Miedznie",
  url: "https://gmina-miedzna.pl",
  
  contact: {
    addressLine1: "ul. Węgrowskia 5",
    addressLine2: "07-106 Miedzna",
    phone: "123 456 789",
    email: "gmina@gmina-miedzna.pl",
    nip: "000-000-00-00",
    regon: "000000000",
    epuap: "/ugmiedzna/skrytka"
  },
  
  officeHours: [
    { day: "Poniedziałek", hours: "8:00 - 16:00" },
    { day: "Wtorek - Czwartek", hours: "7:30 - 15:30" },
    { day: "Piątek", hours: "7:30 - 14:30" }
  ]
};
