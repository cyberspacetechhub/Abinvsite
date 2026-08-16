const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const filesPayloadExists = require('../middlewares/filesPayloadExists');
const fileExtLimiter = require('../middlewares/fileExtLimiter');
const filesSizeLimiter = require('../middlewares/filiesSizeLimiter');
const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post('/',
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter(['.png', '.jpg', '.jpeg', '.webp', '.gif']),
    filesSizeLimiter,
    async (req, res) => {
        try {
            const file = Object.values(req.files)[0];
            const compressed = await sharp(file.data)
                .resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true })
                .webp({ quality: 80 })
                .toBuffer();

            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'kryptogain' },
                    (err, result) => err ? reject(err) : resolve(result)
                );
                stream.end(compressed);
            });

            res.status(200).json({ url: result.secure_url });
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }
);

module.exports = router;
