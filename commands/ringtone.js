const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'ringtone',
  description: 'Search and send ringtones',
  usage: '[nashPrefix]ringtone [query]',
  nashPrefix: false,
  execute: async (api, event, args) => {
    const query = args.join(" ");

    if (!query) {
      return api.sendMessage('Usage: ringtone [query].', event.threadID);
    }

    api.sendMessage('Searching for your ringtone, please wait...', event.threadID);

    const url = `https://ggwp-yyxy.onrender.com/api/ringtone?q=${encodeURIComponent(query)}`;

    try {
      const response = await axios.get(url);
      const result = response.data;

      if (result.status !== 200) {
        return api.sendMessage('Error fetching ringtones.', event.threadID);
      }

      const ringtones = result.result;

      if (ringtones.length === 0) {
        return api.sendMessage('No ringtones found for the given query.', event.threadID);
      }

      const ringtone = ringtones[0];
      const audioUrl = ringtone.audio;
      const audioResponse = await axios.get(audioUrl, { responseType: 'arraybuffer' });
      const audioBuffer = Buffer.from(audioResponse.data, 'binary');
      const audioPath = path.join(__dirname, `${ringtone.title}.mp3`);

      fs.writeFileSync(audioPath, audioBuffer);

      await api.sendMessage({
        body: `Title: ${ringtone.title}\nSource: ${ringtone.source}`,
        attachment: fs.createReadStream(audioPath)
      }, event.threadID);

      fs.unlinkSync(audioPath);

    } catch (error) {
      console.error('Error:', error);
      return api.sendMessage('Error: ' + error.message, event.threadID);
    }
  }
};