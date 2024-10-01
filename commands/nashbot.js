const axios = require("axios");

async function nashbotAPI(prompt) {
    try {
        const response = await axios.get(`${global.NashBot.ENDPOINT}nashbot?prompt=${encodeURIComponent(prompt)}`);

        
        if (response.data && response.data.response) {
            return response.data.response;
        } else {
            return "Unexpected response format. Please check the API or contact support.";
        }
    } catch (error) {
        console.error("Error fetching data:", error.message);
        return "Failed to fetch data. Please try again later.";
    }
}

module.exports = {
    name: "nashbot",
    description: "nakaw pa gago",
    nashPrefix: true,
    version: "1.0.0",
    role: 0,
    cooldowns: 5,
    aliases: ["nashbot"],
    async execute(api, event, args) {
        const { threadID, messageID, senderID } = event;
        let prompt = args.join(" ");
        
        if (!prompt) {
            return api.sendMessage("Please enter a prompt to send.", threadID, messageID);
        }

        api.sendMessage(
            "[✦ Nashbot ✦]\n\n" +
            "Processing your request...",
            threadID,
            async (err, info) => {
                if (err) return;
                try {
                    const response = await nashbotAPI(prompt);
                    api.editMessage(
                        "[ ✦Nashbot✦]\n\n" +
                        `${response}\n\nHow to unsend a message?, react to it with a thumbs up (👍). If you are the sender, the bot will automatically unsend the message.`,
                        info.messageID
                    );
                } catch (g) {
                    api.sendMessage("Error processing your request: " + g.message, threadID, messageID);
                }
            },
            messageID
        );
    },
};
