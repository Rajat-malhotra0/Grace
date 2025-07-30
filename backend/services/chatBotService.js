const dotenv = require("dotenv");
dotenv.config();

const { QdrantVectorStore } = require("@langchain/qdrant");
const {
    GoogleGenerativeAIEmbeddings,
    ChatGoogleGenerativeAI,
} = require("@langchain/google-genai");
const { Document } = require("@langchain/core/documents");

const collectionName = "help_articles";

if (!process.env.GEMINI_API_KEY) {
    process.exit(1);
}

const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: "embedding-001",
});

const chatModel = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: "gemini-2.0-flash",
});

let vectorStore = null;
let isInitialized = false;

async function initializeVectorStore() {
    if (isInitialized) return;
    try {
        if (!process.env.QDRANT_URL || !process.env.QDRANT_API_KEY) {
            console.error(
                "Missing QDRANT_URL or QDRANT_API_KEY in environment variables"
            );
            return;
        }
        vectorStore = new QdrantVectorStore(embeddings, {
            url: process.env.QDRANT_URL,
            apiKey: process.env.QDRANT_API_KEY,
            collectionName: collectionName,
            checkCompatibility: false,
        });

        console.log("Successfully connected to Qdrant");
        isInitialized = true;
    } catch (error) {
        console.warn("Could not connect to Qdrant:", error.message);
        vectorStore = null;
    }
}

async function addArticles(articles) {
    if (!vectorStore) {
        await initializeVectorStore();
    }

    if (!vectorStore) {
        console.warn("Qdrant not available, articles not stored");
        return;
    }
    try {
        const docs = articles.map(
            (article, index) =>
                new Document({
                    pageContent: article.content,
                    metadata: { ...article.metadata, id: index.toString() },
                })
        );
        await vectorStore.addDocuments(docs);
        console.log("Articles added to Qdrant");
        return true;
    } catch (error) {
        console.error("Error adding articles:", error.message);
        return false;
    }
}

async function searchArticles(query, limit = 3) {
    if (!vectorStore) {
        console.warn("Using fallback knowledge - no database connection");
        return getFallbackContent(query);
    }
    try {
        return await vectorStore.similaritySearch(query, limit);
    } catch (error) {
        console.error("Error during similarity search:", error.message);
        return getFallbackContent(query);
    }
}

async function getFallbackContent(query) {
    const queryLower = query.toLowerCase();
    const fallbackArticles = [];
    if (queryLower.includes("task") || queryLower.includes("create task")) {
        fallbackArticles.push(
            new Document({
                pageContent:
                    "To create a task, go to the Tasks page and click 'Create Task'. Fill in the details and submit.",
                metadata: { source: "Fallback Help", category: "tasks" },
            })
        );
    }
    if (queryLower.includes("failure") || queryLower.includes("error")) {
        fallbackArticles.push(
            new Document({
                pageContent:
                    "If you encounter a failure or error, please check the following:",
                metadata: { source: "Fallback Help", category: "troubleshooting" },
            })
        );
    }
    if (queryLower.includes("about us") || queryLower.includes("who we are")) {
        fallbackArticles.push(
            new Document({
                pageContent:
                    "We are a non-profit organization dedicated to helping NGOs manage their tasks and resources effectively.",
                metadata: { source: "Fallback Help", category: "about" },
            })
        );
    }
    if (queryLower.includes("volunteer") || queryLower.includes("get involved")) {
        fallbackArticles.push(
            new Document({
                pageContent:
                    "To get involved as a volunteer, visit the Volunteer page and fill out the application form.",
                metadata: { source: "Fallback Help", category: "volunteer" },
            })
        );
    }
    if (queryLower.includes("marketplace") || queryLower.includes("donate")) {
        fallbackArticles.push(
            new Document({
                pageContent:
                    "Visit the Marketplace page to view available items for donation. Click 'Donate' to contribute.",
                metadata: { source: "Fallback Help", category: "marketplace" },
            })
        );
    }
    if (queryLower.includes("login") || queryLower.includes("sign up")) {
        fallbackArticles.push(
            new Document({
                pageContent:
                    "To login, go to the Login page and enter your credentials. If you don't have an account, click 'Sign Up' to create one.",
                metadata: { source: "Fallback Help", category: "authentication" },
            })
        );
    }
    if (queryLower.includes("dashboard") || queryLower.includes("home")) {
        fallbackArticles.push(
            new Document({
                pageContent:
                    "The Dashboard is your home page where you can see an overview of tasks, recent activities, and NGO locations.",
                metadata: { source: "Fallback Help", category: "dashboard" },
            })
        );
    }
    if (queryLower.includes("services") || queryLower.includes("features") ) {
        fallbackArticles.push(
            new Document({
                pageContent:
                    "Our platform offers a variety of services including task management, NGO mapping, and donation tracking.",
                metadata: { source: "Fallback Help", category: "services" },
            })
        );
    }
    if (queryLower.includes("ngo") || queryLower.includes("location") || queryLower.includes("map")) {
        fallbackArticles.push(
            new Document({
                pageContent:
                    "View NGO locations on the Map page. Click any marker for details.",
                metadata: { source: "Fallback Help", category: "navigation" },
            })
        );
    }
    if (queryLower.includes("feed") || queryLower.includes("recent activities")) {
        fallbackArticles.push(
            new Document({
                pageContent:
                    "The Feed page shows recent activities and updates from NGOs. You can filter by date or NGO.",
                metadata: { source: "Fallback Help", category: "feed" },
            })
        );
    }
    if (queryLower.includes("add ngo") || queryLower.includes("manage ngo")) {
        fallbackArticles.push(
            new Document({
                pageContent:
                    "To add a new NGO, go to NGO Management and click 'Add NGO'. Fill in name, location, and contact info.",
                metadata: { source: "Fallback Help", category: "ngo" },
            })
        );
    }
    if (queryLower.includes("donation") || queryLower.includes("report")) {
        fallbackArticles.push(
            new Document({
                pageContent:
                    "View donation reports in Analytics. Select date range and click 'Generate Report'.",
                metadata: { source: "Fallback Help", category: "analytics" },
            })
        );
    }
    if (queryLower.includes("help") || queryLower.includes("support")) {
        fallbackArticles.push(
            new Document({
                pageContent:
                    "For help and support, you can visit our Help Center or contact support@ngo.org.",
                metadata: { source: "Fallback Help", category: "support" },
            })
        )
    }
    if (fallbackArticles.length === 0) {
        fallbackArticles.push(
            new Document({
                pageContent:
                    "I'm here to help with your NGO dashboard questions! You can create tasks, view NGO locations, manage NGOs, and access reports through the dashboard.",
                metadata: { source: "Fallback Help", category: "general" },
            })
        );
    }
    return fallbackArticles;
}

async function generateAnswer(query, contextDocs) {
    const contextText = contextDocs.map((doc) => doc.pageContent).join("\n\n");

    try {
        const prompt = `
You are an NGO dashboard assistant. Answer based on this context:
${contextText}

Question: ${query}

Respond concisely and helpfully. If the context doesn't contain the answer, just return that you dont know how to do that specific task.
`;

        const response = await chatModel.invoke(prompt);
        return (
            response.content ||
            "I couldn't generate a response. Please try again."
        );
    } catch (error) {
        console.error("Response generation failed:", error.message);
        return (
            contextDocs[0]?.pageContent ||
            getFallbackContent(query)[0].pageContent
        );
    }
}

async function getChatbotResponse(query) {
    if (!query || typeof query !== "string" || query.trim() === "") {
        return {
            answer: "Please provide a valid question.",
            sources: [],
            foundDocs: 0,
        };
    }
    try {
        const similarDocs = await searchArticles(query);
        const answer = await generateAnswer(query, similarDocs);

        return {
            answer,
            sources: similarDocs
                .map((doc) => doc.metadata.source)
                .filter(Boolean),
            foundDocs: similarDocs.length,
        };
    } catch (err) {
        console.error("Chatbot flow error:", err.message);
        return {
            answer: "I'm here to help with your NGO dashboard questions! You can create tasks, view NGO locations, manage NGOs, and access reports through the dashboard.",
            sources: [],
            foundDocs: 0,
        };
    }
}

async function setupKnowledgeBase() {
    const articles = [
        {
            content:
                "To create a task, go to the Tasks page and click 'Create Task'. Fill in the details and submit.",
            metadata: { source: "User Guide Section 3.2", category: "tasks" },
        },
        {
            content:
                "View NGO locations on the Map page. Click any marker for details.",
            metadata: {
                source: "User Guide Section 5.1",
                category: "navigation",
            },
        },
        {
            content:
                "To add a new NGO, go to NGO Management and click 'Add NGO'. Fill in name, location, and contact info.",
            metadata: { source: "User Guide Section 2.1", category: "ngo" },
        },
        {
            content:
                "View donation reports in Analytics. Select date range and click 'Generate Report'.",
            metadata: {
                source: "User Guide Section 4.3",
                category: "analytics",
            },
        },
    ];

    return await addArticles(articles);
}
module.exports = {
    initializeVectorStore,
    setupKnowledgeBase,
    getChatbotResponse,
    addArticles,
};