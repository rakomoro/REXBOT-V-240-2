const axios = require('axios');

module.exports = {
  name: 'country',
  description: 'Get detailed information about a country by its country code',
  usage: '<country_code>',
  nashPrefix: false,
  execute(api, event, args, prefix) {
    try {
      if (args.length === 0) {
        api.sendMessage(`
𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗨𝗦𝗔𝗚𝗘:

➥ *${prefix}country <country_code>* -> Get detailed information about a country by its code.

*Example:*
➥ ${prefix}country PH

Have fun using it, enjoy! ❤️
Bot Developer: joshua Apostol
        `, event.threadID);
        return;
      }

      const countryCode = args[0].toUpperCase();
      const apiUrl = `${global.NashBot.ENDPOINT}country?code=${encodeURIComponent(countryCode)}`;

      api.sendMessage('🌍 Fetching country information...', event.threadID);

      axios.get(apiUrl)
        .then(response => {
          const countryData = response.data;

          if (countryData && countryData.name) {
            const { name, capital, region, subregion, population, languages, currencies, flag, maps } = countryData;

            const countryInfo = `
𝗖𝗢𝗨𝗡𝗧𝗥𝗬 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡 𝗳𝗼𝗿 ${name.common}:

📌 Official Name: ${name.official}
🌍 Common Name: ${name.common}
🏛 Capital: ${capital.join(', ')}
🌎 Region: ${region}
🗺 Subregion: ${subregion}
👥 Population:${population.toLocaleString()}
🗣 Languages:${Object.values(languages).join(', ')}
💰 Currencies: ${Object.entries(currencies).map(([code, { name }]) => `${name} (${code})`).join(', ')}
🚩 Flag: ${flag}

🗺️ Maps:
- Google Maps: [View Map](${maps.googleMaps})\n\n
- OpenStreetMaps: [View Map](${maps.openStreetMaps})

Have fun using it, enjoy! ❤️\n\nHow to unsend a message?, react to it with a thumbs up (👍). If you are the sender, the bot will automatically unsend the message.
            `;

            api.sendMessage(countryInfo, event.threadID);
          } else {
            api.sendMessage(`🌍 No information found for the country code '${countryCode}'.`, event.threadID);
          }
        })
        .catch(error => {
          console.error('Error fetching country information:', error.message || error);
          api.sendMessage('An error occurred while fetching country information.', event.threadID);
        });
    } catch (error) {
      console.error('Error executing command:', error.message || error);
      api.sendMessage('An error occurred while executing the command.', event.threadID);
    }
  },
};
