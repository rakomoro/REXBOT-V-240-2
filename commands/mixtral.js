const axios = require("axios");

async function mixtralAPI(userId, message) {
    try {
        const response = await axios.get(`https://nash-rest-api-production.up.railway.app/Mixtral?userId=${userId}&message=${encodeURIComponent(message)}`);
        
        if (response.data && response.data.response) {
            return response.data.response;
        } else {
            return "Unexpected API response format. Please check the API or contact support.";
        }
    } catch (error) {
        console.error("Error fetching data:", error.message);
        return "Failed to fetch data. Please try again later.";
    }
}

module.exports = {
    name: "mixtral",
    description: "Interact with Mixtral conversational AI",
    nashPrefix: false,
    version: "1.0.0",
    role: 0,
    cooldowns: 5,
    aliases: ["mixtral"],
    async execute(api, event, args) {
        const { threadID, messageID, senderID } = event;
        let message = args.join(" ");
        if (message.toLowerCase() === "clear") {
            try {
                const response = await mixtralAPI(senderID, "clear");
                return api.sendMessage(
                    "[ 𝙼𝚒𝚡𝚝𝚛𝚊𝚕 𝙰𝙸 ]\n\n" +
                    response +
                    "\n\n[ 𝚁𝙴𝙿𝙻𝚈 𝚃𝙾 𝚃𝙷𝙸𝚂 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 𝚃𝙾 𝚂𝚃𝙰𝚁𝚃 𝙰 𝙽𝙴𝚆 𝙲𝙾𝙽𝚅𝙴𝚁𝚂𝙰𝚃𝙸𝙾𝙽 ]\n\nHow to unsend a message?, react to it with a thumbs up (👍). If you are the sender, the bot will automatically unsend the message.",
                    threadID,
                    messageID
                );
            } catch (g) {
                return api.sendMessage("Error processing your request: " + g.message, threadID, messageID);
            }
        }
        
        if (!message) return api.sendMessage("Please enter a message to send.", threadID, messageID);

        api.sendMessage(
            "[ 𝙼𝚒𝚡𝚝𝚛𝚊𝚕 𝙰𝙸 ]\n\n" +
            "antay ka gago..." +
            '\n\n[ 𝚃𝚢𝚙𝚎 "𝚌𝚕𝚎𝚊𝚛" 𝚝𝚘 𝚛𝚎𝚜𝚎𝚝 𝚌𝚘𝚗𝚟𝚎𝚛𝚜𝚊𝚝𝚒𝚘𝚗 ]',
            threadID,
            async (err, info) => {
                if (err) return;
                try {
                    const response = await mixtralAPI(senderID, message);
                    api.editMessage(
                        "[ 𝙼𝚒𝚡𝚝𝚛𝚊𝚕 𝙰𝙸 ]\n\n" +
                        response +
                        "\n\n[ 𝚁𝙴𝙿𝙻𝚈 𝚃𝙾 𝚃𝙷𝙸𝚂 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 𝚃𝙾 𝙲𝙾𝙽𝚃𝙸𝙽𝚄𝙴 𝚃𝙷𝙴 𝙲𝙾𝙽𝚅𝙴𝚁𝚂𝙰𝚃𝙸𝙾𝙽 𝚆𝙸𝚃𝙷 𝙼𝚒𝚡𝚝𝚛𝚊𝚕 ]\n\nHow to unsend a message?, react to it with a thumbs up (👍). If you are the sender, the bot will automatically unsend the message.",
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
