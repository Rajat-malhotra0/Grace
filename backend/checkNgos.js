require("dotenv").config();
const mongoose = require("mongoose");
const Ngo = require("./models/ngo");

async function checkNgos() {
    try {
        await mongoose.connect("mongodb://localhost:27017/Grace");

        console.log("=== ALL NGOs IN DATABASE ===");
        const allNgos = await Ngo.find(
            {},
            "name coverImage contact.email"
        ).sort({ name: 1 });

        console.log(`Total NGOs found: ${allNgos.length}\n`);

        let withImages = 0;
        let withoutImages = 0;

        allNgos.forEach((ngo, index) => {
            console.log(`${index + 1}. ${ngo.name}`);
            console.log(`   Email: ${ngo.contact?.email || "N/A"}`);
            if (
                ngo.coverImage &&
                ngo.coverImage.url &&
                ngo.coverImage.url !== ""
            ) {
                console.log(`   Cover Image: ✅ ${ngo.coverImage.url}`);
                console.log(`   Public ID: ${ngo.coverImage.publicId}`);
                withImages++;
            } else {
                console.log(`   Cover Image: ❌ EMPTY`);
                withoutImages++;
            }
            console.log("   ---");
        });

        console.log(`\n=== SUMMARY ===`);
        console.log(`NGOs with cover images: ${withImages}`);
        console.log(`NGOs without cover images: ${withoutImages}`);

        await mongoose.connection.close();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

checkNgos();
