#!/usr/bin/env node

/**
 * Quick Test for Specific Chatbot Questions
 * Tests the specific questions that were failing
 */

const mongoose = require("mongoose");
const connectDB = require("./db/connect");
const chatBotService = require("./services/chatBotService");

const problematicQuestions = [
    "how to make a post in the feed",
    "how to access the volunteer dashboard",
    "how to create events",
    "how to send messages",
];

async function testSpecificQuestions() {
    console.log("🧪 Testing specific chatbot questions...\n");

    try {
        // Connect to database
        await connectDB();

        // Initialize vector store
        await chatBotService.initializeVectorStore();

        console.log("Testing previously problematic questions:\n");
        console.log("=" * 80);

        for (let i = 0; i < problematicQuestions.length; i++) {
            const query = problematicQuestions[i];
            console.log(`\n${i + 1}. Question: "${query}"`);
            console.log("-".repeat(50));

            try {
                const response = await chatBotService.getChatbotResponse(query);
                console.log(
                    `Answer: ${response.answer.substring(0, 200)}${
                        response.answer.length > 200 ? "..." : ""
                    }`
                );
                console.log(
                    `Sources: ${response.sources.join(", ") || "Fallback"}`
                );
                console.log(`Found docs: ${response.foundDocs}`);

                // Check if it's using specific sources (not fallback)
                if (
                    response.foundDocs > 0 &&
                    !response.sources.some((s) => s.includes("Fallback"))
                ) {
                    console.log("✅ SUCCESS - Using database articles!");
                } else {
                    console.log(
                        "⚠️  ISSUE - Still using fallback or no docs found"
                    );
                }
            } catch (error) {
                console.error(`❌ Error: ${error.message}`);
            }
        }

        console.log("\n" + "=" * 80);
        console.log("✅ Specific question testing completed!");
    } catch (error) {
        console.error("❌ Test failed:", error.message);
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
        }
        process.exit(0);
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    testSpecificQuestions();
}

module.exports = { testSpecificQuestions };
