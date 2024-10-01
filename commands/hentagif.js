const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'hentagif',
  description: 'hentai gif.',
  nashPrefix: false,
  execute(api, event, args, prefix) {
    try {
      const apiUrl = `${global.NashBot.ENDPOINT}hentai-gif`;

      api.sendMessage('Mag antay ka nga manyakol', event.threadID);

      axios.get(apiUrl)
        .then(response => {
          if (response.data && response.data.gifUrl) {
            const gifUrl = response.data.gifUrl;
            const gifPath = path.join(__dirname, 'temp.gif');

            axios({
              url: gifUrl,
              method: 'GET',
              responseType: 'stream'
            })
            .then(gifResponse => {
              const writeStream = fs.createWriteStream(gifPath);
              gifResponse.data.pipe(writeStream);

              writeStream.on('finish', () => {
                api.sendMessage({
                  attachment: fs.createReadStream(gifPath)
                }, event.threadID, () => {
                  fs.unlinkSync(gifPath);
                });
              });
            })
            .catch(error => {
              console.error('Error downloading GIF:', error);
              api.sendMessage('⚠️ An error occurred while downloading the GIF.', event.threadID);
            });
          } else {
            throw new Error('Sa Api na naay sakit ani bay murag imong ex');
          }
        })
        .catch(error => {
          console.error('Error fetching hentai GIF:', error);
          api.sendMessage('⚠️ An error occurred while fetching the hentai GIF.', event.threadID);
        });
    } catch (error) {
      console.error('Error executing command:', error);
      api.sendMessage('⚠️ An error occurred while executing the command.', event.threadID);
    }
  },
};