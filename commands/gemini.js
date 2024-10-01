const axios = require('axios');

module.exports = {
  name: 'gemini',
  description: 'Gemini AI text',
  usage: '[prompt]',
  nashPrefix: false,
  execute(api, event, args, prefix) {
    try {
      if (!args.length) {
        api.sendMessage(`🔮 𝗨𝘀𝗮𝗴𝗲: '${prefix}gemini [prompt]' 🔮\n\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲: '${prefix}gemini What will my day be like?'`, event.threadID);
        return;
      }

      const prompt = encodeURIComponent(args.join(' '));
      const apiUrl = `${global.NashBot.ENDPOINT}gemini?prompt=${prompt}`;

      api.sendMessage('🔮 𝗣𝗹𝗲𝗮𝘀𝗲 𝗪𝗮𝗶𝘁, 𝗚𝗲𝗺𝗶𝗻𝗶 𝗶𝘀 𝗥𝗲𝘀𝗽𝗼𝗻𝗱𝗶𝗻𝗴...', event.threadID);

      axios.get(apiUrl)
        .then(response => {
          const geminiData = response.data;
          const geminiResponse = typeof geminiData === 'string' ? geminiData : geminiData.response;

          api.sendMessage(`
🔮 𝗚𝗲𝗺𝗶𝗻𝗶'𝘀 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲 🔮

━━━━━━━━━━━━━━━━━━━
${geminiResponse}
━━━━━━━━━━━━━━━━━━━\n\nHow to unsend a message?, react to it with a thumbs up (👍). If you are the sender, the bot will automatically unsend the message.
          `, event.threadID);
        })
        .catch(error => {
          console.error('Error fetching Gemini data:', error);
          api.sendMessage('⚠️ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱 𝘄𝗵𝗶𝗹𝗲 𝗳𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗚𝗲𝗺𝗶𝗻𝗶 𝗱𝗮𝘁𝗮.', event.threadID);
        });
    } catch (error) {
      console.error('Error executing command:', error);
      api.sendMessage('⚠️ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱 𝘄𝗵𝗶𝗹𝗲 𝗲𝘅𝗲𝗰𝘂𝘁𝗶𝗻𝗴 𝘁𝗵𝗲 𝗰𝗼𝗺𝗺𝗮𝗻𝗱.', event.threadID);
    }
  },
};