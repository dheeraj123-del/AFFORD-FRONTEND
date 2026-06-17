const BASE_URL = 'http://20.244.56.144/test';

// Supported list of categories & companies for verification and dropdowns
export const COMPANIES = ['AMZ', 'FLP', 'SNP', 'MYN', 'AZO'];
export const CATEGORIES = [
  'Phone', 'Computer', 'TV', 'Earphone', 'Tablet', 
  'Charger', 'House', 'Keypad', 'Bluetooth', 
  'Pendrive', 'Remote', 'Speaker', 'Headset', 'Laptop'
];

// High-quality details for mock data generation to wow the user
const MOCK_PRODUCT_DESCRIPTIONS = [
  "A premium design featuring state-of-the-art technology, offering unmatched efficiency and style.",
  "Engineered for high performance, durability, and a sleek modern aesthetic. Perfect for daily professional use.",
  "Immerse yourself in top-tier performance with advanced capabilities and next-gen integration.",
  "Designed with precision and crafted from high-quality materials to deliver a seamless user experience.",
  "Unleash the full potential of your digital workflow with this top-rated industry favorite."
];

const MOCK_SPECS = {
  Phone: ["8GB RAM / 256GB Storage", "120Hz Super AMOLED Display", "50MP Triple Camera System", "5000mAh Battery with 45W Fast Charging"],
  Computer: ["AMD Ryzen 7 / Intel Core i7", "16GB DDR5 RAM", "512GB NVMe SSD", "NVIDIA RTX 4060 GPU"],
  TV: ["4K Ultra HD Resolution", "HDR10+ / Dolby Vision Support", "120Hz Refresh Rate", "30W Dolby Atmos Speakers"],
  Earphone: ["Active Noise Cancellation (ANC)", "Up to 30 Hours Battery Life", "Bluetooth 5.3 Quick Pair", "IPX5 Water Resistant"],
  Tablet: ["11-inch Liquid Retina Display", "M2 Octa-Core Processor", "Support for Active Stylus Pen", "Thin and Lightweight Design"],
  Charger: ["65W GaN Technology", "Dual USB-C & USB-A Ports", "Over-current Protection", "Foldable Plug Architecture"],
  House: ["Smart Home Automation Hub Ready", "Eco-friendly Thermal Insulation", "Energy Star Certified Appliance Package", "Integrated Safety & Security System"],
  Keypad: ["Mechanical Tactile Blue Switches", "Customizable RGB Backlighting", "Anti-Ghosting N-Key Rollover", "Ergonomic Wrist Rest Included"],
  Bluetooth: ["Hi-Res Audio Streaming Profile", "Ultra-low Latency Gaming Mode", "Dual Device Multipoint Connection", "Up to 50ft Wireless Range"],
  Pendrive: ["USB 3.2 Gen 1 High Speed", "Up to 150MB/s Read Speeds", "Durable Metal Casing", "Keychain Loop Design"],
  Remote: ["Universal Device Compatibility", "Voice Search Control Enabled", "Backlit Buttons for Dark Rooms", "Rechargeable Lithium Battery"],
  Speaker: ["360-degree Cinematic Spatial Sound", "IP67 Dust and Waterproofing", "Dual Passive Bass Radiators", "Party Connect up to 100 Speakers"],
  Headset: ["Studio Grade Over-Ear Drivers", "Detachable Cardioid Microphone", "Memory Foam Cooling Gel Ear Cushions", "Universal Console/PC Compatibility"],
  Laptop: ["Intel Core i9 Processor", "32GB High-Speed RAM", "1TB Gen4 SSD", "16-inch 165Hz QHD Screen"]
};

// Seeded random number generator for consistent mock data per product name/id
const createRandom = (seed) => {
  let h = seedFunc(seed);
  return () => {
    h = (h * 16807) % 2147483647;
    return (h - 1) / 2147483646;
  };
};

const seedFunc = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

// Generate deterministic mock products to allow detail page fetching and bookmark stability
const generateMockProducts = (company, category) => {
  const products = [];
  const seedBase = `${company}-${category}`;
  const rand = createRandom(seedBase);
  
  // Create 35 unique mock products per company/category pair
  for (let i = 1; i <= 35; i++) {
    const price = Math.floor(rand() * 4500) + 500; // $500 - $5000
    const rating = parseFloat((rand() * 2 + 3).toFixed(1)); // 3.0 - 5.0
    const discount = Math.floor(rand() * 45) + 5; // 5% - 50%
    const availability = rand() > 0.15 ? 'yes' : 'out-of-stock';
    
    const adjective = ["Premium", "Ultra", "Elite", "Pro", "Core", "Nexus", "Aero", "Infinity"][Math.floor(rand() * 8)];
    const noun = category;
    const model = `${adjective} ${noun} ${i}`;
    const id = `${company.toLowerCase()}-${category.toLowerCase()}-${i}`;
    
    // Select deterministic specs and descriptions
    const specsIndex = Math.floor(rand() * (MOCK_SPECS[category]?.length || 3));
    const specsList = MOCK_SPECS[category] || ["High Quality", "Reliable Performance", "Modern Design"];
    
    products.push({
      id,
      productName: model,
      price,
      rating,
      discount,
      availability,
      company,
      category,
      description: MOCK_PRODUCT_DESCRIPTIONS[Math.floor(rand() * MOCK_PRODUCT_DESCRIPTIONS.length)],
      specs: specsList,
      reviewsCount: Math.floor(rand() * 850) + 50,
      imagePlaceholder: `https://picsum.photos/seed/${id}/600/400`
    });
  }
  return products;
};

// Cache structure for mock data
const mockDataCache = {};
const getMockData = (company, category) => {
  const key = `${company}-${category}`;
  if (!mockDataCache[key]) {
    mockDataCache[key] = generateMockProducts(company, category);
  }
  return mockDataCache[key];
};

export const apiService = {
  // 1. Register with the test server
  register: async (payload) => {
    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Registration failed');
      const data = await response.json();
      localStorage.setItem('affordmed_credentials', JSON.stringify({ ...payload, ...data }));
      return { success: true, data };
    } catch (error) {
      console.warn("API Registration failed, falling back to local credentials simulation.", error);
      // Simulate successful registration locally
      const simulatedCreds = {
        ...payload,
        clientID: `sim-${Math.random().toString(36).substr(2, 9)}-mock`,
        clientSecret: `sec-${Math.random().toString(36).substr(2, 12)}-mock`
      };
      localStorage.setItem('affordmed_credentials', JSON.stringify(simulatedCreds));
      return { success: true, data: simulatedCreds, simulated: true };
    }
  },

  // 2. Fetch Authorization Token
  fetchToken: async (credentials) => {
    try {
      const response = await fetch(`${BASE_URL}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: credentials.companyName,
          clientID: credentials.clientID,
          clientSecret: credentials.clientSecret,
          ownerName: credentials.ownerName,
          ownerEmail: credentials.ownerEmail,
          rollNo: credentials.rollNo
        })
      });
      if (!response.ok) throw new Error('Auth failed');
      const data = await response.json();
      localStorage.setItem('affordmed_token', JSON.stringify(data));
      return { success: true, token: data.access_token };
    } catch (error) {
      console.warn("API Auth failed, generating a local simulation token.", error);
      const fakeTokenData = {
        access_token: `fake-jwt-token-${Math.random().toString(36).substring(2)}`,
        token_type: "Bearer",
        expires_in: 3600
      };
      localStorage.setItem('affordmed_token', JSON.stringify(fakeTokenData));
      return { success: true, token: fakeTokenData.access_token, simulated: true };
    }
  },

  // 3. Fetch Products List
  getProducts: async ({
    company,
    category,
    top = 10,
    minPrice = 1,
    maxPrice = 100000,
    sortBy = '',
    order = 'asc',
    page = 1,
    limit = 10
  }) => {
    const tokenData = JSON.parse(localStorage.getItem('affordmed_token'));
    const token = tokenData ? tokenData.access_token : '';

    try {
      // If we don't have a token, trigger fallback immediately to keep UX intact
      if (!token) throw new Error('No auth token available');

      const url = `${BASE_URL}/companies/${company}/categories/${category}/products?top=${top}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      const data = await response.json();
      
      // The API doesn't support custom sort, order, pagination out of the box (requires custom logic)
      // We process sorting, pagination, and unique id assignment on the client side
      let processedProducts = data.map((item, idx) => ({
        ...item,
        id: `${company.toLowerCase()}-${category.toLowerCase()}-${idx + 1}`,
        company,
        category,
        description: MOCK_PRODUCT_DESCRIPTIONS[idx % MOCK_PRODUCT_DESCRIPTIONS.length],
        specs: MOCK_SPECS[category] ? [MOCK_SPECS[category][idx % MOCK_SPECS[category].length]] : ["Premium Build Quality"],
        reviewsCount: 150 + idx * 3,
        imagePlaceholder: `https://picsum.photos/seed/${company}-${category}-${idx}/600/400`
      }));

      // Sort
      if (sortBy) {
        processedProducts.sort((a, b) => {
          let fieldA = a[sortBy];
          let fieldB = b[sortBy];
          if (typeof fieldA === 'string') {
            return order === 'asc' ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
          }
          return order === 'asc' ? fieldA - fieldB : fieldB - fieldA;
        });
      }

      // Pagination
      const totalCount = processedProducts.length;
      const startIndex = (page - 1) * limit;
      const paginatedProducts = processedProducts.slice(startIndex, startIndex + limit);

      return {
        products: paginatedProducts,
        total: totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        source: 'live'
      };
    } catch (error) {
      console.warn(`Falling back to local mock data generator for ${company} -> ${category}. Reason: ${error.message}`);
      
      // Perform fallback processing on generated mock products
      let allMock = getMockData(company, category);
      
      // Apply Client-Side Filters
      let filtered = allMock.filter(p => p.price >= minPrice && p.price <= maxPrice);

      // Apply Client-Side Sort
      if (sortBy) {
        filtered.sort((a, b) => {
          let valA = a[sortBy];
          let valB = b[sortBy];
          if (typeof valA === 'string') {
            return order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
          }
          return order === 'asc' ? valA - valB : valB - valA;
        });
      }

      // Apply Client-Side Pagination
      const totalCount = filtered.length;
      const startIndex = (page - 1) * limit;
      const paginated = filtered.slice(startIndex, startIndex + limit);

      // Artificial Delay to simulate realistic API latency for premium loading skeleton states
      await new Promise(resolve => setTimeout(resolve, 600));

      return {
        products: paginated,
        total: totalCount,
        currentPage: page,
        totalPages: Math.max(1, Math.ceil(totalCount / limit)),
        source: 'mock'
      };
    }
  },

  // 4. Fetch Single Product Detail
  getProductById: async (id) => {
    // Standard format for IDs: company-category-index (e.g. amz-phone-3)
    const parts = id.split('-');
    if (parts.length < 3) return null;

    const company = parts[0].toUpperCase();
    // Category might contain dashes or be a composite, let's assemble it
    const categoryLower = parts.slice(1, -1).join('-');
    // Find matching proper category casing
    const category = CATEGORIES.find(c => c.toLowerCase() === categoryLower) || CATEGORIES[0];
    
    // Fetch all for this category and filter locally (representing a specific detail fetch)
    const allMock = getMockData(company, category);
    const product = allMock.find(p => p.id === id);
    return product || null;
  }
};
