const axios = require("axios");

async function llamaAPI(query) {
    try {
        const response = await axios.get(`${global.NashBot.ENDPOINT}Llama?q=${encodeURIComponent(query)}`);
        
        if (response.data && response.data.response) {
            return response.data.response;
        } else {
            return "Unexpected API response format. Please check the API or contact support.";
        }
    } catch (error) {
        return "Failed to fetch data. Please try again later.";
    }
}

module.exports = {
    name: "llama",
    description: "tanginamo",
    nashPrefix: true,
    version: "1.0.0",
    role: 0,
    cooldowns: 5,
    aliases: ["llama"],
    async execute(api, event, args) {
        const { threadID, messageID } = event;
        let query = args.join(" ");
        
        if (!query) {
            return api.sendMessage("Please enter a query to send.", threadID, messageID);
        }

        api.sendMessage(
            "[✦ Llama ✦]\n\n" +
            "Processing your request...",
            threadID,
            async (err, info) => {
                if (err) return;
                try {
                    const response = await llamaAPI(query);
                    api.editMessage(
                        "[✦ Llama ✦]\n\n" +
                        response,
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
