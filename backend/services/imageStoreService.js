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
                { width: 500, height: 500, crop: "limit" }, // Preserve aspect ratio, max width 500px
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

// Upload video to Cloudinary
const uploadVideo = async (videoPath, folder = "grace-videos") => {
    try {
        const result = await cloudinary.uploader.upload(videoPath, {
            folder: folder,
            resource_type: "video",
            transformation: [{ quality: "auto", fetch_format: "auto" }],
        });
        return {
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            duration: result.duration,
        };
    } catch (error) {
        console.error("Cloudinary video upload error:", error);
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

// Upload image from buffer (for file uploads)
const uploadImageFromBuffer = async (buffer, folder = "grace-feed-images") => {
    try {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: folder,
                    resource_type: 'image',
                    transformation: [
                        { width: 800, height: 800, crop: 'limit' },
                        { quality: 'auto', fetch_format: 'auto' }
                    ]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                        width: result.width,
                        height: result.height
                    });
                }
            ).end(buffer);
        });
    } catch (error) {
        console.error("Cloudinary buffer upload error:", error);
        throw error;
    }
};

module.exports = {
    cloudinary,
    uploadImage,
    uploadVideo,
    deleteImage,
    uploadImageFromBuffer,
};
