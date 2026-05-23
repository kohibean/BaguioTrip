// Curated Baguio points of interest. Coordinates are real lat/lng so the
// map and any distance logic work out of the box. Categories drive the
// little glyphs in the schedule builder.

export const BAGUIO_CENTER = { lat: 16.4123, lng: 120.5960 };

export const ATTRACTIONS = [
  {
    id: 'burnham-park',
    name: 'Burnham Park',
    category: 'park',
    lat: 16.4106,
    lng: 120.5933,
    blurb: 'The green heart of the city — boating lagoon, bike rentals, and pine-lined paths.',
    suggestedMins: 90
  },
  {
    id: 'session-road',
    name: 'Session Road',
    category: 'food',
    lat: 16.4128,
    lng: 120.5969,
    blurb: 'The main artery for cafes, bakeries, and people-watching. Try the strawberry taho.',
    suggestedMins: 75
  },
  {
    id: 'mines-view',
    name: 'Mines View Park',
    category: 'view',
    lat: 16.4205,
    lng: 120.6300,
    blurb: 'Panoramic overlook of the old Benguet mining gulch and Cordillera ranges.',
    suggestedMins: 45
  },
  {
    id: 'the-mansion',
    name: 'The Mansion',
    category: 'landmark',
    lat: 16.4108,
    lng: 120.6256,
    blurb: 'Official summer residence of the Philippine president, with a grand wrought-iron gate.',
    suggestedMins: 30
  },
  {
    id: 'wright-park',
    name: 'Wright Park',
    category: 'park',
    lat: 16.4118,
    lng: 120.6244,
    blurb: 'The Pool of Pines reflecting promenade, plus the famous pony rides.',
    suggestedMins: 45
  },
  {
    id: 'botanical-garden',
    name: 'Baguio Botanical Garden',
    category: 'park',
    lat: 16.4146,
    lng: 120.6189,
    blurb: 'Igorot village replicas, cool shaded trails, and local handicraft stalls.',
    suggestedMins: 60
  },
  {
    id: 'camp-john-hay',
    name: 'Camp John Hay',
    category: 'view',
    lat: 16.4012,
    lng: 120.6186,
    blurb: 'Former US R&R base — tall pines, the Tree Top adventure, and the Cemetery of Negativism.',
    suggestedMins: 120
  },
  {
    id: 'bencab-museum',
    name: 'BenCab Museum',
    category: 'culture',
    lat: 16.4441,
    lng: 120.5483,
    blurb: 'National Artist BenCab\u2019s gallery and eco-trail overlooking a misty ravine.',
    suggestedMins: 90
  },
  {
    id: 'tam-awan',
    name: 'Tam-awan Village',
    category: 'culture',
    lat: 16.4308,
    lng: 120.5707,
    blurb: 'A reconstructed Cordillera village of traditional huts and working artists.',
    suggestedMins: 75
  },
  {
    id: 'good-shepherd',
    name: 'Good Shepherd Convent',
    category: 'food',
    lat: 16.4197,
    lng: 120.6312,
    blurb: 'Pilgrimage-worthy ube jam and other preserves made by the nuns. Buy early — it sells out.',
    suggestedMins: 30
  },
  {
    id: 'cathedral',
    name: 'Baguio Cathedral',
    category: 'landmark',
    lat: 16.4124,
    lng: 120.5975,
    blurb: 'The rose-pink Our Lady of Atonement Cathedral atop a stairway off Session Road.',
    suggestedMins: 30
  },
  {
    id: 'public-market',
    name: 'Baguio Public Market',
    category: 'food',
    lat: 16.4156,
    lng: 120.5944,
    blurb: 'Strawberries, ube, peanut brittle, woven goods, and fresh highland vegetables.',
    suggestedMins: 60
  }
];

export const CATEGORY_META = {
  park:     { label: 'Park',     glyph: '\u2618' },
  food:     { label: 'Food',     glyph: '\u25C9' },
  view:     { label: 'Viewpoint',glyph: '\u25B2' },
  landmark: { label: 'Landmark', glyph: '\u2691' },
  culture:  { label: 'Culture',  glyph: '\u25C8' }
};
