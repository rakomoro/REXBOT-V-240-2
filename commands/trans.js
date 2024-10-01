const request = require("request");

module.exports = {
    name: "trans",
    description: "Text translation",
    aliases: [],
    cooldown: 5,
    nashPrefix: false,
    execute: async (api, event, args) => {
        const { threadID, messageID } = event;
        const targetLanguage = args[0];
        const content = args.slice(1).join(" ");

        try {
            if (content.length === 0 && event.type !== "message_reply") {
                return api.sendMessage(
                    `🔤 | Please provide a text to translate or reply to a message.\n\nExample: ×trans tl what is life`,
                    threadID,
                    messageID
                );
            }

            let translateThis, lang;
            if (event.type === "message_reply") {
                translateThis = event.messageReply.body;
                lang = targetLanguage || "tl";
            } else {
                translateThis = content;
                lang = targetLanguage || "tl";
            }

            request(
                encodeURI(
                    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${translateThis}`
                ),
                (err, response, body) => {
                    if (err) {
                        return api.sendMessage("An error has occurred!", threadID, messageID);
                    }
                    const retrieve = JSON.parse(body);
                    let text = "";
                    retrieve[0].forEach((item) => (item[0] ? (text += item[0]) : ""));
                    const fromLang = retrieve[2] === retrieve[8][0][0] ? retrieve[2] : retrieve[8][0][0];
                    api.sendMessage(
                        `✅ | Translation: ${text}\n - Translated from ${fromLang} to ${lang}`,
                        threadID,
                        messageID
                    );
                }
            );
        } catch (error) {
            api.sendMessage(error.message, threadID, messageID);
        }
    }
};