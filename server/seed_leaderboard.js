const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = 'mongodb://localhost:27017/golf-charity';

const users = [
  { username: "Tiger Woods", email: "tiger@golf.com", password: "Password123!", role: "user", totalStablefordPoints: 125, scores: [3, 4, 2, 4, 3], subscriptionStatus: "active" },
  { username: "Rory McIlroy", email: "rory@golf.com", password: "Password123!", role: "user", totalStablefordPoints: 112, scores: [2, 3, 4, 3, 2], subscriptionStatus: "active" },
  { username: "Scottie Scheffler", email: "scottie@golf.com", password: "Password123!", role: "user", totalStablefordPoints: 142, scores: [4, 4, 3, 4, 4], subscriptionStatus: "active" },
  { username: "Jon Rahm", email: "rahm@golf.com", password: "Password123!", role: "user", totalStablefordPoints: 98, scores: [1, 2, 3, 2, 1], subscriptionStatus: "active" },
  { username: "Brooks Koepka", email: "brooks@golf.com", password: "Password123!", role: "user", totalStablefordPoints: 85, scores: [2, 1, 2, 1, 2], subscriptionStatus: "active" }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB...');
    
    for (const u of users) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        await User.create(u);
        console.log(`Created user: ${u.username}`);
      } else {
        exists.totalStablefordPoints = u.totalStablefordPoints;
        exists.scores = u.scores;
        await exists.save();
        console.log(`Updated user: ${u.username}`);
      }
    }
    
    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seed();
