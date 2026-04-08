export const siteConfig = {
  name: "Gmina Miedzna",
  description: "Oficjalny portal informacyjny Urzędu Gminy w Miedznie",
  url: "https://gmina-miedzna.pl",
  
  contact: {
    addressLine1: "ul. 11 Listopada 4",
    addressLine2: "07-106 Miedzna",
    phones: ["(0-25) 691-83-27", "(0-25) 691-83-28"],
    email: "sekretariat@gmina-miedzna.pl",
    nip: "824-126-13-73",
    regon: "000544556",
    epuap: "366ap2kaiu",
    eDoreczenia: "AE:PL-20566-32159-EIVFC-16"
  },
  
  bankAccounts: [
    { name: "Rachunek główny", number: "41 9221 0000 0039 1111 2000 0020" },
    { name: "Opłaty za odbiór odpadów", number: "63 9221 0000 0039 1111 2000 0100" }
  ],

  invoiceData: {
    buyer: {
      title: "NABYWCA",
      name: "Gmina Miedzna",
      address: "ul. 11 Listopada 4\n07-106 Miedzna",
      nip: "824-172-35-14"
    },
    recipient: {
      title: "ODBIORCA",
      name: "Urząd Gminy w Miedznie",
      address: "ul. 11 Listopada 4\n07-106 Miedzna",
      nip: "824-126-13-73"
    }
  },

  officeHours: [
    { day: "Pracujemy od 7.30 do 15.30", hours: "" }
  ]
};
