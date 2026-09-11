'use strict';

const express = require('express');

const router = express.Router();

// ── Mock hotel data ───────────────────────────────────────────────────────────
const HOTELS = [
  // ── Ahmedabad ────────────────────────────────────────────────────────────────
  {
    id: 'hotel-001',
    name: 'House of MG',
    city: 'Ahmedabad',
    state: 'Gujarat',
    address: 'Opposite Sidi Saiyyed Mosque, Lal Darwaja, Ahmedabad',
    lat: 23.0238,
    lng: 72.5822,
    starRating: 4,
    pricePerNight: 4500,
    budget: 'Premium',
    amenities: ['Heritage Property', 'Restaurant', 'Rooftop Café', 'Spa', 'Free WiFi', 'Valet Parking'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    rating: 4.7,
    reviewCount: 1240,
    description: 'A restored 1924 heritage mansion in the heart of the walled city, blending colonial architecture with Gujarati hospitality.',
    checkIn: '14:00',
    checkOut: '11:00',
    policies: ['No smoking', 'Pets not allowed'],
    nearbyAttractions: ['Sidi Saiyyed Mosque', 'Bhadra Fort', 'Manek Chowk'],
  },
  {
    id: 'hotel-002',
    name: 'Zostel Ahmedabad',
    city: 'Ahmedabad',
    state: 'Gujarat',
    address: 'Near Ellis Bridge, Ahmedabad',
    lat: 23.0245,
    lng: 72.5676,
    starRating: 2,
    pricePerNight: 600,
    budget: 'Budget',
    amenities: ['Dormitory & Private Rooms', 'Common Kitchen', 'Free WiFi', 'Lockers', 'Chill Zone'],
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800'],
    coverImage: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
    rating: 4.3,
    reviewCount: 560,
    description: 'A vibrant, social hostel perfect for backpackers and budget travellers exploring Ahmedabad.',
    checkIn: '12:00',
    checkOut: '10:00',
    policies: ['Alcohol allowed in common areas', 'Check-in ID mandatory'],
    nearbyAttractions: ['Sabarmati Ashram', 'Riverfront', 'Ellis Bridge'],
  },
  // ── Jaipur ───────────────────────────────────────────────────────────────────
  {
    id: 'hotel-003',
    name: 'Samode Haveli',
    city: 'Jaipur',
    state: 'Rajasthan',
    address: 'Gangapole, Jaipur',
    lat: 26.9260,
    lng: 75.8178,
    starRating: 5,
    pricePerNight: 12000,
    budget: 'Luxury',
    amenities: ['Heritage Pool', 'Fine Dining', 'Spa', 'Rooftop Terrace', 'Butler Service', 'Free WiFi'],
    images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'],
    coverImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    rating: 4.9,
    reviewCount: 876,
    description: 'A palatial 475-year-old haveli with frescoed walls, mirror-inlaid chambers, and a stunning pool courtyard.',
    checkIn: '14:00',
    checkOut: '12:00',
    policies: ['No smoking indoors', 'Children welcome'],
    nearbyAttractions: ['City Palace', 'Hawa Mahal', 'Jantar Mantar'],
  },
  {
    id: 'hotel-004',
    name: 'Zostel Jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
    address: 'Bhagwan Das Road, Near MI Road, Jaipur',
    lat: 26.9174,
    lng: 75.8145,
    starRating: 2,
    pricePerNight: 650,
    budget: 'Budget',
    amenities: ['Dorms & Private Rooms', 'Rooftop Chill Area', 'Free WiFi', 'Bicycle Rental', 'Tour Desk'],
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800'],
    coverImage: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
    rating: 4.4,
    reviewCount: 720,
    description: 'Popular backpacker hostel in central Jaipur with a great rooftop social space.',
    checkIn: '12:00',
    checkOut: '10:00',
    policies: ['No outside food in rooms'],
    nearbyAttractions: ['MI Road', 'Bapu Bazaar', 'Albert Hall Museum'],
  },
  // ── Udaipur ──────────────────────────────────────────────────────────────────
  {
    id: 'hotel-005',
    name: 'Taj Lake Palace',
    city: 'Udaipur',
    state: 'Rajasthan',
    address: 'Lake Pichola, Udaipur',
    lat: 24.5768,
    lng: 73.6800,
    starRating: 5,
    pricePerNight: 35000,
    budget: 'Luxury',
    amenities: ['Lake Views', 'Infinity Pool', 'Multiple Fine Dining', 'Spa', 'Boat Transfer', 'Butler Service'],
    images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'],
    coverImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
    rating: 4.9,
    reviewCount: 2100,
    description: 'Floating on Lake Pichola, this 18th-century marble palace is one of the world\'s most romantic hotels.',
    checkIn: '14:00',
    checkOut: '12:00',
    policies: ['No children under 12', 'Formal dress at dinner'],
    nearbyAttractions: ['City Palace', 'Jag Mandir', 'Saheliyon Ki Bari'],
  },
  // ── Varanasi ─────────────────────────────────────────────────────────────────
  {
    id: 'hotel-006',
    name: 'BrijRama Palace',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    address: 'Darbhanga Ghat, Varanasi',
    lat: 25.3072,
    lng: 83.0113,
    starRating: 5,
    pricePerNight: 14000,
    budget: 'Luxury',
    amenities: ['Ganga-View Rooms', 'Heritage Dining', 'Spa', 'Yoga Sessions', 'Aarti Viewing Deck'],
    images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'],
    coverImage: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
    rating: 4.8,
    reviewCount: 645,
    description: 'An 18th-century palace right on the Ganges ghats, offering unrivalled views of the spiritual heart of Varanasi.',
    checkIn: '14:00',
    checkOut: '12:00',
    policies: ['No alcohol on premises', 'Spiritual dress code expected'],
    nearbyAttractions: ['Dashashwamedh Ghat', 'Kashi Vishwanath Temple', 'Manikarnika Ghat'],
  },
  // ── Goa ──────────────────────────────────────────────────────────────────────
  {
    id: 'hotel-007',
    name: 'Alila Diwa Goa',
    city: 'Goa',
    state: 'Goa',
    address: 'Majorda Beach, South Goa',
    lat: 15.2827,
    lng: 73.9480,
    starRating: 5,
    pricePerNight: 11000,
    budget: 'Luxury',
    amenities: ['Infinity Pool', 'Private Beach Access', 'Spa', 'Water Sports', 'Fine Dining', 'Kids Club'],
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'],
    coverImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    rating: 4.8,
    reviewCount: 1560,
    description: 'A luxurious Goan resort set among paddy fields, offering a serene alternative to the busy north.',
    checkIn: '15:00',
    checkOut: '11:00',
    policies: ['Adults only pool', 'Swimwear only at pool'],
    nearbyAttractions: ['Colva Beach', 'Margao Market', 'Cabo de Rama Fort'],
  },
  {
    id: 'hotel-008',
    name: 'The Byke Old Anchor Goa',
    city: 'Goa',
    state: 'Goa',
    address: 'Calangute, North Goa',
    lat: 15.5439,
    lng: 73.7545,
    starRating: 3,
    pricePerNight: 2800,
    budget: 'Moderate',
    amenities: ['Pool', 'Restaurant', 'Free WiFi', 'Beach Shuttle', 'Bar'],
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
    coverImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    rating: 4.2,
    reviewCount: 980,
    description: 'A comfortable mid-range hotel in the heart of Calangute, ideal for beach lovers on a moderate budget.',
    checkIn: '14:00',
    checkOut: '11:00',
    policies: ['Pets not allowed', 'Outside food allowed'],
    nearbyAttractions: ['Calangute Beach', 'Baga Beach', 'Saturday Night Market'],
  },
];

// ── GET /api/hotels ───────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  try {
    let hotels = [...HOTELS];
    const { city, budget, minRating, maxPrice, sort } = req.query;

    if (city) {
      hotels = hotels.filter((h) => h.city.toLowerCase() === city.toLowerCase());
    }

    if (budget) {
      hotels = hotels.filter((h) => h.budget.toLowerCase() === budget.toLowerCase());
    }

    if (minRating) {
      hotels = hotels.filter((h) => h.rating >= Number(minRating));
    }

    if (maxPrice) {
      hotels = hotels.filter((h) => h.pricePerNight <= Number(maxPrice));
    }

    if (sort === 'price_asc') hotels.sort((a, b) => a.pricePerNight - b.pricePerNight);
    else if (sort === 'price_desc') hotels.sort((a, b) => b.pricePerNight - a.pricePerNight);
    else if (sort === 'rating') hotels.sort((a, b) => b.rating - a.rating);

    res.json({ success: true, count: hotels.length, hotels });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
});

// ── GET /api/hotels/:id ───────────────────────────────────────────────────────
router.get('/:id', (req, res) => {
  const hotel = HOTELS.find((h) => h.id === req.params.id);
  if (!hotel) return res.status(404).json({ error: 'Hotel not found' });
  res.json({ success: true, hotel });
});

module.exports = router;
