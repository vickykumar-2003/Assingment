const mongoose = require('mongoose');
const Charity = require('./models/Charity');
require('dotenv').config();

const charities = [
    {
        name: "Akshaya Patra Foundation",
        description: "Eliminating classroom hunger and promoting education by serving mid-day meals to millions of children.",
        image: "https://images.unsplash.com/photo-1511949863663-92c5c57d48a7?auto=format&fit=crop&q=80&w=600",
        website: "https://www.akshayapatra.org",
        minContribution: 10
    },
    {
        name: "Goonj",
        description: "Focusing on humanitarian aid, community development, and using urban discard for rural empowerment.",
        image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=600",
        website: "https://goonj.org",
        minContribution: 10
    },
    {
        name: "CRY (Child Rights and You)",
        description: "Dedicated to ensuring the fundamental rights of children in India, from health to protection.",
        image: "https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&q=80&w=600",
        website: "https://www.cry.org",
        minContribution: 10
    },
    {
        name: "Smile Foundation",
        description: "Directly benefiting underprivileged children and their families through education and healthcare projects.",
        image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=600",
        website: "https://www.smilefoundationindia.org",
        minContribution: 10
    },
    {
        name: "HelpAge India",
        description: "Serving the disadvantaged elderly in India and advocating for their rights and well-being.",
        image: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=600",
        website: "https://www.helpageindia.org",
        minContribution: 15
    },
    {
        name: "GiveIndia",
        description: "A platform that enables individuals and organizations to raise and donate funds for various social causes.",
        image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=600",
        website: "https://www.giveindia.org",
        minContribution: 10
    },
    {
        name: "Pratham",
        description: "One of the largest non-governmental organizations working to provide quality education to underprivileged children.",
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600",
        website: "https://www.pratham.org",
        minContribution: 10
    },
    {
        name: "Nanhi Kali",
        description: "A national sponsorship project that provides academic and material support for underprivileged girls.",
        image: "https://images.unsplash.com/photo-1503919005314-30d93d07d823?auto=format&fit=crop&q=80&w=600",
        website: "https://www.nanhikali.org",
        minContribution: 10
    },
    {
        name: "Teach For India",
        description: "Part of the 'Teach For All' global network, working with kids from low-income communities.",
        image: "https://images.unsplash.com/photo-1509062522246-37559ee23a7d?auto=format&fit=crop&q=80&w=600",
        website: "https://www.teachforindia.org",
        minContribution: 10
    },
    {
        name: "Sankara Eye Foundation",
        description: "Creating a movement to eliminate curable blindness in India through community eye care.",
        image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=600",
        website: "https://www.giftofvision.org",
        minContribution: 20
    }
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/golf-charity')
    .then(async () => {
        console.log('Connected for seeding...');
        await Charity.deleteMany();
        await Charity.insertMany(charities);
        console.log('Seeding complete! Charities added.');
        process.exit();
    })
    .catch(err => {
        console.error('Seeding error: ', err);
        process.exit(1);
    });
