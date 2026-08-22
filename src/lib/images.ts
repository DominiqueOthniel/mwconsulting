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
