const https = require("https");
const fs = require("fs");
const path = require("path");

const downloadImage = (url, filename) => {
    return new Promise((resolve, reject) => {
        const imagesDir = path.join(__dirname, "../assets/ngo-images");

        // Create directory if it doesn't exist
        if (!fs.existsSync(imagesDir)) {
            fs.mkdirSync(imagesDir, { recursive: true });
        }

        const imagePath = path.join(imagesDir, filename);
        const file = fs.createWriteStream(imagePath);

        https
            .get(url, (response) => {
                response.pipe(file);
                file.on("finish", () => {
                    file.close();
                    console.log(`✅ Downloaded: ${filename}`);
                    resolve();
                });
            })
            .on("error", (err) => {
                fs.unlink(imagePath, () => {}); // Delete file on error
                reject(err);
            });
    });
};

const downloadAllImages = async () => {
    const images = [
        {
            url: "https://picsum.photos/400/300?random=1",
            filename: "hope-foundation.jpg",
        },
        {
            url: "https://picsum.photos/400/300?random=2",
            filename: "care-india.jpg",
        },
        {
            url: "https://picsum.photos/400/300?random=3",
            filename: "smile-foundation.jpg",
        },
        {
            url: "https://picsum.photos/400/300?random=4",
            filename: "green-earth.jpg",
        },
        {
            url: "https://picsum.photos/400/300?random=5",
            filename: "urban-uplift.jpg",
        },
        {
            url: "https://picsum.photos/400/300?random=6",
            filename: "village-connect.jpg",
        },
    ];

    console.log("📥 Downloading NGO placeholder images...");

    for (const image of images) {
        try {
            await downloadImage(image.url, image.filename);
            // Add delay to avoid rate limiting
            await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
            console.error(
                `❌ Failed to download ${image.filename}:`,
                error.message
            );
        }
    }

    console.log("🎉 Image download completed!");
};

// Run the download if called directly
if (require.main === module) {
    downloadAllImages()
        .then(() => {
            console.log("✅ All images downloaded successfully!");
            process.exit(0);
        })
        .catch((error) => {
            console.error("💥 Image download failed:", error);
            process.exit(1);
        });
}

module.exports = { downloadAllImages };
