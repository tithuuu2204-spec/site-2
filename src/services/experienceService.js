import { EXPERIENCES } from '../data/seedExperiences';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs } from 'firebase/firestore';

const API_URL = '/api/experiences';

export const experienceService = {
  // Fetch from API with local fallback
  async fetchExperiences(filters = {}) {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`${API_URL}?${query}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn("API unavailable, using local data");
    }
    
    // Local fallback logic
    let results = [...EXPERIENCES];
    if (filters.city) results = results.filter(e => e.city.toLowerCase() === filters.city.toLowerCase());
    if (filters.category) results = results.filter(e => e.category === filters.category);
    if (filters.q) {
      const q = filters.q.toLowerCase();
      results = results.filter(e => e.title.toLowerCase().includes(q) || e.city.toLowerCase().includes(q));
    }
    return results;
  },

  async fetchTrending() {
    try {
      const res = await fetch(`${API_URL}/trending`);
      if (res.ok) return await res.json();
    } catch (err) {}
    return EXPERIENCES.filter(e => e.isTrending).sort((a,b) => b.trendingScore - a.trendingScore);
  },

  async fetchFeatured() {
    try {
      const res = await fetch(`${API_URL}/featured`);
      if (res.ok) return await res.json();
    } catch (err) {}
    return EXPERIENCES.filter(e => e.isFeatured);
  },

  async fetchHiddenGems() {
    try {
      const res = await fetch(`${API_URL}/hidden-gems`);
      if (res.ok) return await res.json();
    } catch (err) {}
    return EXPERIENCES.filter(e => e.isHiddenGem);
  },

  async fetchExperienceById(id) {
    try {
      const res = await fetch(`${API_URL}/${id}`);
      if (res.ok) return await res.json();
    } catch (err) {}
    return EXPERIENCES.find(e => e.id === id) || null;
  },

  async createExperience(data) {
    // Save to Firestore
    const docRef = await addDoc(collection(db, 'experiences'), {
      ...data,
      createdAt: new Date().toISOString(),
      approvalStatus: 'pending'
    });
    
    // Also notify backend API if available
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, id: docRef.id })
      });
    } catch (err) { }
    
    return docRef.id;
  },

  async incrementView(id) {
    try {
      await fetch(`${API_URL}/${id}/view`, { method: 'POST' });
    } catch (err) {}
  }
};
