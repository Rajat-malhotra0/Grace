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
const dashboardRoutes = require("./routes/dashboardRoutes");
const chatBotRoutes = require("./routes/chatBotRoutes");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/ngos", ngoRoutes);
app.use("/api/skill-surveys", skillSurveyRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/impact-stories", impactStoryRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/chatbot", chatBotRoutes);

async function run() {
    try {
        await connectDB();
        console.log("Connected to MongoDB");

        // Initialize chatbot vector store
        await chatBotService.initializeVectorStore();
        console.log("Chatbot vector store initialized");

        const server = http.createServer(app);
        socketService.init(server);

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
