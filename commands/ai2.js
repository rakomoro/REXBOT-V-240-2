const axios = require("axios");

async function aic(q, uid) {
    try {
        const response = await axios.get(`${global.NashBot.END}gpt4?prompt=${encodeURIComponent(q)}&uid=${uid}`);
        return response.data.gpt4;
    } catch (error) {
        console.error("Error fetching data:", error.message);
        return "Failed to fetch data. Please try again later.";
    }
}

module.exports = {
    name: "ai2",
    description: "Talk to GPT4 (conversational)",
    nashPrefix: false,
    version: "1.0.2",
    role: "user",
    cooldowns: 5,
    aliases: ["ai"],
    execute(api, event, args, prefix) {
        const { threadID, messageID, senderID } = event;
        let prompt = args.join(" ");
        if (!prompt) return api.sendMessage("Please enter a prompt.", threadID, messageID);
        
        if (!global.handle) {
            global.handle = {};
        }
        if (!global.handle.replies) {
            global.handle.replies = {};
        }

        api.sendMessage(
            "[ 𝙲𝙾𝙽𝚅𝙴𝚁𝚂𝙰𝚃𝙸𝙾𝙽𝙰𝙻 𝙰𝙸 ]\n\n" +
            "🔍 Searching for answer...📖" +
            '\n\n[ 𝚃𝚢𝚙𝚎 "/help" 𝚝𝚘 see all commands ]',
            threadID,
            async (err, info) => {
                if (err) return;
                try {
                    const response = await aic(prompt, senderID);
                    api.editMessage(
                        "[ 𝙲𝙾𝙽𝚅𝙴𝚁𝚂𝙰𝚃𝙸𝙾𝙽𝙰𝙻 𝙰𝙸 ]\n\n" +
                        response +
                        "\n\n[ 📜Important notice bot is not for Sale if someone sale it please report it ]\n\nHow to unsend a message?, react to it with a thumbs up (👍). If you are the sender, the bot will automatically unsend the message.",
                        info.messageID
                    );
                    global.handle.replies[info.messageID] = {
                        cmdname: module.exports.name,
                        this_mid: info.messageID,
                        this_tid: info.threadID,
                        tid: threadID,
                        mid: messageID,
                    };
                } catch (g) {
                    api.sendMessage("⚠️Error processing your request: " + g.message, threadID);
                }
            },
            messageID
        );
    },
};
