const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'meme',
  description: 'meme image random',
  usage: '[nashPrefix]meme',
  nashPrefix: false,
  execute: async (api, event, args, prefix) => {
    const tmpFolderPath = path.join(__dirname, 'tmp');

    if (!fs.existsSync(tmpFolderPath)) {
      fs.mkdirSync(tmpFolderPath);
    }

    try {
      const response = await axios.get(`${global.NashBot.ENDPOINT}random-meme`);
      const memeUrl = response.data.url;
      const memeName = response.data.name;

      const imageResponse = await axios.get(memeUrl, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(imageResponse.data, 'binary');
      const imagePath = path.join(tmpFolderPath, 'meme_image.jpg');

      fs.writeFileSync(imagePath, imageBuffer);

      await api.sendMessage({
        body: `Here is a random meme for you!\nName: ${memeName}`,
        attachment: fs.createReadStream(imagePath)
      }, event.threadID);
      
      fs.unlinkSync(imagePath);

    } catch (error) {
      console.error('Error fetching or sending the meme image:', error);
      api.sendMessage('An error occurred while fetching the meme image.', event.threadID);
    }
  }
};