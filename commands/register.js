const axios = require('axios');

module.exports = {
  name: 'register',
  description: 'User registration command',
  usage: '',
  nashPrefix: false,
  async execute(api, event) {
    const userID = event.senderID;
    const apiUrl = `${global.NashBot.MONEY}register`;

    try {
      const response = await axios.post(apiUrl, { userID });
      api.sendMessage(`✅ 𝗥𝗲𝗴𝗶𝘀𝘁𝗿𝗮𝘁𝗶𝗼𝗻 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹! 𝗕𝗮𝗹𝗮𝗻𝗰𝗲: ${response.data.balance}`, event.threadID);
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.error || '⚠️ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗲𝗱.'
        : '⚠️ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗲𝗱.';
      api.sendMessage(errorMessage, event.threadID);
    }
  },
};