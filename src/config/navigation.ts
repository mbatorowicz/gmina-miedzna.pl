// src/config/navigation.ts
// Single Source of Truth (SSOT) bazy nawigacyjnej

export interface NavItem {
  label: string;
  href?: string;
  isMegaMenu?: boolean;
  children?: NavItem[];
}

export const mainNavigation: NavItem[] = [
  {
    label: "Gmina",
    children: [
      { label: "Plan Ogólny Gminy Miedzna", href: "/gmina/plan-ogolny" },
      { 
        label: "JEDNOSTKI ORGANIZACYJNE",
        children: [
          { label: "Szkoła Podstawowa im. Tadeusza Kościuszki w Miedznie", href: "/gmina/szkola" },
          { label: "Gminny Ośrodek Pomocy Społecznej w Miedznie", href: "/gmina/gops" },
          { label: "Gminne Przedszkole w Miedznie", href: "/gmina/przedszkole" },
          { label: "Gminna Biblioteka Publiczna w Miedznie", href: "/gmina/biblioteka" },
        ]
      },
      { 
        label: "WŁADZE GMINY", 
        children: [
           { label: "Wójt Gminy", href: "/gmina/wojt" },
           { label: "Rada Gminy", href: "/gmina/rada" },
        ]
      },
      { label: "Zarządzenia", href: "/gmina/zarzadzenia" },
      { 
        label: "SAMORZĄD", 
        children: [
          { label: "Uchwały", href: "/gmina/uchwaly" },
          { label: "Raport o stanie Gminy", href: "/gmina/raport" }
        ]
      },
      { label: "Deklaracja dostępności", href: "/gmina/deklaracja-dostepnosci" },
      { label: "Sesje Rady Gminy", href: "/gmina/sesje" },
      { 
        label: "PLIKI DO POBRANIA", 
        children: [
          { label: "Wnioski i druki", href: "/gmina/druki" }
        ]
      },
      { label: "Sołectwa", href: "/gmina/solectwa" },
      { label: "Inwestycje", href: "/gmina/inwestycje" },
      { label: "Struktura Urzędu Gminy", href: "/gmina/struktura" },
      { 
        label: "RODO", 
        children: [
           { label: "Klauzula informacyjna", href: "/gmina/klauzula-rodo" }
        ]
      },
      { label: "Powiadomienia SMS", href: "/gmina/sms" },
    ]
  },
  {
    label: "Gospodarka odpadami",
    isMegaMenu: true,
    children: [
      { label: "Przedsiębiorca odbierający odpady komunalne z terenu Gminy Miedzna", href: "/odpady/przedsiebiorca" },
      { label: "Nieczystości ciekłe", href: "/odpady/nieczystosci" },
      { label: "Informacje o osiągniętych poziomach recyklingu", href: "/odpady/recykling" },
      { label: "Rejestr działalności regulowanej", href: "/odpady/rejestr" },
      { label: "Prawo", href: "/odpady/prawo" },
      { label: "PSZOK", href: "/odpady/pszok" },
      { label: "Stawki opłat", href: "/odpady/stawki" },
      { label: "Analiza gospodarki odpadami", href: "/odpady/analiza" },
      { label: "Harmonogram odbioru odpadów", href: "/odpady/harmonogram" },
      { label: "Deklaracja o wysokości opłaty za gospodarowanie odpadami komunalnymi", href: "/odpady/deklaracja" },
      { label: "Informacja o zbierających zużyty sprzęt elektryczny i elektroniczny", href: "/odpady/zuzyty-sprzet" },
      { label: "Informacja dotycząca odbioru odpadów z działalności rolniczej", href: "/odpady/rolnictwo" },
    ]
  },
  { label: "Kontakt", href: "/kontakt" },
  { label: "BIP", href: "https://bip.gmina-miedzna.pl/" },
];
