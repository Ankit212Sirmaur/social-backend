const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Set up multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to handle file upload
const uploadMiddleware = upload.single('postImg');

// Function to upload image to Cloudinary
const uploadImageToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: 'postImg' }, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result.url); // Return the URL of the uploaded image
            }
        });
        stream.end(buffer);
    });
};

// Export the middleware and function
module.exports = {
    uploadMiddleware,
    uploadImageToCloudinary,
};
