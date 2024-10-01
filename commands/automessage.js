const axios = require('axios');

module.exports = {
    name: "automessage",
    description: "Automatically sends a motivational quote every hour.",
    nashPrefix: false,
    version: "1.0.0",
    role: "admin",
    cooldowns: 5,
    async execute(api, event) {
        const { threadID } = event;

        let isActive = false;

        const motivation = async () => {
            try {
                const response = await axios.get("https://nash-rest-api-production.up.railway.app/quote");
                let quote = response.data.text;
                const author = response.data.author;

                quote = quote.replace(/^“|”$/g, '').trim();

                const formattedQuote = `┌─[ AUTOMESSAGE ]──[ # ]\n` +
                                       `└───► ${quote}\n\n` +
                                       `┌─[ AUTHOR ]───[ # ]\n` +
                                       `└───► ${author}`;

                const threads = await api.getThreadList(25, null, ['INBOX']);
                for (const thread of threads) {
                    if (thread.isGroup && thread.name !== thread.threadID) {
                        await api.sendMessage(formattedQuote, thread.threadID);
                    }
                }
            } catch (error) {
            }
        };

        const startAutoMessage = () => {
            isActive = true;
            setInterval(() => {
                if (isActive) {
                    motivation();
                }
            }, 3600000);
            api.sendMessage("┌─[ AUTOMESSAGE ]──[ # ]\n└──► Auto-message is now active!", threadID);
        };

        const stopAutoMessage = () => {
            isActive = false;
            api.sendMessage("┌─[ AUTOMESSAGE ]──[ # ]\n└──► Auto-message has been stopped!", threadID);
        };

        if (event.body.toLowerCase() === 'automessage on') {
            startAutoMessage();
        } else if (event.body.toLowerCase() === 'automessage off') {
            stopAutoMessage();
        }
    },
};