const mongoose = require('mongoose');
const GraceFeed = require('./models/graceFeed');
const User = require('./models/user');
const addArticles = require('./db/addArticles');
require('dotenv').config();

// Sample user data
const sampleUsers = [
  {
    userName: "sarah_volunteer",
    email: "sarah@example.com",
    password: "hashedpassword123",
    role: ["volunteer"],
    about: "Passionate about helping communities",
  },
  {
    userName: "artistic_soul",
    email: "artist@example.com", 
    password: "hashedpassword123",
    role: ["volunteer"],
    about: "Teaching art to make a difference",
  },
  {
    userName: "craft_lover",
    email: "crafter@example.com",
    password: "hashedpassword123",
    role: ["volunteer"],
    about: "DIY enthusiast helping others learn",
  }
];

// Sample posts data
const samplePosts = [
  {
    type: "photo",
    content: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=300&h=400&fit=crop",
    caption: "Today we helped build homes for families in need. Every nail hammered with love! 🏠💕",
    size: "medium",
    tags: ["construction", "housing", "community"],
    likes: [],
    comments: [],
    shares: []
  },
  {
    type: "photo", 
    content: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=500&fit=crop",
    caption: "Teaching art therapy to children at the community center ✨🎨",
    size: "large",
    tags: ["art", "therapy", "children"],
    likes: [],
    comments: [],
    shares: []
  },
  {
    type: "photo",
    content: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=350&fit=crop", 
    caption: "Reading stories to kids at the local library. Books open minds! ☀️📚",
    size: "medium",
    tags: ["education", "reading", "children"],
    likes: [],
    comments: [],
    shares: []
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/grace-db');
    console.log('Connected to MongoDB for seeding');

    // Clear existing data
    await GraceFeed.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`Created ${createdUsers.length} users`);

    // Create posts with user references
    const postsWithUsers = samplePosts.map((post, index) => ({
      ...post,
      user: createdUsers[index]._id
    }));

    const createdPosts = await GraceFeed.insertMany(postsWithUsers);
    console.log(`Created ${createdPosts.length} posts`);

    // Seed articles for chatbot
    console.log('Seeding articles for chatbot...');
    const articlesAdded = await addArticles();
    if (articlesAdded) {
      console.log('Articles seeded successfully!');
    } else {
      console.log('Articles already exist or seeding skipped');
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
