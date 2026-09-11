'use strict';

const express = require('express');

const router = express.Router();

// ── Mock restaurant data ──────────────────────────────────────────────────────
const RESTAURANTS = [
  // ── Ahmedabad ────────────────────────────────────────────────────────────────
  {
    id: 'rest-001',
    name: 'Agashiye',
    city: 'Ahmedabad',
    state: 'Gujarat',
    address: 'House of MG, Lal Darwaja, Ahmedabad',
    lat: 23.0238,
    lng: 72.5822,
    cuisine: ['Gujarati', 'Thali'],
    isVeg: true,
    priceForTwo: 1200,
    rating: 4.8,
    reviewCount: 2300,
    timings: '12:00 PM – 3:00 PM, 7:00 PM – 11:00 PM',
    specialities: ['Traditional Gujarati Thali', 'Undhiyu', 'Shrikhand', 'Kadhi'],
    images: ['https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800'],
    coverImage: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800',
    mustTry: 'The Gujarati Thali – 30+ dishes served on a bronze thali on a rooftop terrace.',
    tags: ['rooftop', 'thali', 'heritage', 'iconic'],
  },
  {
    id: 'rest-002',
    name: 'Manek Chowk Night Market',
    city: 'Ahmedabad',
    state: 'Gujarat',
    address: 'Manek Chowk, Old City, Ahmedabad',
    lat: 23.0254,
    lng: 72.5878,
    cuisine: ['Street Food', 'Gujarati', 'Snacks'],
    isVeg: true,
    priceForTwo: 200,
    rating: 4.6,
    reviewCount: 5600,
    timings: '10:00 PM – 2:00 AM',
    specialities: ['Pav Bhaji', 'Grilled Corn', 'Masala Dosa', 'Sevpuri', 'Ice Cream Pav'],
    images: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800'],
    coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    mustTry: 'The legendary ice cream sandwich pav — a Manek Chowk original.',
    tags: ['street-food', 'night-market', 'cheap', 'crowd-favourite'],
  },
  {
    id: 'rest-003',
    name: 'Vishalla',
    city: 'Ahmedabad',
    state: 'Gujarat',
    address: 'Vasna Toll Naka, Ahmedabad',
    lat: 22.9912,
    lng: 72.5565,
    cuisine: ['Gujarati', 'Village-style'],
    isVeg: true,
    priceForTwo: 1400,
    rating: 4.7,
    reviewCount: 1890,
    timings: '7:00 PM – 10:30 PM (Dinner only)',
    specialities: ['Village Thali on Leaf Plates', 'Raab', 'Bajra Rotla', 'Sev Tameta Nu Shaak'],
    images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800'],
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    mustTry: 'Seated on the floor of a recreated Gujarati village with folk performances.',
    tags: ['cultural', 'village-theme', 'experience', 'dinner-only'],
  },
  // ── Jaipur ───────────────────────────────────────────────────────────────────
  {
    id: 'rest-004',
    name: '1135 AD',
    city: 'Jaipur',
    state: 'Rajasthan',
    address: 'Amer Fort Complex, Jaipur',
    lat: 26.9855,
    lng: 75.8513,
    cuisine: ['Rajasthani', 'Mughal', 'Continental'],
    isVeg: false,
    priceForTwo: 3000,
    rating: 4.7,
    reviewCount: 1500,
    timings: '12:00 PM – 11:00 PM',
    specialities: ['Laal Maas', 'Dal Baati Churma', 'Ker Sangri', 'Murgh Safed Mahal'],
    images: ['https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800'],
    coverImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
    mustTry: 'Dine inside Amer Fort — the menu recreates medieval royal Rajputana feasts.',
    tags: ['fort-dining', 'heritage', 'royal', 'fine-dining'],
  },
  {
    id: 'rest-005',
    name: 'Lassiwala',
    city: 'Jaipur',
    state: 'Rajasthan',
    address: 'MI Road, Jaipur',
    lat: 26.9210,
    lng: 75.8248,
    cuisine: ['Beverages', 'Street Food'],
    isVeg: true,
    priceForTwo: 100,
    rating: 4.8,
    reviewCount: 8900,
    timings: '08:00 AM – 5:00 PM (or till sold out)',
    specialities: ['Thick Malai Lassi', 'Rose Lassi', 'Mango Lassi'],
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'],
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    mustTry: 'The iconic thick curd lassi served in earthen kulhars — a Jaipur institution since 1944.',
    tags: ['iconic', 'cheap', 'street-food', 'lassi'],
  },
  // ── Goa ──────────────────────────────────────────────────────────────────────
  {
    id: 'rest-006',
    name: "Ritz Classic",
    city: 'Goa',
    state: 'Goa',
    address: 'Near Church Square, Panaji, Goa',
    lat: 15.4993,
    lng: 73.8278,
    cuisine: ['Goan', 'Seafood', 'Portuguese'],
    isVeg: false,
    priceForTwo: 900,
    rating: 4.6,
    reviewCount: 2400,
    timings: '11:30 AM – 3:30 PM, 6:30 PM – 11:00 PM',
    specialities: ['Prawn Balchão', 'Fish Recheado', 'Xacuti Chicken', 'Goan Fish Curry Rice'],
    images: ['https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800'],
    coverImage: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
    mustTry: 'The Prawn Balchão with red Goan rice — a fiery, tangy classic you can\'t find outside Goa.',
    tags: ['seafood', 'authentic', 'goan', 'local-favourite'],
  },
  {
    id: 'rest-007',
    name: 'Fisherman\'s Wharf',
    city: 'Goa',
    state: 'Goa',
    address: 'Cavelossim Beach Road, South Goa',
    lat: 15.1657,
    lng: 73.9386,
    cuisine: ['Seafood', 'Continental', 'Goan'],
    isVeg: false,
    priceForTwo: 1800,
    rating: 4.5,
    reviewCount: 3200,
    timings: '12:00 PM – 11:30 PM',
    specialities: ['Fresh Lobster Thermidor', 'Tiger Prawns', 'Crab Xacuti', 'Bebinca'],
    images: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800'],
    coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    mustTry: 'Fresh lobster by the riverside — pick your own from the tank.',
    tags: ['riverside', 'seafood', 'live-kitchen', 'romantic'],
  },
  // ── Varanasi ─────────────────────────────────────────────────────────────────
  {
    id: 'rest-008',
    name: 'Dosa Café',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    address: 'Assi Ghat, Varanasi',
    lat: 25.2912,
    lng: 82.9983,
    cuisine: ['South Indian', 'Cafeteria', 'Healthy'],
    isVeg: true,
    priceForTwo: 350,
    rating: 4.4,
    reviewCount: 1100,
    timings: '07:30 AM – 10:00 PM',
    specialities: ['Masala Dosa', 'Filter Coffee', 'Uttapam', 'Pongal'],
    images: ['https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?w=800'],
    coverImage: 'https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?w=800',
    mustTry: 'Post-Ganga-Aarti crispy dosa with strong filter coffee at sunrise.',
    tags: ['ghat-side', 'breakfast', 'south-indian', 'backpacker-friendly'],
  },
  {
    id: 'rest-009',
    name: 'Kashi Chat Bhandar',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    address: 'Godaulia Crossing, Varanasi',
    lat: 25.3105,
    lng: 83.0089,
    cuisine: ['Street Food', 'Chaats', 'Sweets'],
    isVeg: true,
    priceForTwo: 150,
    rating: 4.7,
    reviewCount: 6500,
    timings: '09:00 AM – 10:00 PM',
    specialities: ['Tamatar Chaat', 'Aloo Tikki', 'Baati', 'Malaiyyo (winter)', 'Rabri'],
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    mustTry: 'The legendary Tamatar Chaat — a Varanasi street food icon for decades.',
    tags: ['iconic', 'street-food', 'chaat', 'cheap'],
  },
  // ── Udaipur ──────────────────────────────────────────────────────────────────
  {
    id: 'rest-010',
    name: 'Ambrai Restaurant',
    city: 'Udaipur',
    state: 'Rajasthan',
    address: 'Amet Haveli, Chandpole, Udaipur',
    lat: 24.5783,
    lng: 73.6812,
    cuisine: ['Rajasthani', 'Indian', 'Continental'],
    isVeg: false,
    priceForTwo: 2500,
    rating: 4.8,
    reviewCount: 4200,
    timings: '07:00 AM – 11:30 PM',
    specialities: ['Dal Baati Churma', 'Gatte Ki Sabji', 'Murgh Rajasthani', 'Ghevar'],
    images: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800'],
    coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    mustTry: 'Dining with a direct view of the illuminated City Palace and Lake Pichola at sunset.',
    tags: ['lake-view', 'romantic', 'sunset-dining', 'must-visit'],
  },
];

// ── GET /api/restaurants ──────────────────────────────────────────────────────
router.get('/', (req, res) => {
  try {
    let restaurants = [...RESTAURANTS];
    const { city, cuisine, isVeg, minRating, maxPrice, sort } = req.query;

    if (city) {
      restaurants = restaurants.filter((r) => r.city.toLowerCase() === city.toLowerCase());
    }

    if (cuisine) {
      const c = cuisine.toLowerCase();
      restaurants = restaurants.filter((r) =>
        r.cuisine.some((cu) => cu.toLowerCase().includes(c))
      );
    }

    if (isVeg !== undefined) {
      const vegOnly = isVeg === 'true';
      restaurants = restaurants.filter((r) => r.isVeg === vegOnly);
    }

    if (minRating) {
      restaurants = restaurants.filter((r) => r.rating >= Number(minRating));
    }

    if (maxPrice) {
      restaurants = restaurants.filter((r) => r.priceForTwo <= Number(maxPrice));
    }

    if (sort === 'price_asc') restaurants.sort((a, b) => a.priceForTwo - b.priceForTwo);
    else if (sort === 'rating') restaurants.sort((a, b) => b.rating - a.rating);

    res.json({ success: true, count: restaurants.length, restaurants });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

// ── GET /api/restaurants/:id ──────────────────────────────────────────────────
router.get('/:id', (req, res) => {
  const restaurant = RESTAURANTS.find((r) => r.id === req.params.id);
  if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
  res.json({ success: true, restaurant });
});

module.exports = router;
