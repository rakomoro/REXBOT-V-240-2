const axios = require('axios');
const fs = require('fs');
const request = require('request');

module.exports = {
    name: "mlhero",
    description: "Fetch Mobile Legends Hero information",
    nashPrefix: false,
    version: "1.0.0",
    cooldowns: 7,
    aliases: ["mlhero"],
    execute(api, event, args, prefix) {
        const { threadID, messageID } = event;
        const heroName = args.join(" ");
        if (!heroName) {
            return api.sendMessage("Please provide a hero name.", threadID, messageID);
        }

        const url = `https://deku-rest-api.gleeze.com/api/mlhero?q=${encodeURIComponent(heroName)}`;
        
        axios.get(url)
            .then(response => {
                const heroData = response.data.result;

                if (!heroData) {
                    return api.sendMessage("Hero not found.", threadID, messageID);
                }

                const heroImage = heroData.hero_img;
                const heroDescription = heroData.description || "No description available.";
                const role = heroData.role;
                const specialty = heroData.specialty;
                const lane = heroData.lane;
                const releaseDate = heroData.release_date;
                const price = heroData.price;
                const gameplayInfo = heroData.gameplay_info;
                const storyInfo = heroData.story_info_list;
                
                const imageFileName = `hero_${Date.now()}.png`;
                request(heroImage)
                    .pipe(fs.createWriteStream(imageFileName))
                    .on('close', () => {
                        const messageBody = 
                            `Hero Information\n\n` +
                            `Name: ${heroName}\n` +
                            `Description: ${heroDescription}\n` +
                            `Role: ${role}\n` +
                            `Specialty: ${specialty}\n` +
                            `Lane: ${lane}\n` +
                            `Release Date: ${releaseDate}\n` +
                            `Price: ${price}\n\n` +
                            `Gameplay Info\n` +
                            `Durability: ${gameplayInfo.durability}\n` +
                            `Offense: ${gameplayInfo.offense}\n` +
                            `Control Effect: ${gameplayInfo.control_effect}\n` +
                            `Difficulty: ${gameplayInfo.difficulty}\n\n` +
                            `Story Info\n` +
                            `Full Name: ${storyInfo['Full name']}\n` +
                            `Alias: ${storyInfo['Alias']}\n` +
                            `Origin: ${storyInfo['Origin']}\n` +
                            `Weapons: ${storyInfo['Weapons']}\n`;

                        api.sendMessage(
                            { body: messageBody, attachment: fs.createReadStream(imageFileName) },
                            threadID,
                            () => {
                                fs.unlinkSync(imageFileName);
                            }
                        );
                    });
            })
            .catch(error => {
                console.error(error);
                api.sendMessage("There was an error fetching the hero information.", threadID, messageID);
            });
    }
};
