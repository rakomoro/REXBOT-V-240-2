const axios = require('axios');

module.exports = {
    name: 'gender',
    description: 'Determine the gender associated with a name',
    cooldown: 3,
    nashPrefix: false,
    execute: async (api, event, args) => {
        const name = args.join(' ');
        const apiUrl = `${global.NashBot.ENDPOINT}gender?name=${encodeURIComponent(name)}`;

        if (!name) {
            return api.sendMessage('Please provide a name to determine the gender.', event.threadID, event.messageID);
        }

        await api.sendMessage('hindi maka antay ampota HAHAHA', event.threadID);

        try {
            const response = await axios.get(apiUrl);
            const { status, name: apiName, gender, probability, count } = response.data;

            if (status !== 'success') {
                throw new Error('Failed to retrieve data from the API.');
            }

            api.sendMessage({
                body: `𝗚𝗘𝗡𝗗𝗘𝗥 𝗣𝗥𝗘𝗗𝗜𝗖𝗧𝗜𝗢𝗡\n━━━━━━━━━━━━━━━━━━\n𝗡𝗮𝗺𝗲: ${apiName}\n𝗚𝗲𝗻𝗱𝗲𝗿: ${gender}\n𝗣𝗿𝗼𝗯𝗮𝗯𝗶𝗹𝗶𝘁𝘆: ${(probability * 100).toFixed(2)}%\n𝗖𝗼𝘂𝗻𝘁: ${count}\n\nHow to unsend a message?, react to it with a thumbs up (👍). If you are the sender, the bot will automatically unsend the message.`,
            }, event.threadID);
        } catch (error) {
            api.sendMessage(`An error occurred: ${error.message}`, event.threadID);
        }
    },
};
