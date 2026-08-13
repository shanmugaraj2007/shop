// Database Service Layer supporting both Firebase Firestore Cloud Database and Local Fallback
import { db, isFirebaseConfigured } from '../config/firebase';
import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  getDoc,
  updateDoc,
  arrayUnion
} from 'firebase/firestore';

const STORAGE_KEYS = {
  USERS: 'users',
  MASTER_ITEMS: 'kpn_master_items',
  STOCK_ITEMS: 'kpn_stock_items'
};

const DEFAULT_USERS = {
  'worker@kpntraders.com': { password: 'worker123', role: 'worker' },
  'owner@kpntraders.com': { password: 'owner123', role: 'owner' }
};

const DEFAULT_MASTER_ITEMS = [
  'APEX WHITE', 'AB2', 'AB6', 'AB11', 'AB12', 'AB17C', 'AB21G',
  'APEX RED', 'APEX MARRON', 'ULTIMA WHITE', 'HQ2N', 'HQ10N',
  'HQ13', 'HQ16N', 'HQ17', 'HQ20N', 'ULTIMA SILVER', 'ULTIMA GOLD',
  'ACE WHITE', 'AC2G', 'AC9G', 'AC17G', 'AC21G'
];

export const DatabaseService = {
  // ================= USERS AUTHENTICATION =================
  getUsers: async () => {
    if (isFirebaseConfigured() && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersObj = {};
        querySnapshot.forEach((docSnap) => {
          usersObj[docSnap.id] = docSnap.data();
        });
        // If firestore is empty, seed defaults
        return Object.keys(usersObj).length > 0 ? usersObj : DEFAULT_USERS;
      } catch (err) {
        console.error('Firestore getUsers error, falling back to local:', err);
      }
    }
    
    // Local fallback
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : DEFAULT_USERS;
  },

  saveUser: async (email, userData) => {
    if (isFirebaseConfigured() && db) {
      try {
        await setDoc(doc(db, 'users', email), userData);
        return { success: true };
      } catch (err) {
        console.error('Firestore saveUser error, saving to local fallback:', err);
      }
    }

    // Local fallback
    const users = await DatabaseService.getUsers();
    users[email] = userData;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return { success: true };
  },

  // ================= MASTER STOCK CATALOG =================
  getMasterItems: async () => {
    if (isFirebaseConfigured() && db) {
      try {
        const docRef = doc(db, 'settings', 'master_items');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const cloudItems = docSnap.data().items || [];
          return [...new Set([...DEFAULT_MASTER_ITEMS, ...cloudItems])];
        } else {
          // Initialize master items doc in cloud
          await setDoc(docRef, { items: DEFAULT_MASTER_ITEMS });
          return DEFAULT_MASTER_ITEMS;
        }
      } catch (err) {
        console.error('Firestore getMasterItems error:', err);
      }
    }

    // Local fallback
    const saved = localStorage.getItem(STORAGE_KEYS.MASTER_ITEMS);
    if (saved) {
      const parsed = JSON.parse(saved);
      return [...new Set([...DEFAULT_MASTER_ITEMS, ...parsed])];
    }
    return DEFAULT_MASTER_ITEMS;
  },

  addMasterItem: async (newItemName) => {
    if (isFirebaseConfigured() && db) {
      try {
        const docRef = doc(db, 'settings', 'master_items');
        await updateDoc(docRef, {
          items: arrayUnion(newItemName)
        });
        return await DatabaseService.getMasterItems();
      } catch (err) {
        console.error('Firestore addMasterItem error:', err);
      }
    }

    // Local fallback
    const current = await DatabaseService.getMasterItems();
    if (!current.includes(newItemName)) {
      const updated = [...current, newItemName];
      localStorage.setItem(STORAGE_KEYS.MASTER_ITEMS, JSON.stringify(updated));
      return updated;
    }
    return current;
  },

  // ================= CURRENT INVENTORY / STOCK =================
  getStockItems: async () => {
    if (isFirebaseConfigured() && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'stock_items'));
        const itemsList = [];
        querySnapshot.forEach((docSnap) => {
          itemsList.push({ id: docSnap.id, ...docSnap.data() });
        });
        return itemsList;
      } catch (err) {
        console.error('Firestore getStockItems error:', err);
      }
    }

    // Local fallback
    const data = localStorage.getItem(STORAGE_KEYS.STOCK_ITEMS);
    return data ? JSON.parse(data) : [];
  },

  saveStockItems: async (items) => {
    if (isFirebaseConfigured() && db) {
      try {
        // Save current inventory list to Firestore collection
        const savePromises = items.map(item => 
          setDoc(doc(db, 'stock_items', String(item.id)), {
            name: item.name,
            size: item.size,
            quantity: item.quantity,
            updatedAt: new Date().toISOString()
          })
        );
        await Promise.all(savePromises);
        return { success: true };
      } catch (err) {
        console.error('Firestore saveStockItems error:', err);
      }
    }

    // Local fallback
    localStorage.setItem(STORAGE_KEYS.STOCK_ITEMS, JSON.stringify(items));
    return { success: true };
  }
};
