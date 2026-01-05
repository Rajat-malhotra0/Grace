require("dotenv").config();

const express = require("express");
const connectDB = require("./db/connect");
const cors = require("cors");
const http = require("http");
const socketService = require("./services/socketService");
const chatBotService = require("./services/chatBotService");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const donationRoutes = require("./routes/donationRoutes");
const impactStoryRoutes = require("./routes/impactStoryRoutes");
const ngoRoutes = require("./routes/ngoRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const skillSurveyRoutes = require("./routes/skillSurveyRoutes");
const taskRoutes = require("./routes/taskRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const chatBotRoutes = require("./routes/chatBotRoutes");
const quizRoutes = require("./routes/quizRoutes");
const ngoRecommendationRoutes = require("./routes/ngoRecommendationRoutes");
const graceFeedRoutes = require("./routes/GraceFeedRoutes");
const marketplaceRoutes = require("./routes/marketplaceRoutes");
const articleRoutes = require("./routes/articleRoutes");

const ngoReportRoutes = require("./routes/ngoReportRoutes");
const adminRoutes = require("./routes/adminRoutes");
const volunteerApplicationRoutes = require("./routes/volunteerApplicationRoutes");

const app = express();

app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
    "http://localhost:3000",
    "http://192.168.1.19:3000",
    process.env.CORS_ORIGIN,
].filter(Boolean);

app.use(
    cors({
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/ngosRecommendations", ngoRecommendationRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/chatbot", chatBotRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/feed", graceFeedRoutes);
app.use("/api/impact-stories", impactStoryRoutes);
app.use("/api/ngos", ngoRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/skill-surveys", skillSurveyRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/ngo-reports", ngoReportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/volunteer-applications", volunteerApplicationRoutes);

app.get("/api/test", (req, res) => {
    res.json({ message: "Backend is working!" });
});

async function run() {
    try {
        await connectDB();
        console.log("Connected to MongoDB");

        await chatBotService.initializeVectorStore();
        console.log("Chatbot vector store initialized");

        const server = http.createServer(app);
        socketService.init(server, { allowedOrigins });

        const PORT = process.env.PORT || 3001;
        server.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

run();
