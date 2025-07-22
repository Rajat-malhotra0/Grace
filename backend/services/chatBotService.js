const dotenv = require("dotenv");
dotenv.config();

const { QdrantVectorStore } = require("@langchain/qdrant");
const {
    GoogleGenerativeAIEmbeddings,
    ChatGoogleGenerativeAI,
} = require("@langchain/google-genai");
const { Document } = require("@langchain/core/documents");
const { PromptTemplate } = require("@langchain/core/prompts");

const collectionName = "help_articles";

const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: "embedding-001",
});

const chatModel = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: "gemini-2.0-flash",
    temperature: 0,
});

let vectorStore = null;

async function initializeVectorStore() {
    try {
        vectorStore = new QdrantVectorStore(embeddings, {
            url: process.env.QDRANT_URL,
            apiKey: process.env.QDRANT_API_KEY,
            collectionName: collectionName,
            checkCompatibility: false,
        });

        console.log("Successfully connected to Qdrant");
    } catch (error) {
        console.warn("Could not connect to Qdrant:", error.message);
        console.warn("Chatbot will use fallback responses only");
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
    } catch (error) {
        console.error("Error adding articles:", error.message);
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
    if (queryLower.includes("ngo") || queryLower.includes("location")) {
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

    const promptTemplate = PromptTemplate.fromTemplate(`
You are a helpful assistant for an NGO dashboard.

Context:
{context}

User Question:
{question}

Answer clearly and concisely. If the answer is not in context, say: "I don't have information about that. Please contact support."
`);

    try {
        const finalPrompt = await promptTemplate.format({
            context: contextText,
            question: query,
        });

        const response = await chatModel.invoke(finalPrompt);
        return response.content;
    } catch (error) {
        console.error("Error generating response:", error.message);

        if (contextDocs.length > 0) {
            return contextDocs[0].pageContent;
        }

        return "I'm having some technical issues right now, but I'd be happy to help! You can create tasks from the Tasks page, view NGO locations on the Map, or check donation reports in Analytics. Please contact support if you need more specific help.";
    }
}

async function getChatbotResponse(query) {
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

    await addArticles(articles);
}
module.exports = {
    initializeVectorStore,
    setupKnowledgeBase,
    getChatbotResponse,
    addArticles,
};
