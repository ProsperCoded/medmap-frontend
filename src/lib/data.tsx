export const pharmacies = [
  // 🟢 Within 20km
  {
    id: 1,
    name: "Pharmacy A - Ikeja",
    lat: 6.6018,
    lng: 3.3515,
    phone: "+234 801 234 5678",
    address: "12 Allen Avenue, Ikeja, Lagos",
    drugs: [
      { name: "Paracetamol", stock: 100 },
      { name: "Ibuprofen", stock: 70 },
    ],
  },
  {
    id: 2,
    name: "Pharmacy B - Ogba",
    lat: 6.626,
    lng: 3.3424,
    phone: "+234 802 345 6789",
    address: "25 Ogba Road, Ogba, Lagos",
    drugs: [
      { name: "Cough Syrup", stock: 50 },
      { name: "Vitamin C", stock: 90 },
    ],
  },
  {
    id: 3,
    name: "Pharmacy C - Maryland",
    lat: 6.5617,
    lng: 3.3676,
    phone: "+234 803 456 7890",
    address: "8 Mobolaji Bank Anthony Way, Maryland, Lagos",
    drugs: [
      { name: "Metformin", stock: 60 },
      { name: "Loratadine", stock: 45 },
    ],
  },

  // 🔴 Outside 20km (approx 30–50km away)
  {
    id: 4,
    name: "Pharmacy D - Epe",
    lat: 6.5823,
    lng: 3.9912,
    phone: "+234 804 567 8901",
    address: "3 Epe Marina Road, Epe, Lagos",
    drugs: [
      { name: "Antacid", stock: 30 },
      { name: "Ciprofloxacin", stock: 25 },
    ],
  },
  {
    id: 5,
    name: "Pharmacy E - Badagry",
    lat: 6.4166,
    lng: 2.8851,
    phone: "+234 805 678 9012",
    address: "10 Topo Road, Badagry, Lagos",
    drugs: [
      { name: "Ibuprofen", stock: 110 },
      { name: "Amoxicillin", stock: 65 },
    ],
  },
  {
    id: 6,
    name: "Pharmacy F - Ibeju-Lekki",
    lat: 6.4329,
    lng: 3.6821,
    phone: "+234 806 789 0123",
    address: "45 Coastal Road, Ibeju-Lekki, Lagos",
    drugs: [
      { name: "Paracetamol", stock: 150 },
      { name: "Malaria Tablets", stock: 80 },
    ],
  },
];
