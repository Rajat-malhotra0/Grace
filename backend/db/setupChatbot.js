#!/usr/bin/env node

/**
 * Chatbot Setup Script
 * This script initializes the chatbot by:
 * 1. Seeding articles to MongoDB
 * 2. Setting up the Qdrant vector store
 * 3. Loading articles into the vector database
 */

const mongoose = require("mongoose");
const connectDB = require("./connect");
const chatBotService = require("../services/chatBotService");
const { addArticles } = require("./addArticles");

async function setupChatbot() {
    console.log("🤖 Starting Grace Chatbot Setup...\n");

    try {
        // Step 1: Connect to MongoDB
        console.log("📂 Connecting to MongoDB...");
        await connectDB();
        console.log("✅ MongoDB connected successfully\n");

        // Step 2: Seed articles to MongoDB
        console.log("📝 Adding articles to MongoDB...");
        const articlesAdded = await addArticles();
        if (articlesAdded) {
            console.log("✅ Articles added to MongoDB successfully\n");
        } else {
            console.log("⚠️  Some articles may already exist\n");
        }

        // Step 3: Initialize Qdrant vector store
        console.log("🔗 Initializing Qdrant vector store...");
        await chatBotService.initializeVectorStore();
        console.log("✅ Qdrant vector store initialized\n");

        // Step 4: Set up knowledge base (load articles into vector store)
        console.log("📚 Setting up knowledge base...");
        const knowledgeBaseSetup = await chatBotService.setupKnowledgeBase();
        if (knowledgeBaseSetup) {
            console.log("✅ Knowledge base setup completed\n");
        } else {
            console.log(
                "⚠️  Knowledge base setup failed, fallback system will be used\n"
            );
        }

        // Step 5: Test the chatbot
        console.log("🧪 Testing chatbot functionality...");
        const testResponse = await chatBotService.getChatbotResponse(
            "How do I register as an NGO?"
        );
        console.log(
            "Test Response:",
            testResponse.answer.substring(0, 100) + "...\n"
        );

        console.log("🎉 Chatbot setup completed successfully!");
        console.log("\n📋 Next steps:");
        console.log("1. Start your server: npm run dev");
        console.log(
            "2. Test the chatbot at: POST http://localhost:3001/api/chatbot/chat"
        );
        console.log(
            '3. Send test message: { "message": "How do I register as an NGO?" }'
        );
    } catch (error) {
        console.error("❌ Setup failed:", error.message);
        console.log("\n🔧 Troubleshooting:");
        console.log("- Check your .env file has all required variables");
        console.log("- Ensure MongoDB is running");
        console.log("- Verify Qdrant credentials are correct");
        console.log("- Check your internet connection for Gemini API");
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log("\n🔌 Database connection closed");
        }
        process.exit(0);
    }
}

// Run setup if this file is executed directly
if (require.main === module) {
    setupChatbot();
}

module.exports = { setupChatbot };
