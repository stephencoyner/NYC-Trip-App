// Five days in New York: 4–8 May 2026.
// Hardcoded for one trip. Edit by hand. The voice is a friend's, not a SaaS app's.

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
  | "lodging";

export type Stop = {
  id: string;
  start: string; // ISO local: "2026-05-04T08:30"
  end?: string;  // ISO local; absent = point-in-time
  title: string;
  neighborhood: string;
  kind: StopKind;
  note?: string;        // one italic sentence
  metaNote?: string;    // optional gentle aside, e.g. "the egg salad, nothing else"
  address?: string;
  // Static map snippet center, optional.
  geo?: { lat: number; lng: number };
  // Distance / mode from the previous stop, hand-tuned.
  fromPrev?: string;    // e.g. "8 min walk · 4 blocks"
  reservation?: { number: string; party?: number };
  alternates?: Alternate[];
};

export type Alternate = {
  id: string;
  title: string;
  neighborhood: string;
  kind: StopKind;
  reason: string; // one italic sentence
  delta: string;  // "+6 min walk · 1 stop earlier"
};

export type Day = {
  id: string;
  date: string;        // "2026-05-04"
  weekday: string;     // "Monday"
  ordinal: string;     // "the fourth of May"
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
  {
    id: "d1",
    date: "2026-05-04",
    weekday: "Monday",
    ordinal: "the fourth of May",
    weather: { tempF: 62, description: "Clear", glyph: "sun" },
    subtitle: "Land soft. East Village, slow.",
    stops: [
      {
        id: "d1s1",
        start: "2026-05-04T11:20",
        end: "2026-05-04T12:10",
        title: "Wheels down · LGA",
        neighborhood: "Queens",
        kind: "transit",
        note: "Take the LaGuardia Link Q70 to the 7. Faster than a cab at this hour.",
        fromPrev: "—",
      },
      {
        id: "d1s2",
        start: "2026-05-04T13:00",
        title: "Drop bags · Bowery House",
        neighborhood: "Lower East Side",
        kind: "lodging",
        address: "220 Bowery",
        note: "Don't unpack. Just leave the case and go.",
        fromPrev: "45 min · subway",
        reservation: { number: "0314" },
      },
      {
        id: "d1s3",
        start: "2026-05-04T13:30",
        end: "2026-05-04T14:30",
        title: "Lunch at Russ & Daughters Café",
        neighborhood: "Lower East Side",
        kind: "meal",
        address: "127 Orchard St",
        note: "Sit at the counter. Order the Shtetl with a glass of egg cream.",
        metaNote: "the egg salad, nothing else, on a poppy bialy.",
        fromPrev: "5 min walk · 2 blocks",
        reservation: { number: "0418", party: 1 },
        geo: { lat: 40.7204, lng: -73.9890 },
        alternates: [
          {
            id: "a1",
            title: "Scarr's Pizza",
            neighborhood: "Lower East Side",
            kind: "meal",
            reason: "If you'd rather a slice and a Coke than a counter ritual.",
            delta: "+3 min walk · same hour",
          },
          {
            id: "a2",
            title: "Yonah Schimmel Knish Bakery",
            neighborhood: "Lower East Side",
            kind: "meal",
            reason: "Older than the building. A potato knish, no theatre.",
            delta: "+2 min walk · faster",
          },
        ],
      },
      {
        id: "d1s4",
        start: "2026-05-04T15:00",
        end: "2026-05-04T15:45",
        title: "Sey Coffee · pourover",
        neighborhood: "Lower East Side",
        kind: "coffee",
        note: "The Burundi if it's on. Drink it black, sit by the window.",
        fromPrev: "8 min walk · 3 blocks south",
        geo: { lat: 40.7180, lng: -73.9890 },
      },
      {
        id: "d1s5",
        start: "2026-05-04T16:00",
        end: "2026-05-04T17:30",
        title: "Wandering: Rivington → Orchard → Forsyth",
        neighborhood: "Lower East Side",
        kind: "walk",
        note: "Window-shop. Don't buy anything yet. The point is the light.",
        fromPrev: "—",
      },
      {
        id: "d1s6",
        start: "2026-05-04T17:45",
        end: "2026-05-04T18:30",
        title: "Tompkins Square · south side bench",
        neighborhood: "East Village",
        kind: "walk",
        note: "Sit on the south side. Watch the dogs.",
        fromPrev: "12 min walk · 6 blocks north",
      },
      {
        id: "d1s7",
        start: "2026-05-04T19:00",
        end: "2026-05-04T20:30",
        title: "Dinner at Wildair",
        neighborhood: "Lower East Side",
        kind: "meal",
        address: "142 Orchard St",
        note: "Walk-in by 7. Order the trout, the onion, and one glass of something orange.",
        fromPrev: "10 min walk · 5 blocks south",
        reservation: { number: "0512", party: 1 },
        alternates: [
          {
            id: "a3",
            title: "Cervo's",
            neighborhood: "Lower East Side",
            kind: "meal",
            reason: "Portuguese, smaller, easier walk-in. The clams are the move.",
            delta: "−2 min walk · same hour",
          },
        ],
      },
      {
        id: "d1s8",
        start: "2026-05-04T21:00",
        end: "2026-05-04T22:00",
        title: "Attaboy (knock twice)",
        neighborhood: "Lower East Side",
        kind: "bar",
        note: "No menu. Tell them what you're in the mood for. One drink, then home.",
        fromPrev: "4 min walk · 1 block",
      },
    ],
  },

  {
    id: "d2",
    date: "2026-05-05",
    weekday: "Tuesday",
    ordinal: "the fifth of May",
    weather: { tempF: 66, description: "Partly cloudy", glyph: "part" },
    subtitle: "Museums and the long walk down.",
    stops: [
      {
        id: "d2s1",
        start: "2026-05-05T08:00",
        end: "2026-05-05T08:45",
        title: "Devoción · oat cortado",
        neighborhood: "Flatiron",
        kind: "coffee",
        address: "25 E 20th St",
        note: "Morning light through the back wall. Sit at the long table.",
        fromPrev: "20 min · subway",
      },
      {
        id: "d2s2",
        start: "2026-05-05T09:30",
        end: "2026-05-05T11:30",
        title: "MoMA · Florine Stettheimer, floor 5",
        neighborhood: "Midtown",
        kind: "museum",
        address: "11 W 53rd St",
        note: "Give it time. Skip the photography wing — come back for it Thursday.",
        metaNote: "two hours is the right amount; ninety minutes is not.",
        fromPrev: "12 min walk · uptown",
        reservation: { number: "0531" },
        geo: { lat: 40.7614, lng: -73.9776 },
        alternates: [
          {
            id: "a4",
            title: "The Frick (newly reopened)",
            neighborhood: "Upper East Side",
            kind: "museum",
            reason: "Vermeer's Officer and Laughing Girl is alone worth the trip.",
            delta: "+18 min · uptown",
          },
          {
            id: "a5",
            title: "Neue Galerie + Café Sabarsky",
            neighborhood: "Upper East Side",
            kind: "museum",
            reason: "Klimt and a Sachertorte. A quieter morning altogether.",
            delta: "+22 min · uptown",
          },
        ],
      },
      {
        id: "d2s3",
        start: "2026-05-05T12:00",
        end: "2026-05-05T13:15",
        title: "Lunch at Café Sabarsky",
        neighborhood: "Upper East Side",
        kind: "meal",
        note: "Goulash, a small Riesling, the apricot strudel. No phone at the table.",
        fromPrev: "30 min · uptown bus",
        reservation: { number: "0612", party: 1 },
      },
      {
        id: "d2s4",
        start: "2026-05-05T13:45",
        end: "2026-05-05T16:00",
        title: "Walk south through Central Park · the long way",
        neighborhood: "Central Park",
        kind: "walk",
        note: "East side first, around the reservoir, then west across the Bow Bridge.",
        metaNote: "two hours, no shortcuts, no headphones.",
        fromPrev: "—",
      },
      {
        id: "d2s5",
        start: "2026-05-05T16:30",
        end: "2026-05-05T17:30",
        title: "Drake's NYC + The Armoury",
        neighborhood: "NoHo",
        kind: "shop",
        note: "Look at the linen, leave with nothing. The point is the look.",
        fromPrev: "25 min · subway",
      },
      {
        id: "d2s6",
        start: "2026-05-05T18:00",
        end: "2026-05-05T19:00",
        title: "Tea at Setsugekka",
        neighborhood: "East Village",
        kind: "tea",
        address: "74 E 7th St",
        note: "The hojicha. Sit cross-legged at the low table if it's free.",
        fromPrev: "12 min walk · 8 blocks east",
      },
      {
        id: "d2s7",
        start: "2026-05-05T20:00",
        end: "2026-05-05T22:00",
        title: "Dinner at Estela",
        neighborhood: "NoLita",
        kind: "meal",
        address: "47 E Houston St",
        note: "The endive with anchovy. The burrata. One pasta. Stop there.",
        fromPrev: "10 min walk · 6 blocks west",
        reservation: { number: "0701", party: 1 },
      },
    ],
  },

  {
    id: "d3",
    date: "2026-05-06",
    weekday: "Wednesday",
    ordinal: "the sixth of May",
    weather: { tempF: 64, description: "Clear", glyph: "sun" },
    subtitle: "Brooklyn day. Slow morning, river afternoon.",
    stops: [
      {
        id: "d3s1",
        start: "2026-05-06T08:30",
        end: "2026-05-06T09:15",
        title: "Sey Coffee · Brooklyn",
        neighborhood: "East Williamsburg",
        kind: "coffee",
        address: "85 Bogart St",
        note: "Take the L to Morgan. Sit by the roaster.",
        fromPrev: "30 min · subway",
        geo: { lat: 40.7062, lng: -73.9333 },
      },
      {
        id: "d3s2",
        start: "2026-05-06T09:45",
        end: "2026-05-06T11:00",
        title: "Front General Store · slow browse",
        neighborhood: "DUMBO",
        kind: "shop",
        address: "143 Front St",
        note: "Nakata-san's edit. Pick up one Iris Hantverk brush. Nothing else.",
        fromPrev: "25 min · subway",
        alternates: [
          {
            id: "a6",
            title: "P.F. Candle Co. + Kinfolk Outpost",
            neighborhood: "Williamsburg",
            kind: "shop",
            reason: "Closer to coffee, similar register, less ceremony.",
            delta: "−12 min · stay in BK",
          },
        ],
      },
      {
        id: "d3s3",
        start: "2026-05-06T11:00",
        end: "2026-05-06T12:30",
        title: "Brooklyn Bridge Park · walk to Pier 6",
        neighborhood: "Brooklyn Heights",
        kind: "walk",
        note: "Down through the Heights, across the promenade, along the river to Pier 6.",
        fromPrev: "8 min walk · 4 blocks south",
      },
      {
        id: "d3s4",
        start: "2026-05-06T13:00",
        end: "2026-05-06T14:30",
        title: "Lunch at Lilia",
        neighborhood: "Williamsburg",
        kind: "meal",
        address: "567 Union Ave",
        note: "Mafaldine with pink peppercorn. The soft-serve after, no question.",
        fromPrev: "20 min · subway",
        reservation: { number: "0814", party: 1 },
        geo: { lat: 40.7170, lng: -73.9510 },
      },
      {
        id: "d3s5",
        start: "2026-05-06T15:00",
        end: "2026-05-06T16:00",
        title: "Spoonbill & Sugartown Books",
        neighborhood: "Williamsburg",
        kind: "bookshop",
        note: "The art books in the back room. Buy the one you almost put down.",
        fromPrev: "5 min walk · 3 blocks",
      },
      {
        id: "d3s6",
        start: "2026-05-06T16:30",
        end: "2026-05-06T18:00",
        title: "Domino Park · river bench",
        neighborhood: "Williamsburg",
        kind: "walk",
        note: "Walk to the river. Sit. Watch the East River for a full hour.",
        fromPrev: "10 min walk · 6 blocks west",
      },
      {
        id: "d3s7",
        start: "2026-05-06T19:30",
        end: "2026-05-06T21:30",
        title: "Dinner at Misi",
        neighborhood: "Williamsburg",
        kind: "meal",
        address: "329 Kent Ave",
        note: "Sit at the pasta counter. Two pastas. Whatever's tomato.",
        fromPrev: "15 min walk",
        reservation: { number: "0903", party: 1 },
      },
    ],
  },

  {
    id: "d4",
    date: "2026-05-07",
    weekday: "Thursday",
    ordinal: "the seventh of May",
    weather: { tempF: 60, description: "Light rain", glyph: "rain" },
    subtitle: "Gallery day. Linen, a bookstore, a bar.",
    stops: [
      {
        id: "d4s1",
        start: "2026-05-07T09:00",
        end: "2026-05-07T09:45",
        title: "Abraço · espresso, no chairs",
        neighborhood: "East Village",
        kind: "coffee",
        address: "81 E 7th St",
        note: "Stand at the counter. The olive-oil cake.",
        fromPrev: "5 min walk",
      },
      {
        id: "d4s2",
        start: "2026-05-07T10:15",
        end: "2026-05-07T12:30",
        title: "Chelsea galleries · the W 24th block",
        neighborhood: "Chelsea",
        kind: "gallery",
        note: "Gagosian, Pace, Hauser & Wirth, in that order. Skip anything that asks you to scan.",
        metaNote: "if it's raining, do this slower, not faster.",
        fromPrev: "20 min · subway",
        alternates: [
          {
            id: "a7",
            title: "The Whitney instead",
            neighborhood: "Meatpacking",
            kind: "museum",
            reason: "If the rain settles in. Indoors, the river view from floor 8.",
            delta: "−5 min walk · drier",
          },
        ],
      },
      {
        id: "d4s3",
        start: "2026-05-07T13:00",
        end: "2026-05-07T14:00",
        title: "Lunch at La Mercerie",
        neighborhood: "SoHo",
        kind: "meal",
        address: "53 Howard St",
        note: "The buckwheat crêpe. Sit by the window onto Howard.",
        fromPrev: "20 min · subway",
        reservation: { number: "1011", party: 1 },
      },
      {
        id: "d4s4",
        start: "2026-05-07T14:30",
        end: "2026-05-07T15:30",
        title: "McNally Jackson + Dashwood Books",
        neighborhood: "NoLita",
        kind: "bookshop",
        note: "McNally first for fiction, Dashwood for the photo monographs. Buy from Dashwood.",
        fromPrev: "8 min walk · 4 blocks",
      },
      {
        id: "d4s5",
        start: "2026-05-07T16:00",
        end: "2026-05-07T17:00",
        title: "Tea Drunk · gongfu pour",
        neighborhood: "East Village",
        kind: "tea",
        address: "123 E 7th St",
        note: "Order the Wuyi rock oolong by the gaiwan. Eight steeps.",
        metaNote: "this is the stop the rest of the day is built around.",
        fromPrev: "15 min · subway",
        geo: { lat: 40.7273, lng: -73.9854 },
      },
      {
        id: "d4s6",
        start: "2026-05-07T18:00",
        end: "2026-05-07T19:00",
        title: "Walk Houston → Bowery → home",
        neighborhood: "NoLita / LES",
        kind: "walk",
        note: "Slow. The city is at its best at six p.m. in May.",
        fromPrev: "—",
      },
      {
        id: "d4s7",
        start: "2026-05-07T20:00",
        end: "2026-05-07T21:30",
        title: "Dinner at Via Carota",
        neighborhood: "West Village",
        kind: "meal",
        address: "51 Grove St",
        note: "Walk in, take the bar. The svizzerina, the green salad, a glass of Etna Rosso.",
        fromPrev: "20 min · subway",
        reservation: { number: "1201", party: 1 },
      },
    ],
  },

  {
    id: "d5",
    date: "2026-05-08",
    weekday: "Friday",
    ordinal: "the eighth of May",
    weather: { tempF: 68, description: "Clear", glyph: "sun" },
    subtitle: "Last day. Don't try to fit more in.",
    stops: [
      {
        id: "d5s1",
        start: "2026-05-08T08:30",
        end: "2026-05-08T09:30",
        title: "Felix Roasting Co. · final coffee",
        neighborhood: "NoMad",
        kind: "coffee",
        address: "450 Park Ave South",
        note: "The room is too pretty for a Tuesday. Save it for the last day.",
        fromPrev: "20 min · subway",
      },
      {
        id: "d5s2",
        start: "2026-05-08T10:00",
        end: "2026-05-08T11:30",
        title: "Three Lives & Co. · slow morning",
        neighborhood: "West Village",
        kind: "bookshop",
        address: "154 W 10th St",
        note: "Ask Toby what he'd recommend. Buy that one.",
        fromPrev: "15 min · subway",
        geo: { lat: 40.7345, lng: -74.0027 },
      },
      {
        id: "d5s3",
        start: "2026-05-08T12:00",
        end: "2026-05-08T13:30",
        title: "Lunch at Buvette",
        neighborhood: "West Village",
        kind: "meal",
        address: "42 Grove St",
        note: "The croque, the soft eggs, a glass of something cold.",
        fromPrev: "5 min walk · 2 blocks",
        reservation: { number: "1314", party: 1 },
      },
      {
        id: "d5s4",
        start: "2026-05-08T14:00",
        end: "2026-05-08T15:30",
        title: "Walk the High Line · 14th to 30th",
        neighborhood: "Chelsea",
        kind: "walk",
        note: "Slow. Stop at every overlook. This is the last walk of the trip.",
        fromPrev: "10 min walk · 6 blocks",
      },
      {
        id: "d5s5",
        start: "2026-05-08T16:00",
        end: "2026-05-08T17:00",
        title: "Bemelmans · one martini",
        neighborhood: "Upper East Side",
        kind: "bar",
        address: "35 E 76th St",
        note: "Sit in the back banquette. Order the martini stirred, twist.",
        metaNote: "the piano starts at 5:30. Time it.",
        fromPrev: "30 min · subway",
        alternates: [
          {
            id: "a8",
            title: "King Cole Bar instead",
            neighborhood: "Midtown",
            kind: "bar",
            reason: "Closer to the airport, the Maxfield Parrish mural, a Red Snapper.",
            delta: "−15 min · midtown",
          },
        ],
      },
      {
        id: "d5s6",
        start: "2026-05-08T18:00",
        title: "Pick up bags · home",
        neighborhood: "Lower East Side",
        kind: "lodging",
        note: "Don't linger. The cab will be slower than you think.",
        fromPrev: "30 min · subway",
      },
      {
        id: "d5s7",
        start: "2026-05-08T20:30",
        title: "Wheels up · LGA",
        neighborhood: "Queens",
        kind: "transit",
        note: "You're allowed to come back next year.",
        fromPrev: "60 min · cab",
      },
    ],
  },
];
