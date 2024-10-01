const axios = require('axios');

module.exports = {
    name: 'blackbox',
    description: 'Interact with Blackbox Conversational AI',
    cooldown: 3,
    nashPrefix: false,
    execute: async (api, event, args) => {
        const chatMessage = args.join(' ');
        const apiUrl = `${global.NashBot.ENDPOINT}blackbox?chat=${encodeURIComponent(chatMessage)}`;

        if (!chatMessage) {
            return api.sendMessage('Please provide a message to send to the AI.', event.threadID, event.messageID);
        }

        const initialMessage = await api.sendMessage('Processing your request...', event.threadID);

        try {
            const response = await axios.get(apiUrl);
            const { response: aiResponse } = response.data;

            if (!aiResponse) {
                throw new Error('Failed to retrieve a response from the AI.');
            }

            api.sendMessage({
                body: `𝗕𝗹𝗮𝗰𝗸𝗯𝗼𝘅\n━━━━━━━━━━━━━━━━━━\n𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲:\n${aiResponse}\n━━━━━━━━━━━━━━━━━━\n𝗔𝘀𝗸 𝗠𝗲 𝗔𝗻𝘆𝘁𝗵𝗶𝗻𝗴!\n\nHow to unsend a message?, react to it with a thumbs up (👍). If you are the sender, the bot will automatically unsend the message.`,
            }, event.threadID);
        } catch (error) {
            api.sendMessage(`An error occurred: ${error.message}`, event.threadID);
        }
    },
};