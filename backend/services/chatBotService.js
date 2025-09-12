const dotenv = require("dotenv");
dotenv.config();

const Article = require("../models/article");

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

    if (
        queryLower.includes("marketplace") ||
        queryLower.includes("donate") ||
        queryLower.includes("donation")
    ) {
        fallbackArticles.push(
            new Document({
                pageContent:
                    "The Grace Marketplace connects NGO needs with donor generosity. Browse donation categories like Food & Nutrition, Clothing, Books, Medical Supplies, Technology, and more. Each category shows real-time needs from verified NGOs. Click 'I Can Help' to fulfill a need.",
                metadata: { source: "Fallback Help", category: "donations" },
            })
        );
    }
    if (
        queryLower.includes("volunteer") ||
        queryLower.includes("volunteering")
    ) {
        fallbackArticles.push(
            new Document({
                pageContent:
                    "Register as a volunteer by selecting your type (individual, school, corporate, internship, or career). Take our skills quiz to get matched with suitable opportunities. Browse NGO profiles to find volunteer roles like teaching, mentoring, meal preparation, and administrative support.",
                metadata: { source: "Fallback Help", category: "users" },
            })
        );
    }
    if (
        queryLower.includes("ngo") ||
        queryLower.includes("register") ||
        queryLower.includes("organization")
    ) {
        fallbackArticles.push(
            new Document({
                pageContent:
                    "NGOs can register by selecting 'NGO' role during signup. Complete organization details including name, registration number, contact info, and focus areas. Create volunteer opportunities, post marketplace needs, and manage your profile. A team member will verify your information.",
                metadata: { source: "Fallback Help", category: "ngo" },
            })
        );
    }
    if (
        queryLower.includes("task") ||
        queryLower.includes("dashboard") ||
        queryLower.includes("manage")
    ) {
        fallbackArticles.push(
            new Document({
                pageContent:
                    "NGO admins can access dashboards to manage operations. Create and assign tasks, track volunteer hours, monitor donation requests, view analytics, and coordinate team activities. Access marketplace insights and volunteer analytics for performance tracking.",
                metadata: { source: "Fallback Help", category: "tasks" },
            })
        );
    }
    if (
        queryLower.includes("profile") ||
        queryLower.includes("account") ||
        queryLower.includes("settings")
    ) {
        fallbackArticles.push(
            new Document({
                pageContent:
                    "Manage your profile by clicking your name in the header. Update personal information, change password, manage notification preferences, and view contribution history. Different user types (NGO, Volunteer, Donor) have specific features and access levels.",
                metadata: { source: "Fallback Help", category: "users" },
            })
        );
    }
    if (
        queryLower.includes("quiz") ||
        queryLower.includes("skills") ||
        queryLower.includes("assessment")
    ) {
        fallbackArticles.push(
            new Document({
                pageContent:
                    "Take our volunteer skills quiz to discover how you can best contribute. The quiz assesses your interests, skills, and availability to recommend suitable volunteer opportunities and NGO matches. Retake anytime as your interests evolve.",
                metadata: { source: "Fallback Help", category: "users" },
            })
        );
    }

    if (fallbackArticles.length === 0) {
        fallbackArticles.push(
            new Document({
                pageContent:
                    "Welcome to Grace! I can help you with marketplace donations, volunteer opportunities, NGO registration, dashboard management, profile settings, and skills assessments. Grace connects NGOs with volunteers and donors through our comprehensive platform. What would you like to know about?",
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
            answer: "Welcome to Grace! I can help you with marketplace donations, volunteer opportunities, NGO registration, dashboard management, and platform navigation. What would you like to know about?",
            sources: [],
            foundDocs: 0,
        };
    }
}

async function setupKnowledgeBase() {
    try {
        const articles = await Article.find({ isActive: true }).sort({
            createdAt: -1,
        });
        if (articles.length === 0) {
            console.warn(
                "No articles found in database. Please seed the database first."
            );
            return false;
        }
        const formattedArticles = articles.map((article) => ({
            content: `${article.title}\n\n${article.content}`,
            metadata: {
                source: article.source,
                category: article.category,
                title: article.title,
                tags: article.tags.join(", "),
                id: article._id.toString(),
            },
        }));
        console.log(
            `Setting up knowledge base with ${formattedArticles.length} articles from database`
        );
        return await addArticles(formattedArticles);
    } catch (error) {
        console.error(
            "Error setting up knowledge base from database:",
            error.message
        );
        return await setupFallbackKnowledgeBase();
    }
}

async function setupFallbackKnowledgeBase() {
    console.log("Using fallback knowledge base (hardcoded articles)");
    const fallbackArticles = [
        {
            content:
                "Getting Started with Grace\n\nGrace is a comprehensive NGO management platform that connects NGOs with volunteers and donors. Create an account, complete your profile, and start making an impact. NGOs can list needs, manage volunteers, and track donations. Volunteers find opportunities that match their skills. Donors discover causes and contribute through our marketplace.",
            metadata: {
                source: "Fallback - Getting Started Guide",
                category: "general",
                title: "Getting Started with Grace",
            },
        },
        {
            content:
                "Grace Marketplace\n\nThe marketplace connects NGO needs with donor generosity. Browse categories like Food & Nutrition, Clothing, Books, Medical Supplies, Technology, and more. Each shows real-time needs from verified NGOs with quantity, urgency, and location details. Click 'I Can Help' to fulfill needs.",
            metadata: {
                source: "Fallback - Marketplace Guide",
                category: "donations",
                title: "Grace Marketplace",
            },
        },
        {
            content:
                "Volunteer Opportunities\n\nRegister as individual, school, corporate, internship, or career volunteer. Take our skills quiz for personalized NGO recommendations. Browse NGO profiles for roles like teaching, mentoring, meal preparation, and admin support. Contact NGOs directly through volunteer buttons.",
            metadata: {
                source: "Fallback - Volunteer Guide",
                category: "users",
                title: "Volunteer Opportunities",
            },
        },
        {
            content:
                "NGO Registration\n\nNGOs register by selecting 'NGO' role and providing organization details: name, registration number, contact info, focus areas. Create volunteer opportunities, post marketplace needs, manage profiles. Team verification required for public profile activation.",
            metadata: {
                source: "Fallback - NGO Guide",
                category: "ngo",
                title: "NGO Registration",
            },
        },
        {
            content:
                "Dashboard and Analytics\n\nNGO admins access comprehensive dashboards for operations management. Create tasks, track volunteer hours, monitor donations, view analytics. Marketplace insights show fulfillment rates and trends. Volunteer analytics display engagement and performance metrics.",
            metadata: {
                source: "Fallback - Dashboard Guide",
                category: "analytics",
                title: "Dashboard and Analytics",
            },
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
        console.error(
            "Error adding new article to vector store:",
            error.message
        );
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
