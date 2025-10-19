/**
 * Volunteer Application Email Testing
 *
 * This file demonstrates how to test the volunteer application email functionality.
 * Run this file to send test emails for different scenarios.
 *
 * Make sure you have the following in your .env file:
 * - GMAIL_USER=your-email@gmail.com
 * - GMAIL_APP_PASS=your-app-specific-password
 * - EMAIL_FROM=Grace <no-reply@grace.org>
 *
 * To run this test:
 * node backend/test/volunteerApplicationMailTest.js
 */

require("dotenv").config();
const {
    sendVolunteerApplicationNotification,
    sendVolunteerApplicationAccepted,
    sendVolunteerApplicationRejected,
    sendVolunteerApplicationUpdate,
} = require("../services/mailService");

async function runEmailTests() {
    console.log("🧪 Starting Volunteer Application Email Tests...\n");

    const testEmail = process.env.TEST_EMAIL || "test@example.com";

    try {
        // Test 1: New Application Notification to NGO
        console.log("📧 Test 1: Sending application notification to NGO...");
        await sendVolunteerApplicationNotification({
            to: testEmail,
            ngoName: "Green Earth Foundation",
            opportunityTitle: "Beach Cleanup Volunteer",
            applicantName: "John Doe",
            applicantEmail: "john.doe@example.com",
            message:
                "I'm passionate about environmental conservation and would love to contribute to this initiative. I have experience organizing community events.",
        });
        console.log("✅ Test 1 Passed\n");

        // Test 2: Application Accepted
        console.log("📧 Test 2: Sending acceptance email to applicant...");
        await sendVolunteerApplicationAccepted({
            to: testEmail,
            applicantName: "Jane Smith",
            opportunityTitle: "Food Bank Assistant",
            ngoName: "Community Care Center",
        });
        console.log("✅ Test 2 Passed\n");

        // Test 3: Application Rejected
        console.log("📧 Test 3: Sending rejection email to applicant...");
        await sendVolunteerApplicationRejected({
            to: testEmail,
            applicantName: "Mike Johnson",
            opportunityTitle: "Education Mentor",
            ngoName: "Youth Empowerment Trust",
        });
        console.log("✅ Test 3 Passed\n");

        // Test 4: Custom Update
        console.log("📧 Test 4: Sending custom update to applicant...");
        await sendVolunteerApplicationUpdate({
            to: testEmail,
            applicantName: "Sarah Williams",
            opportunityTitle: "Animal Shelter Helper",
            ngoName: "Paws & Claws Rescue",
            updateMessage:
                "We wanted to inform you that the volunteer orientation has been rescheduled to next Saturday at 10 AM. Please bring a valid ID and wear comfortable clothing. We're excited to have you join our team!",
        });
        console.log("✅ Test 4 Passed\n");

        console.log("🎉 All tests completed successfully!");
        console.log("\n📬 Check your inbox at:", testEmail);
    } catch (error) {
        console.error("❌ Test failed:", error);
        process.exit(1);
    }
}

// Run the tests
runEmailTests()
    .then(() => {
        console.log("\n✨ Email testing complete!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n💥 Fatal error:", error);
        process.exit(1);
    });
