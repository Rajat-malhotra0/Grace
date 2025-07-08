const express = require("express");
const connectDB = require("./db/connect");
const http = require("http");
const SocketService = require("./services/socketService");

const userRoutes = require("./routes/userRoutes");
const donationRoutes = require("./routes/donationRoutes");
const impactStoryRoutes = require("./routes/impactStoryRoutes");
const ngoRoutes = require("./routes/ngoRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const skillSurveyRoutes = require("./routes/skillSurveyRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/ngos", ngoRoutes);
app.use("/api/skill-surveys", skillSurveyRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/impact-stories", impactStoryRoutes);

async function run() {
    await connectDB();
    console.log("Connected to MongoDB");

    const server = http.createServer(app);
    SocketService(server);

    server.listen(3001, () => {
        console.log("Server is running on http://localhost:3001");
    });
}

run();
