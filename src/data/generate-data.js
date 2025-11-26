// Node script to generate dummy-items.json
const fs = require('fs');

function generateDummyItems() {
  const categories = ['Electronics', 'Bags', 'Keys', 'Clothing', 'Books', 'Accessories', 'Documents', 'Sports Equipment'];
  const locations = [
    'Library 3rd Floor', 'Student Center Food Court', 'Parking Lot B', 'West Hall Room 205',
    'Science Building Lab 3', 'Gym Locker Room', 'East Hall Cafeteria', 'Computer Lab A',
    'Main Entrance', 'Auditorium', 'North Campus Park', 'Bus Stop Area',
    'Library 1st Floor', 'Student Lounge', 'Bookstore', 'Recreation Center'
  ];
  
  const itemTemplates = [
    { name: 'Backpack', category: 'Bags', desc: 'backpack with laptop compartment' },
    { name: 'Phone', category: 'Electronics', desc: 'smartphone with protective case' },
    { name: 'Keys', category: 'Keys', desc: 'key ring with multiple keys' },
    { name: 'Laptop', category: 'Electronics', desc: 'laptop computer' },
    { name: 'Wallet', category: 'Accessories', desc: 'leather wallet' },
    { name: 'Water Bottle', category: 'Accessories', desc: 'reusable water bottle' },
    { name: 'Textbook', category: 'Books', desc: 'course textbook' },
    { name: 'Jacket', category: 'Clothing', desc: 'jacket or coat' },
    { name: 'Headphones', category: 'Electronics', desc: 'wireless headphones' },
    { name: 'Umbrella', category: 'Accessories', desc: 'folding umbrella' },
    { name: 'ID Card', category: 'Documents', desc: 'student ID card' },
    { name: 'Calculator', category: 'Electronics', desc: 'scientific calculator' },
    { name: 'Watch', category: 'Accessories', desc: 'wrist watch' },
    { name: 'Notebook', category: 'Books', desc: 'spiral notebook' },
    { name: 'USB Drive', category: 'Electronics', desc: 'USB flash drive' },
    { name: 'Glasses', category: 'Accessories', desc: 'prescription glasses or sunglasses' },
    { name: 'Charger', category: 'Electronics', desc: 'phone or laptop charger' },
    { name: 'Hoodie', category: 'Clothing', desc: 'hooded sweatshirt' },
    { name: 'Scarf', category: 'Clothing', desc: 'winter scarf' },
    { name: 'Hat', category: 'Clothing', desc: 'baseball cap or beanie' },
    { name: 'Earbuds', category: 'Electronics', desc: 'wireless earbuds with case' },
    { name: 'Lunchbox', category: 'Accessories', desc: 'insulated lunch container' },
    { name: 'Badge', category: 'Documents', desc: 'access badge or ID' },
    { name: 'Mouse', category: 'Electronics', desc: 'wireless computer mouse' },
    { name: 'Planner', category: 'Books', desc: 'daily planner or agenda' },
  ];

  const colors = ['Black', 'Blue', 'Red', 'Gray', 'Navy', 'Green', 'Purple', 'Brown', 'White', 'Silver'];
  const brands = ['Nike', 'Adidas', 'Apple', 'Samsung', 'JanSport', 'North Face', 'Sony', 'Dell', 'HP'];

  const items = [];
  const totalItems = 267;
  const successfulItems = Math.round(totalItems * 0.67); // 179 items (67%)

  // Generate dates for the past 90 days
  const now = new Date('2024-11-25'); // Fixed date for consistency
  const getRandomDate = (seed) => {
    const daysAgo = (seed * 37) % 90; // Pseudo-random but consistent
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    return date;
  };

  for (let i = 0; i < totalItems; i++) {
    const template = itemTemplates[i % itemTemplates.length];
    const color = colors[i % colors.length];
    const brand = (i % 3 !== 0) ? brands[i % brands.length] : '';
    const location = locations[i % locations.length];
    
    const reportDate = getRandomDate(i);
    const itemName = brand ? `${color} ${brand} ${template.name}` : `${color} ${template.name}`;
    
    // First 179 items (67%) are resolved or claimed
    // Remaining 88 items (33%) are lost or found
    let status;
    if (i < successfulItems) {
      // 67% success: mix of resolved and claimed
      status = (i % 2 === 0) ? 'resolved' : 'claimed';
    } else {
      // 33% pending: mix of lost and found
      status = (i % 3 === 0) ? 'found' : 'lost';
    }

    items.push({
      id: i + 1,
      itemName,
      category: template.category,
      description: `${itemName} - ${template.desc}. Lost on ${reportDate.toLocaleDateString()}.`,
      location,
      dateLost: reportDate.toISOString().split('T')[0],
      contactName: 'CCIS Student',
      contactEmail: 'admin@ccis.edu',
      contactPhone: '(555) 123-4567',
      status,
      reportedBy: 'admin@ccis.edu',
      reportedById: 1,
      reportedAt: reportDate.toISOString(),
      updatedAt: reportDate.toISOString(),
    });
  }

  return items;
}

const data = generateDummyItems();
console.log(JSON.stringify(data, null, 2));
