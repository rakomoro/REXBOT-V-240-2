const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "checkweb",
    description: "Check website status and information",
    cooldown: 3,
    nashPrefix: false,
    execute: async (api, event, args) => {
        const url = args[0];

        if (!url) {
            return api.sendMessage(
                "Please provide a URL to check.",
                event.threadID,
                event.messageID,
            );
        }

        api.sendMessage(
            "Checking the website information, please wait...",
            event.threadID,
            event.messageID,
        );

        try {
            const response = await axios.get(
                `${global.NashBot.ENDPOINT}checkweb?url=${encodeURIComponent(url)}`,
            );
            const data = response.data;

            if (data.status !== 200) {
                throw new Error("Failed to fetch website information.");
            }

            const message = `
╭───────────────╮
         🌐 𝗪𝗘𝗕 𝗦𝗧𝗔𝗧𝗨𝗦
╰───────────────╯
𝗧𝗶𝘁𝗹𝗲: ${data.title || "N/A"}
𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: ${data.description || "No description available"}
𝗖𝗼𝗻𝘁𝗲𝗻𝘁 𝗟𝗲𝗻𝗴𝘁𝗵: ${data.contentLength || "N/A"}
𝗖𝗼𝗻𝘁𝗲𝗻𝘁 𝗧𝘆𝗽𝗲: ${data.contentType || "N/A"}
𝗦𝗲𝗿𝘃𝗲𝗿: ${data.server || "N/A"}
𝗟𝗮𝘀𝘁 𝗠𝗼𝗱𝗶𝗳𝗶𝗲𝗱: ${data.lastModified || "N/A"}
𝗛𝗧𝗧𝗣 𝗩𝗲𝗿𝘀𝗶𝗼𝗻: ${data.httpVersion || "N/A"}
𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲 𝗧𝗶𝗺𝗲: ${data.responseTime || "N/A"}
𝗜𝗣 𝗔𝗱𝗱𝗿𝗲𝘀𝘀: ${data.ipAddress || "N/A"}
𝗥𝗲𝗱𝗶𝗿𝗲𝗰𝘁𝘀: ${data.redirects || "N/A"}
𝗖𝗼𝗼𝗸𝗶𝗲𝘀: ${data.cookies || "N/A"}
𝗖𝗮𝗰𝗵𝗲 𝗖𝗼𝗻𝘁𝗿𝗼𝗹: ${data.cacheControl || "N/A"}
𝗘𝗧𝗮𝗴: ${data.eTag || "N/A"}
𝗖𝗼𝗻𝘁𝗲𝗻𝘁 𝗘𝗻𝗰𝗼𝗱𝗶𝗻𝗴: ${data.contentEncoding || "N/A"}
            `;

            const imageUrl = data.screenshotURL || "";
            if (imageUrl) {
                const imagePath = path.resolve(__dirname, "screenshot.png");

                const imageResponse = await axios({
                    url: imageUrl,
                    method: "GET",
                    responseType: "stream",
                });

                imageResponse.data
                    .pipe(fs.createWriteStream(imagePath))
                    .on("finish", () => {
                        api.sendMessage(
                            {
                                body: message,
                                attachment: fs.createReadStream(imagePath),
                            },
                            event.threadID,
                            () => {
                                fs.unlinkSync(imagePath);
                            },
                        );
                    });
            } else {
                api.sendMessage(message, event.threadID, event.messageID);
            }
        } catch (error) {
            api.sendMessage(
                `An error occurred: ${error.message}`,
                event.threadID,
                event.messageID,
            );
        }
    },
};
