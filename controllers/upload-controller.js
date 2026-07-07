import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp'; 

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'No image file provided' 
            });
        }

        const compressedBuffer = await sharp(req.file.buffer)
            .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true }) 
            .webp({ quality: 80 }) 
            .toBuffer();

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'products', 
                format: 'webp'
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary Error:", error);
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Cloudinary upload failed'
                    });
                }

                return res.status(200).json({
                    success: true,
                    message: 'Image uploaded and compressed successfully',
                    imageUrl: result.secure_url 
                });
            }
        );

        uploadStream.end(compressedBuffer);

    } catch (err) {
        console.error("Server Error during image optimization:", err);
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error during image processing'
        });
    }
};