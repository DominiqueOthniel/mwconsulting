/** Visuels Unsplash, legers, pour ambiance destination (next/image). */

function u(id: string, w = 960) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;
}

export const HERO_IMAGE = u("photo-1436491865332-7a61a109cc05", 1400);

export const DEST_IMAGES: Record<string, string> = {
  Canada: u("photo-1517935706615-2717063c2225"),
  France: u("photo-1502602898657-3e91760cbb34"),
  "Etats-Unis": u("photo-1485871981521-5b1fd3805eee"),
  Allemagne: u("photo-1467269204594-9661b134dd2b"),
  Belgique: u("photo-1559113202-c916b8e44300"),
  "Royaume-Uni": u("photo-1513635269975-59663e0ac1ad"),
  Italie: u("photo-1523906834658-6e24ef2386f9"),
  Espagne: u("photo-1539037116277-4db20889f2d4"),
  "Emirats arabes unis": u("photo-1512453979798-5ea266f8880c"),
  Portugal: u("photo-1555881400-74d7acaacd8b"),
  Suisse: u("photo-1527004013197-933c4bb611b3"),
};

export const FALLBACK_IMAGE = u("photo-1488085061387-422e29b40080");

/** Galeries d ambiance par pays, pour les fiches destination. */
export const DEST_GALLERY: Record<string, string[]> = {
  Canada: [
    u("photo-1503614472-8c93d56e92ce"),
    u("photo-1517935706615-2717063c2225"),
    u("photo-1519832979-6fa011b87667"),
  ],
  France: [
    u("photo-1502602898657-3e91760cbb34"),
    u("photo-1431274172761-fca41d24667f"),
    u("photo-1499856871958-5b9627545d1a"),
  ],
  "Etats-Unis": [
    u("photo-1485871981521-5b1fd3805eee"),
    u("photo-1449034446853-66c86144b0ad"),
    u("photo-1496442226666-8d4d0e62e6e9"),
  ],
  Allemagne: [
    u("photo-1467269204594-9661b134dd2b"),
    u("photo-1599946347371-68eb71b16afc"),
    u("photo-1560969184-10fe8719e047"),
  ],
  Belgique: [
    u("photo-1559113202-c916b8e44300"),
    u("photo-1541849546-216549ae216d"),
    u("photo-1491557345352-5929e343eb89"),
  ],
  "Royaume-Uni": [
    u("photo-1513635269975-59663e0ac1ad"),
    u("photo-1486299267070-83823f5448dd"),
    u("photo-1520986606214-8b456906c813"),
  ],
  Italie: [
    u("photo-1523906834658-6e24ef2386f9"),
    u("photo-1515542622106-78bda8ba0e5b"),
    u("photo-1552832230-c0197dd311b5"),
  ],
  Espagne: [
    u("photo-1539037116277-4db20889f2d4"),
    u("photo-1558642452-9d2a7deb7f62"),
    u("photo-1504019347908-b45e9031ff45"),
  ],
  "Emirats arabes unis": [
    u("photo-1512453979798-5ea266f8880c"),
    u("photo-1518684079-3c830dcef090"),
    u("photo-1546412414-e1885259563a"),
  ],
  Portugal: [
    u("photo-1555881400-74d7acaacd8b"),
    u("photo-1555881400-69d5bc0c1dd5"),
    u("photo-1526392060635-9d6019884377"),
  ],
  Suisse: [
    u("photo-1527004013197-933c4bb611b3"),
    u("photo-1530122037265-a5f1f91d3b99"),
    u("photo-1506905925346-21bda4d32df4"),
  ],
};
