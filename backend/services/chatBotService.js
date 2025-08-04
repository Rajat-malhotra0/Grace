const dotenv = require("dotenv");
dotenv.config();

const Article = require("../models/article");

const { QdrantVectorStore } = require("@langchain/qdrant");
const {GoogleGenerativeAIEmbeddings,ChatGoogleGenerativeAI,} = require("@langchain/google-genai");
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
    if (queryLower.includes("ngo") || queryLower.includes("location") || queryLower.includes("map")) {
        fallbackArticles.push(
            new Document({
                pageContent:
                    "View NGO locations on the Map page. Click any marker for details.",
                metadata: { source: "Fallback Help", category: "navigation" },
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
    if (queryLower.includes("add ngo") || queryLower.includes("new ngo")) {
        fallbackArticles.push(
            new Document({
                pageContent:
                    "To add a new NGO, go to NGO Management and click 'Add NGO'. Fill in name, location, and contact info.",
                metadata: { source: "Fallback Help", category: "ngo" },
            })
        );
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
    try {
        // Fetch all active articles from database
        const articles = await Article.find({ isActive: true }).sort({ createdAt: -1 });
        if (articles.length === 0) {
            console.warn("No articles found in database. Please seed the database first.");
            return false;
        }
        // Convert database articles to the format expected by vector store
        const formattedArticles = articles.map(article => ({
            content: `${article.title}\n\n${article.content}`,
            metadata: {
                source: article.source,
                category: article.category,
                title: article.title,
                tags: article.tags.join(", "),
                id: article._id.toString(),
            },
        }));
        console.log(`Setting up knowledge base with ${formattedArticles.length} articles from database`);
        return await addArticles(formattedArticles);
    } catch (error) {
        console.error("Error setting up knowledge base from database:", error.message);
        // Fallback to hardcoded articles if database fails
        return await setupFallbackKnowledgeBase();
    }
}

async function setupFallbackKnowledgeBase() {
    console.log("Using fallback knowledge base (hardcoded articles)");
    const fallbackArticles = [
        {
            content: "Creating Tasks\n\nTo create a task, go to the Tasks page and click 'Create Task'. Fill in the details and submit.",
            metadata: { source: "Fallback - User Guide Section 3.2", category: "tasks", title: "Creating Tasks" },
        },
        {
            content: "NGO Location Mapping\n\nView NGO locations on the Map page. Click any marker for details.",
            metadata: { source: "Fallback - User Guide Section 5.1", category: "navigation", title: "NGO Location Mapping" },
        },
        {
            content: "Adding New NGO\n\nTo add a new NGO, go to NGO Management and click 'Add NGO'. Fill in name, location, and contact info.",
            metadata: { source: "Fallback - User Guide Section 2.1", category: "ngo", title: "Adding New NGO" },
        },
        {
            content: "Donation Reports\n\nView donation reports in Analytics. Select date range and click 'Generate Report'.",
            metadata: { source: "Fallback - User Guide Section 4.3", category: "analytics", title: "Donation Reports" },
        },
    ];
    return await addArticles(fallbackArticles);
}

async function refreshKnowledgeBase() {
    console.log("Refreshing knowledge base from database...");
    return await setupKnowledgeBase();
}

async function addNewArticleToVectorStore(articleId) {
    try {
        const article = await Article.findById(articleId);
        if (!article || !article.isActive) {
            console.warn("Article not found or inactive:", articleId);
            return false;
        }
        const formattedArticle = {
            content: `${article.title}\n\n${article.content}`,
            metadata: {
                source: article.source,
                category: article.category,
                title: article.title,
                tags: article.tags.join(", "),
                id: article._id.toString(),
            },
        };
        return await addArticles([formattedArticle]);
    } catch (error) {
        console.error("Error adding new article to vector store:", error.message);
        return false;
    }
}

module.exports = {
    initializeVectorStore,
    setupKnowledgeBase,
    refreshKnowledgeBase,
    addNewArticleToVectorStore,
    getChatbotResponse,
    addArticles,
};