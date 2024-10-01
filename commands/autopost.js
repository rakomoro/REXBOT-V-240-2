const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: "autopost",
    description: "Automatically posts a random dog image immediately and then every hour.",
    nashPrefix: false,
    version: "1.0.0",
    role: "admin",
    cooldowns: 5,
    async execute(api, event) {
        const { threadID } = event;
        let isActive = false;

        const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

        const downloadImage = async (url) => {
            const imagePath = path.join(__dirname, 'tempImage.jpg');
            const response = await axios({
                method: 'GET',
                url,
                responseType: 'stream'
            });

            return new Promise((resolve, reject) => {
                const stream = response.data.pipe(fs.createWriteStream(imagePath));
                stream.on('finish', () => resolve(imagePath));
                stream.on('error', (err) => reject(err));
            });
        };

        const postImage = async () => {
            try {
                let imageUrl;
                let attempts = 0;

                do {
                    const response = await axios.get("https://nash-rest-api-production.up.railway.app/random-dog-image");
                    imageUrl = response.data.url;
                    attempts++;
                } while (!validImageExtensions.some(ext => imageUrl.endsWith(ext)) && attempts < 5);

                if (!validImageExtensions.some(ext => imageUrl.endsWith(ext))) {
                    throw new Error('No valid image found after several attempts.');
                }

                const imagePath = await downloadImage(imageUrl);

                await api.createPost({
                    attachment: fs.createReadStream(imagePath),
                    visibility: "Everyone"
                });

                fs.unlinkSync(imagePath);
            } catch (error) {
            }
        };

        const startAutoPost = () => {
            isActive = true;
            postImage();
            setInterval(() => {
                if (isActive) {
                    postImage();
                }
            }, 3600000);
            api.sendMessage("┌─[ AUTOPOST ]─────[ # ]\n└───► Auto-post is now active!", threadID);
        };

        const stopAutoPost = () => {
            isActive = false;
            api.sendMessage("┌─[ AUTOPOST ]─────[ # ]\n└───► Auto-post has been stopped!", threadID);
        };

        if (event.body.toLowerCase() === 'autopost on') {
            startAutoPost();
        } else if (event.body.toLowerCase() === 'autopost off') {
            stopAutoPost();
        }
    },
};