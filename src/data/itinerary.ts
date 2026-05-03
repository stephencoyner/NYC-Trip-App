// Stephen's NYC week — May 4–8, 2026.
// Home base: 353 6th Ave, Park Slope. Working Mon/Tue at 3 Bryant Park.
// GF/DF throughout. Voice is a literate friend's, not a SaaS app's.

export type StopKind =
  | "coffee"
  | "meal"
  | "museum"
  | "shop"
  | "walk"
  | "bar"
  | "tea"
  | "bookshop"
  | "gallery"
  | "transit"
  | "lodging"
  | "work"
  | "run"
  | "show"
  | "record-shop";

export type Stop = {
  id: string;
  start: string; // ISO local: "2026-05-04T08:30"
  end?: string;
  title: string;
  neighborhood: string;
  kind: StopKind;
  note?: string;
  metaNote?: string;
  address?: string;
  geo?: { lat: number; lng: number };
  fromPrev?: string;
  reservation?: { number: string; party?: number };
  alternates?: Alternate[];
};

export type Alternate = {
  id: string;
  title: string;
  neighborhood: string;
  kind: StopKind;
  reason: string;
  delta: string;
};

export type Day = {
  id: string;
  date: string;
  weekday: string;
  ordinal: string;
  weather: { tempF: number; description: string; glyph: "sun" | "cloud" | "rain" | "part" };
  subtitle?: string;
  stops: Stop[];
};

export const TRIP = {
  city: "New York",
  startDate: "2026-05-04",
  endDate: "2026-05-08",
  timezone: "America/New_York",
  title: "New York, in May",
};

export const DAYS: Day[] = [
  // ─────────────────────────────────────────────
  // MONDAY · work + Park Slope dinner
  // ─────────────────────────────────────────────
  {
    id: "d1",
    date: "2026-05-04",
    weekday: "Monday",
    ordinal: "the fourth of May",
    weather: { tempF: 71, description: "Sunny, dry", glyph: "sun" },
    subtitle: "Work day. F train both ways. Slow night close to home.",
    stops: [
      {
        id: "d1s1",
        start: "2026-05-04T08:00",
        title: "Leave 353 6th Ave · F to Bryant Park",
        neighborhood: "Park Slope",
        kind: "transit",
        note: "Walk east to 7th Ave–9th St. Manhattan-bound F. Boarding here is your real shot at a seat — it fills by Bergen.",
        metaNote: "OMNY taps; weekly cap is $34.",
        fromPrev: "—",
      },
      {
        id: "d1s2",
        start: "2026-05-04T08:40",
        end: "2026-05-04T17:30",
        title: "Work · 3 Bryant Park",
        neighborhood: "Midtown",
        address: "1095 6th Ave",
        kind: "work",
        note: "The 42 St–Bryant Park station empties at the building's front door.",
        fromPrev: "30 min · F train",
      },
      {
        id: "d1s3",
        start: "2026-05-04T17:30",
        end: "2026-05-04T18:15",
        title: "F home",
        neighborhood: "Park Slope",
        kind: "transit",
        note: "Reverse commute. Less crowded than the morning.",
        fromPrev: "—",
      },
      {
        id: "d1s4",
        start: "2026-05-04T19:30",
        end: "2026-05-04T21:00",
        title: "Dinner at Bricolage",
        address: "162 5th Ave",
        neighborhood: "Park Slope",
        kind: "meal",
        note: "Modern Vietnamese. Marked GF menu, the kitchen handles cross-contamination cleanly.",
        metaNote: "the pho dac biet (confirm broth), the lemongrass pork chop, green papaya.",
        fromPrev: "12 min walk · 5th Ave south",
        reservation: { number: "0501", party: 1 },
        alternates: [
          {
            id: "a1",
            title: "Sushi Katsuei",
            neighborhood: "Park Slope",
            kind: "meal",
            reason: "Counter omakase, neighborhood-quiet. Bring tamari from home if you want a margin.",
            delta: "−4 min walk · same hour",
          },
          {
            id: "a2",
            title: "Bogota Latin Bistro",
            neighborhood: "Park Slope",
            kind: "meal",
            reason: "Pan-Latin, marked GF, livelier room without being loud. Churrasco is the move.",
            delta: "+1 min walk · same hour",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // TUESDAY · work + run + low-key
  // ─────────────────────────────────────────────
  {
    id: "d2",
    date: "2026-05-05",
    weekday: "Tuesday",
    ordinal: "the fifth of May",
    weather: { tempF: 80, description: "Warm, possible PM showers", glyph: "part" },
    subtitle: "Work. Three miles in Prospect Park. Eat early, bed early.",
    stops: [
      {
        id: "d2s1",
        start: "2026-05-05T08:00",
        title: "F to Bryant Park · same plan",
        neighborhood: "Park Slope",
        kind: "transit",
        note: "Lightest layer of the week. PM showers possible — the F dumps you underground at both ends.",
        fromPrev: "—",
      },
      {
        id: "d2s2",
        start: "2026-05-05T08:40",
        end: "2026-05-05T17:00",
        title: "Work · 3 Bryant Park",
        neighborhood: "Midtown",
        address: "1095 6th Ave",
        kind: "work",
        fromPrev: "30 min · F train",
      },
      {
        id: "d2s3",
        start: "2026-05-05T17:45",
        end: "2026-05-05T18:30",
        title: "Run · Prospect Park inner loop",
        neighborhood: "Prospect Park",
        kind: "run",
        note: "Enter at Grand Army Plaza. Counterclockwise. 3.35 mi, mostly flat-rolling, car-free.",
        metaNote: "sunset is 7:57 PM — plenty of light.",
        fromPrev: "10 min walk",
      },
      {
        id: "d2s4",
        start: "2026-05-05T19:30",
        end: "2026-05-05T21:00",
        title: "Dinner at Hibino",
        neighborhood: "Cobble Hill",
        address: "333 Henry St",
        kind: "meal",
        note: "Kyoto-style obanzai. Multiple naturally GF small plates, sashimi, grilled fish. Quiet room.",
        fromPrev: "15 min · F to Bergen",
        reservation: { number: "0512", party: 1 },
        alternates: [
          {
            id: "a3",
            title: "Pokee + tea at home",
            neighborhood: "Park Slope",
            kind: "meal",
            reason: "If you'd rather walk back, eat slow, pull out the gongfu set.",
            delta: "stay local · cheaper",
          },
          {
            id: "a4",
            title: "Black Oak · one glass",
            neighborhood: "Park Slope",
            kind: "bar",
            reason: "Small wine bar, conversation-friendly, walk-in easy on a Tuesday. One glass, home by 10.",
            delta: "stay local · 7 min walk",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // WEDNESDAY · the walking day
  // ─────────────────────────────────────────────
  {
    id: "d3",
    date: "2026-05-06",
    weekday: "Wednesday",
    ordinal: "the sixth of May",
    weather: { tempF: 75, description: "Partly cloudy, dry", glyph: "part" },
    subtitle: "SoHo → Nolita → East Village → LES. Pace yourself.",
    stops: [
      {
        id: "d3s1",
        start: "2026-05-06T09:30",
        title: "F to Broadway-Lafayette",
        neighborhood: "Park Slope → SoHo",
        kind: "transit",
        note: "Eat at home. Surface at Houston/Broadway around 10:00.",
        fromPrev: "—",
      },
      {
        id: "d3s2",
        start: "2026-05-06T10:00",
        end: "2026-05-06T10:30",
        title: "C'H'C'M'",
        neighborhood: "NoHo",
        address: "2 Bond St",
        kind: "shop",
        note: "Start with the most curated. Margaret Howell, Auralee, Niuhans, Kaptain Sunshine.",
        fromPrev: "5 min walk",
      },
      {
        id: "d3s3",
        start: "2026-05-06T10:30",
        end: "2026-05-06T11:15",
        title: "Blue in Green",
        neighborhood: "SoHo",
        address: "8 Greene St",
        kind: "shop",
        note: "Best denim selection in the city. Iron Heart, Full Count, Studio D'Artisan, Warehouse.",
        metaNote: "if you're buying one denim piece this week, do it here. Not at Self Edge later.",
        fromPrev: "8 min walk",
      },
      {
        id: "d3s4",
        start: "2026-05-06T11:15",
        end: "2026-05-06T11:35",
        title: "Drake's",
        neighborhood: "SoHo",
        address: "327 Canal St",
        kind: "shop",
        note: "Tailoring + soft accessories.",
        fromPrev: "8 min walk",
      },
      {
        id: "d3s5",
        start: "2026-05-06T11:35",
        end: "2026-05-06T12:30",
        title: "Knickerbocker",
        neighborhood: "SoHo",
        address: "357 Canal St",
        kind: "shop",
        note: "List priority. Try on the chore coats and the corduroys.",
        fromPrev: "1 min walk · next door",
      },
      {
        id: "d3s6",
        start: "2026-05-06T12:30",
        end: "2026-05-06T13:30",
        title: "Lunch at Fish Cheeks",
        neighborhood: "NoHo",
        address: "55 Bond St",
        kind: "meal",
        note: "Thai, allergens marked. Naturally GF: red and massaman curries, grilled whole fish, crab fried rice (sub the soy).",
        fromPrev: "9 min walk",
        reservation: { number: "0612", party: 1 },
        alternates: [
          {
            id: "a5",
            title: "Jajaja Plantas",
            neighborhood: "Lower East Side",
            kind: "meal",
            reason: "Plant-based Mexican, almost everything GF/DF, fast.",
            delta: "+10 min walk",
          },
          {
            id: "a6",
            title: "Springbone Kitchen",
            neighborhood: "Greenwich Village",
            kind: "meal",
            reason: "Paleo bone-broth bowls, eat in 20 min and keep moving.",
            delta: "+8 min · faster",
          },
        ],
      },
      {
        id: "d3s7",
        start: "2026-05-06T13:30",
        end: "2026-05-06T14:15",
        title: "Standard & Strange",
        neighborhood: "NoLita",
        address: "238 Mulberry St",
        kind: "shop",
        note: "The Japanese workwear/heritage zone. Real McCoy's, Niuhans, Yuketen.",
        metaNote: "your longest stop. Budget 45+ min and don't rush.",
        fromPrev: "5 min walk",
      },
      {
        id: "d3s8",
        start: "2026-05-06T14:15",
        end: "2026-05-06T14:30",
        title: "Aimé Leon Dore",
        neighborhood: "NoLita",
        address: "224 Mulberry St",
        kind: "shop",
        note: "Walk-through.",
        fromPrev: "1 min walk",
      },
      {
        id: "d3s9",
        start: "2026-05-06T14:30",
        end: "2026-05-06T14:50",
        title: "Noah",
        neighborhood: "NoLita",
        address: "195 Mulberry St",
        kind: "shop",
        fromPrev: "2 min walk",
      },
      {
        id: "d3s10",
        start: "2026-05-06T14:50",
        end: "2026-05-06T15:15",
        title: "Kith flagship",
        neighborhood: "NoLita",
        address: "337 Lafayette St",
        kind: "shop",
        note: "Quick browse unless something specific catches.",
        fromPrev: "3 min walk",
      },
      {
        id: "d3s11",
        start: "2026-05-06T15:30",
        end: "2026-05-06T16:30",
        title: "A-1 Record Shop",
        neighborhood: "East Village",
        address: "439 E 6th St",
        kind: "record-shop",
        note: "Used-only, dusty, exact vibe. Premier and Pete Rock haunt.",
        metaNote: "ask staff to pull boxes — Italian library and Japanese jazz live in the back crates.",
        fromPrev: "12 min walk east",
        geo: { lat: 40.7253, lng: -73.9847 },
        alternates: [
          {
            id: "a7",
            title: "Stranded Records · if open",
            neighborhood: "East Village",
            kind: "record-shop",
            reason: "Stronger jazz / soul / Brazilian / world section. 4 min from A-1. Smaller shops have been closing — peek through the door first.",
            delta: "+4 min walk",
          },
        ],
      },
      {
        id: "d3s12",
        start: "2026-05-06T16:45",
        end: "2026-05-06T17:15",
        title: "Wythe",
        neighborhood: "Lower East Side",
        address: "59 Orchard St",
        kind: "shop",
        note: "Small, sharp edit.",
        fromPrev: "12 min walk south",
      },
      {
        id: "d3s13",
        start: "2026-05-06T17:15",
        end: "2026-05-06T18:15",
        title: "Self Edge",
        neighborhood: "Lower East Side",
        address: "157 Orchard St",
        kind: "shop",
        note: "Heavyweight raw denim. Iron Heart, Flat Head, Strike Gold.",
        metaNote: "don't double-buy if you bought at Blue in Green. Pick the better staff fit, not both.",
        fromPrev: "5 min walk",
      },
      {
        id: "d3s14",
        start: "2026-05-06T19:00",
        end: "2026-05-06T20:30",
        title: "Dinner at Cervo's",
        neighborhood: "Lower East Side",
        address: "43 Canal St",
        kind: "meal",
        note: "Iberian seafood. Most of the menu naturally GF/DF — grilled fish, octopus, vegetables.",
        metaNote: "sit at the bar, walk-in friendly early.",
        fromPrev: "10 min walk",
        reservation: { number: "0701", party: 1 },
        alternates: [
          {
            id: "a8",
            title: "Wayla",
            neighborhood: "Lower East Side",
            kind: "meal",
            reason: "Thai, marked GF, more vibrant room if Cervo's is full.",
            delta: "+4 min walk · same hour",
          },
        ],
      },
      {
        id: "d3s15",
        start: "2026-05-06T20:45",
        title: "F home · Delancey-Essex",
        neighborhood: "Park Slope",
        kind: "transit",
        note: "30 min on the F. You'll feel it in your feet tomorrow.",
        fromPrev: "5 min walk",
      },
    ],
  },

  // ─────────────────────────────────────────────
  // THURSDAY · museums + Comedy Cellar
  // ─────────────────────────────────────────────
  {
    id: "d4",
    date: "2026-05-07",
    weekday: "Thursday",
    ordinal: "the seventh of May",
    weather: { tempF: 67, description: "Cooler, clear", glyph: "sun" },
    subtitle: "MoMA → Noguchi → Comedy Cellar. Light jacket.",
    stops: [
      {
        id: "d4s1",
        start: "2026-05-07T10:00",
        title: "F to 47–50 Sts–Rockefeller Ctr",
        neighborhood: "Park Slope → Midtown",
        kind: "transit",
        note: "Eat at home. Confirm last night's MoMA timed ticket — ~$30.",
        fromPrev: "—",
      },
      {
        id: "d4s2",
        start: "2026-05-07T10:30",
        end: "2026-05-07T13:30",
        title: "MoMA · Duchamp + 5 + 3",
        neighborhood: "Midtown",
        address: "11 W 53rd St",
        kind: "museum",
        note: "Duchamp first while it's empty. Then 5th-floor painting & sculpture. Then 3rd-floor Architecture & Design — most people skip it; you won't.",
        metaNote: "pick three rooms, slow down. Don't try to do everything.",
        fromPrev: "10 min walk",
        reservation: { number: "0801" },
        geo: { lat: 40.7614, lng: -73.9776 },
      },
      {
        id: "d4s3",
        start: "2026-05-07T13:45",
        end: "2026-05-07T14:45",
        title: "Lunch at Hangawi",
        neighborhood: "Koreatown",
        address: "12 E 32nd St",
        kind: "meal",
        note: "Korean vegetarian temple food. Almost entirely GF/DF. Shoes off, calm zen room.",
        metaNote: "if you want a real meal between museums, this is it. Beyond Sushi is the fast option.",
        fromPrev: "12 min · F to 34 St",
        reservation: { number: "0815", party: 1 },
        alternates: [
          {
            id: "a9",
            title: "Beyond Sushi",
            neighborhood: "Midtown",
            kind: "meal",
            reason: "6 min walk from MoMA, vegan, mostly GF. Eat in 25 min and you've gained an hour.",
            delta: "−15 min · faster",
          },
        ],
      },
      {
        id: "d4s4",
        start: "2026-05-07T15:30",
        end: "2026-05-07T17:30",
        title: "The Noguchi Museum",
        neighborhood: "Long Island City",
        address: "9-01 33rd Rd",
        kind: "museum",
        note: "Indoor/outdoor garden, basalt and stone, paper lanterns, the studio Noguchi designed himself.",
        metaNote: "the gift shop is the only NYC source for the original Noguchi paper lanterns at fair prices.",
        fromPrev: "30 min · E to Court Sq + walk",
        reservation: { number: "0905" },
        geo: { lat: 40.7674, lng: -73.9377 },
      },
      {
        id: "d4s5",
        start: "2026-05-07T18:30",
        end: "2026-05-07T19:15",
        title: "Wander Bleecker · breathe",
        neighborhood: "Greenwich Village",
        kind: "walk",
        note: "Cab from Noguchi to the Village. You've got a real gap before the show — use it.",
        fromPrev: "30 min · cab",
      },
      {
        id: "d4s6",
        start: "2026-05-07T19:30",
        end: "2026-05-07T21:00",
        title: "Dinner at Saigon Shack",
        neighborhood: "Greenwich Village",
        address: "114 MacDougal St",
        kind: "meal",
        note: "Vietnamese, GF pho. Literally next door to the Cellar — no transit between dinner and the show.",
        metaNote: "or Joseph Leonard at 170 Waverly Pl if you want something more of an evening — book it.",
        fromPrev: "—",
        alternates: [
          {
            id: "a10",
            title: "Joseph Leonard",
            neighborhood: "West Village",
            kind: "meal",
            reason: "Bistro, GF accommodating, candlelit. A real dinner for a real night.",
            delta: "+5 min walk · book ahead",
          },
        ],
      },
      {
        id: "d4s7",
        start: "2026-05-07T21:15",
        end: "2026-05-07T22:45",
        title: "Comedy Cellar · 9:30 show",
        neighborhood: "Greenwich Village",
        address: "117 MacDougal St",
        kind: "show",
        note: "Arrive 15 min early. Two-item table minimum — stick to drinks.",
        metaNote: "the lineup posts day-of. Don't expect the marquee names; expect the city's best working comics.",
        fromPrev: "1 min walk · next door",
        reservation: { number: "0930", party: 1 },
      },
      {
        id: "d4s8",
        start: "2026-05-07T23:00",
        title: "Cab home",
        neighborhood: "Park Slope",
        kind: "transit",
        note: "~25 min, ~$30. Take the cab — the F at this hour is slower than it looks.",
        fromPrev: "—",
      },
    ],
  },

  // ─────────────────────────────────────────────
  // FRIDAY · last day · walk + ferry + bars
  // ─────────────────────────────────────────────
  {
    id: "d5",
    date: "2026-05-08",
    weekday: "Friday",
    ordinal: "the eighth of May",
    weather: { tempF: 61, description: "Cool, clear", glyph: "sun" },
    subtitle: "Last day. Walk it. Wine on the river.",
    stops: [
      {
        id: "d5s1",
        start: "2026-05-08T11:30",
        title: "F to 34 St–Herald Sq",
        neighborhood: "Park Slope → Midtown",
        kind: "transit",
        note: "Slow morning at home. Eat. Out the door 11:30.",
        fromPrev: "—",
      },
      {
        id: "d5s2",
        start: "2026-05-08T12:00",
        end: "2026-05-08T12:45",
        title: "Nepenthes",
        neighborhood: "Garment District",
        address: "307 W 38th St",
        kind: "shop",
        note: "List priority. South2 West8, Engineered Garments flagship, Needles. Opens at noon — be there.",
        fromPrev: "8 min walk",
      },
      {
        id: "d5s3",
        start: "2026-05-08T13:00",
        end: "2026-05-08T14:00",
        title: "Lunch at Cho Dang Gol",
        neighborhood: "Koreatown",
        address: "55 W 35th St",
        kind: "meal",
        note: "House-made tofu. Soondubu. Ask for tamari, skip soy-sauce dishes.",
        metaNote: "Ippudo Westside has a GF ramen note but cross-contamination risk. Cho Dang is safer.",
        fromPrev: "5 min walk",
      },
      {
        id: "d5s4",
        start: "2026-05-08T14:15",
        end: "2026-05-08T15:15",
        title: "Walk the High Line · 34 → 14",
        neighborhood: "Chelsea",
        kind: "walk",
        note: "Enter at 34th & 11th. South all the way to Gansevoort — 1.7 mi.",
        metaNote: "stop at every overlook.",
        fromPrev: "8 min walk west",
      },
      {
        id: "d5s5",
        start: "2026-05-08T15:30",
        end: "2026-05-08T16:30",
        title: "Whitney Biennial · optional",
        neighborhood: "Meatpacking",
        address: "99 Gansevoort St",
        kind: "museum",
        note: "Permission, not requirement. Skip if you're saturated from yesterday.",
        metaNote: "the Biennial is the country's most relevant contemporary survey. Worth an hour if you have it.",
        fromPrev: "1 min walk",
        alternates: [
          {
            id: "a11",
            title: "Skip · wander instead",
            neighborhood: "West Village",
            kind: "walk",
            reason: "Two museum days back-to-back is a lot. Use the hour for Hudson and Bleecker.",
            delta: "−1 hr · save energy for tonight",
          },
        ],
      },
      {
        id: "d5s6",
        start: "2026-05-08T16:30",
        end: "2026-05-08T17:15",
        title: "West Village wander · coffee",
        neighborhood: "West Village",
        kind: "walk",
        note: "Hudson → Bleecker → Carmine. Saint Ambroeus has GF cookies if you want one.",
        fromPrev: "—",
      },
      {
        id: "d5s7",
        start: "2026-05-08T17:30",
        end: "2026-05-08T18:00",
        title: "NYC Ferry · East River",
        neighborhood: "Pier 11 → North Williamsburg",
        kind: "transit",
        note: "Top deck. Skyline at golden hour. $4.50, ~25 min.",
        metaNote: "this is the moment of the day.",
        fromPrev: "20 min · 1 to South Ferry + walk",
      },
      {
        id: "d5s8",
        start: "2026-05-08T18:00",
        end: "2026-05-08T18:45",
        title: "Domino Park · esplanade",
        neighborhood: "Williamsburg",
        kind: "walk",
        note: "East River esplanade, Manhattan at sunset from under the Williamsburg Bridge.",
        fromPrev: "—",
      },
      {
        id: "d5s9",
        start: "2026-05-08T19:30",
        end: "2026-05-08T21:30",
        title: "The Four Horsemen",
        neighborhood: "Williamsburg",
        address: "295 Grand St",
        kind: "bar",
        note: "Michelin-starred natural wine, 250+ bottles. Mid-30s creative crowd — your demographic.",
        metaNote: "walk-in: put your name down at 5:30 on the way over, OR show up 9:30 when the first seating clears.",
        fromPrev: "10 min walk",
        alternates: [
          {
            id: "a12",
            title: "Sauced",
            neighborhood: "Williamsburg",
            kind: "bar",
            reason: "No menu, garden-apartment feel, knowledgeable staff. Easy walk-in. 8 min away.",
            delta: "+8 min walk",
          },
          {
            id: "a13",
            title: "BABA on Withers",
            neighborhood: "Williamsburg",
            kind: "bar",
            reason: "Higher energy, backyard, late DJs without being a club. If you want more.",
            delta: "+12 min walk",
          },
        ],
      },
      {
        id: "d5s10",
        start: "2026-05-08T22:00",
        title: "Cab home",
        neighborhood: "Park Slope",
        kind: "transit",
        note: "~25 min, ~$25. Nine hours on your feet — take the cab.",
        fromPrev: "—",
      },
    ],
  },
];
