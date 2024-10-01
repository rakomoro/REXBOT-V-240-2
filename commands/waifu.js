const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);

module.exports = {
  name: 'waifu',
  description: 'Search for waifu using the given query',
  usage: '<search_query>',
  nashPrefix: false,
  async execute(api, event, args, prefix) {
    try {
      if (args.length === 0) {
        api.sendMessage(`Usage: [ 🖼️ '${prefix}waifu <search_query>' 🖼️ ]\n\nExample: [ 🖼️ '${prefix}waifu Asuka' 🖼️ ]`, event.threadID);
        return;
      }

      const searchQuery = encodeURIComponent(args.join(' '));
      const apiUrl = `${global.NashBot.ENDPOINT}waifu?search=${searchQuery}`;

      api.sendMessage('🖼️ Searching for waifu...', event.threadID);

      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data && data.data && data.data.images && data.data.images.length > 0) {
        const waifu = data.data.images[0];
        const imageUrl = waifu.url;
        const imagePath = path.join(__dirname, 'temp_waifu_image.png');
        
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        await writeFileAsync(imagePath, imageResponse.data);
        
        api.sendMessage({ attachment: fs.createReadStream(imagePath) }, event.threadID, () => {
          
          fs.unlink(imagePath, (err) => {
            if (err) console.error('Error deleting temporary file:', err);
          });
        });
      } else {
        api.sendMessage('🖼️ No waifu found for your search query.', event.threadID);
      }
    } catch (error) {
      console.error('Error executing command:', error.message || error);
      api.sendMessage('An error occurred while executing the command.', event.threadID);
    }
  },
};