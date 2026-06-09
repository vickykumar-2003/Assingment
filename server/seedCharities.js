const mongoose = require('mongoose');
const Charity = require('./models/Charity');

const MONGO_URI =  "mongodb+srv://vickyk15009_db_user:vicky123@cluster0.go9c6aq.mongodb.net/golf-charity?retryWrites=true&w=majority";

const charities = [
  {
    name: "Akshaya Patra Foundation",
    description: "The world's largest NGO-run school meal program, serving millions of children across India to eliminate hunger and promote education.",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800",
    website: "https://www.akshayapatra.org",
    minContribution: 10
  },
  {
    name: "Goonj",
    description: "A multi-award winning social enterprise using urban discard as a tool to alleviate poverty and enhance the dignity of the poor in rural India.",
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=800",
    website: "https://goonj.org",
    minContribution: 10
  },
  {
    name: "CRY (Child Rights and You)",
    description: "Ensuring that the rights of India's children are protected and their voices are heard, focusing on education, health, and protection.",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=800",
    website: "https://www.cry.org",
    minContribution: 10
  },
  {
    name: "Smile Foundation",
    description: "Empowering underprivileged children and youth through education, healthcare, and livelihood programs across 25 states of India.",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800",
    website: "https://www.smilefoundationindia.org",
    minContribution: 10
  },
  {
    name: "HelpAge India",
    description: "A leading NGO serving the needs of the elderly in India, focusing on healthcare, livelihood support, and disaster advocacy.",
    image: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?q=80&w=800",
    website: "https://www.helpageindia.org",
    minContribution: 10
  },
  {
    name: "GiveIndia",
    description: "India's largest giving platform, matching donors with vetted NGOs to ensure every contribution makes a verified impact.",
    image: "https://images.unsplash.com/photo-1544027960-ca291b77bd5f?q=80&w=800",
    website: "https://www.giveindia.org",
    minContribution: 10
  },
  {
    name: "Pratham",
    description: "Focused on high-quality, low-cost, and replicable interventions to address gaps in the education system for children.",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800",
    website: "https://www.pratham.org",
    minContribution: 10
  },
  {
    name: "Nanhi Kali",
    description: "Supporting education for underprivileged girls in India, aiming to break the cycle of poverty and empower the next generation.",
    image: "https://images.unsplash.com/photo-1497551060073-4c5ab6435f12?q=80&w=800",
    website: "https://www.nanhikali.org",
    minContribution: 10
  },
  {
    name: "Teach For India",
    description: "Creating a movement of leaders who will eliminate educational inequity in India by teaching in under-resourced schools.",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800",
    website: "https://www.teachforindia.org",
    minContribution: 10
  },
  {
    name: "Sankara Eye Foundation",
    description: "Working towards the eradication of curable blindness in India through free eye surgeries and rural eye care programs.",
    image: "https://images.unsplash.com/photo-1576091160550-217359f4261c?q=80&w=800",
    website: "https://www.giftofvision.org",
    minContribution: 10
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding charities...');
    
    // Clear existing
    await Charity.deleteMany({});
    console.log('Cleared existing charities.');
    
    // Insert new
    await Charity.insertMany(charities);
    console.log(`Successfully seeded ${charities.length} charities.`);
    
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
