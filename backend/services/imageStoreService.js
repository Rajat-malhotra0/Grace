const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (imagePath, folder = "grace-ngos") => {
    try {
        const result = await cloudinary.uploader.upload(imagePath, {
            folder: folder,
            resource_type: "image",
            transformation: [
                { width: 500, crop: "limit" }, // Preserve aspect ratio, max width 500px
                { quality: "auto", fetch_format: "auto" },
            ],
        });
        return {
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
        };
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;
    }
};

// Delete image from Cloudinary
const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error("Cloudinary delete error:", error);
        throw error;
    }
};

module.exports = {
    cloudinary,
    uploadImage,
    deleteImage,
};
