import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

const API_URL = '/api/bookings';

export const bookingService = {
  async createBooking(data) {
    const bookingData = {
      ...data,
      confirmationCode: `EH-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    // Attempt API call
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn("API unavailable, saving to Firestore only");
    }

    // Persist to Firestore as fallback
    const docRef = await addDoc(collection(db, 'bookings'), bookingData);
    return { ...bookingData, id: docRef.id };
  },

  async getUserBookings(userId) {
    try {
      const res = await fetch(`${API_URL}/user/${userId}`);
      if (res.ok) return await res.json();
    } catch (err) {}

    // Fallback
    const q = query(collection(db, 'bookings'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  async cancelBooking(bookingId) {
    try {
      await fetch(`${API_URL}/${bookingId}/cancel`, { method: 'PUT' });
    } catch (err) {}
    
    const docRef = doc(db, 'bookings', bookingId);
    await updateDoc(docRef, { status: 'cancelled' });
    return true;
  }
};
