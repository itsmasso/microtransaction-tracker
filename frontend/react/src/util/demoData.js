// Demo data and utilities for the demo mode
export const DEMO_GAMES = [
  {
    _id: 'demo-game-1',
    gameId: {
      _id: 'demo-game-1',
      name: 'Fortnite',
      igdbId: 1905,
      coverUrl: 'https://cdn1.epicgames.com/offer/fn/FNBR_37-00_C6S4_EGS_Launcher_KeyArt_FNLogo_Blade_1200x1600_1200x1600-0924136c90b79f9006796f69f24a07f6'
    },
    expenses: [
      {
        name: 'Battle Pass Season 5',
        purchaseAmount: 9.99,
        date: '2025-01-15'
      },
      {
        name: 'V-Bucks 1000',
        purchaseAmount: 7.99,
        date: '2025-02-01'
      },
      {
        name: 'Skin Bundle',
        purchaseAmount: 15.99,
        date: '2025-02-15'
      },
      {
        name: 'Emote Pack',
        purchaseAmount: 12.99,
        date: '2025-03-10'
      }
    ],
    subscriptions: [
      {
        name: 'Fortnite Crew',
        purchaseAmount: 11.99,
        date: '2025-01-01',
        recurrence: 'monthly'
      }
    ],
    addedAt: '2025-01-01T00:00:00.000Z'
  },
  {
    _id: 'demo-game-2',
    gameId: {
      _id: 'demo-game-2',
      name: 'Apex Legends',
      igdbId: 109452,
      coverUrl: 'https://m.media-amazon.com/images/M/MV5BM2Q5YmMzM2ItNzY2OS00OWQ3LTkzMzMtYzJiYTE4NDVjODgzXkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg'
    },
    expenses: [
      {
        name: 'Apex Coins 1000',
        purchaseAmount: 9.99,
        date: '2025-01-20'
      },
      {
        name: 'Legend Unlock',
        purchaseAmount: 7.50,
        date: '2025-02-05'
      },
      {
        name: 'Battle Pass',
        purchaseAmount: 9.99,
        date: '2025-03-01'
      }
    ],
    subscriptions: [],
    addedAt: '2025-01-10T00:00:00.000Z'
  },
  {
    _id: 'demo-game-3',
    gameId: {
      _id: 'demo-game-3',
      name: 'Valorant',
      igdbId: 119171,
      coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2mvt.webp'
    },
    expenses: [
      {
        name: 'Valorant Points 1375',
        purchaseAmount: 10.00,
        date: '2025-01-25'
      },
      {
        name: 'Battle Pass',
        purchaseAmount: 10.00,
        date: '2025-02-10'
      },
      {
        name: 'Weapon Skin',
        purchaseAmount: 17.99,
        date: '2025-03-05'
      }
    ],
    subscriptions: [],
    addedAt: '2025-01-15T00:00:00.000Z'
  }
];

export const DEMO_USER = {
  _id: 'demo-user',
  email: 'demo@example.com',
  firstName: 'Demo',
  lastName: 'User',
  isDemo: true
};

// Demo data management functions
export const getDemoData = () => {
  const saved = localStorage.getItem('mtx-tracker-demo-data');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error('Error parsing demo data:', error);
    }
  }
  return [...DEMO_GAMES];
};

export const saveDemoData = (data) => {
  localStorage.setItem('mtx-tracker-demo-data', JSON.stringify(data));
};

export const clearDemoData = () => {
  localStorage.removeItem('mtx-tracker-demo-data');
};

// This function will be replaced by a context-based function in PageLayout
// For now, keep it as a placeholder or remove if not directly used.
// The actual modal trigger will come from the context provided by PageLayout.
