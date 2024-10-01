const axios = require("axios");

const colors = {
  red: "🔴",
  green: "🟢",
  blue: "🔵",
  yellow: "🟡",
  purple: "🟣",
  orange: "🟠",
};
const winMultiplier = 2;

module.exports = {
  name: "colorgame",
  nashPrefix: false,
  execute: async (api, event, args) => {
    const userID = event.senderID;
    const betAmount = parseInt(args[0], 10);
    const chosenColor = args[1]?.toLowerCase();

    if (!betAmount || betAmount <= 0 || !colors[chosenColor]) {
      const usageMessage = "Invalid input. Usage: !colorGame <amount> <color name>\n\nAvailable colors:\n" +
        "🔴 red\n🟢 green\n🔵 blue\n🟡 yellow\n🟣 purple\n🟠 orange";
      return api.sendMessage(usageMessage, event.threadID);
    }

    try {
      const balanceResponse = await axios.get(`${global.NashBot.MONEY}check-user`, { params: { userID } });
      const userBalance = balanceResponse.data.balance;

      if (userBalance === undefined) {
        return api.sendMessage("User not found. Please register first.", event.threadID);
      }

      if (userBalance < betAmount) {
        return api.sendMessage(`You only have ₱${userBalance}. Please enter a valid amount to bet.`, event.threadID);
      }

      const winningColors = [];
      for (let i = 0; i < 4; i++) {
        winningColors.push(Object.keys(colors)[Math.floor(Math.random() * Object.keys(colors).length)]);
      }

      const countOfChosenColor = winningColors.filter(color => color === chosenColor).length;
      const totalWinAmount = countOfChosenColor > 0 ? betAmount * winMultiplier * countOfChosenColor : 0;

      const resultMessage = `🎨 COLOR GAME 🎨\n\nChosen Color: ${colors[chosenColor]}\nWinning Colors: ${winningColors.map(color => colors[color]).join(" ")}`;

      if (totalWinAmount > 0) {
        await axios.get(`${global.NashBot.MONEY}save-money`, { params: { userID, amount: totalWinAmount } });
        api.sendMessage(resultMessage + `\n\nCongratulations! You won ₱${totalWinAmount}!`, event.threadID);
      } else {
        await axios.get(`${global.NashBot.MONEY}deduct-money`, { params: { userID, amount: betAmount } });
        api.sendMessage(resultMessage + `\n\nOops! You lost ₱${betAmount}.`, event.threadID);
      }
    } catch (error) {
      api.sendMessage("An error occurred while processing your request. Please try again later.", event.threadID);
    }
  },
};