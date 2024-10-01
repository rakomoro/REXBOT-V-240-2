module.exports = {
    name: "help",
    description: "Beginner's Guide To All Bot Commands and Events",
    nashPrefix: false,
    version: "1.0.2",
    role: 0,
    cooldowns: 7,
    aliases: ["help"],
    execute(api, event, args, prefix) {
        const commands = global.NashBoT.commands;
        const events = global.NashBoT.events;
        const { threadID, messageID } = event;

        const itemsPerPage = 20;
        let pageNumber = args[0] ? parseInt(args[0], 10) : 1;
        pageNumber = isNaN(pageNumber) || pageNumber < 1 ? 1 : pageNumber;

        let commandList = "╔════ஜ۩۞۩ஜ═══╗\n\n";
        commandList += `𝑯𝒆𝒓𝒆'𝒔 𝒕𝒉𝒆 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒍𝒊𝒔𝒕 - 𝑷𝒂𝒈𝒆 ${pageNumber}:\n\n`;

        const aiCommands = [];
        const otherCommands = [];
        const eventEntries = Array.from(events.keys());
        commands.forEach((cmd, name) => {
            if (name.toLowerCase().includes("ai")) {
                aiCommands.push(name);
            } else {
                otherCommands.push(name);
            }
        });

        const allEntries = [...aiCommands, ...otherCommands, ...eventEntries];
        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedEntries = allEntries.slice(startIndex, endIndex);

        let hasListedAISection = false;
        let hasListedOtherCommands = false;

        paginatedEntries.forEach(name => {
            if (aiCommands.includes(name)) {
                if (!hasListedAISection) {
                    commandList += "AI Commands:\n";
                    hasListedAISection = true;
                }
                commandList += `❍ ${name}\n`;
            } else if (otherCommands.includes(name)) {
                if (!hasListedOtherCommands && hasListedAISection) {
                    commandList += "\nOther Commands:\n";
                    hasListedOtherCommands = true;
                }
                commandList += `❍ ${name}\n`;
            } else if (eventEntries.includes(name)) {
                if (!hasListedOtherCommands && hasListedAISection) {
                    commandList += "\nEvent List:\n";
                    hasListedOtherCommands = true;
                }
                commandList += `❍ ${name}\n`;
            }
        });

        if (paginatedEntries.length < itemsPerPage && pageNumber > 1) {
            commandList += "\nNo more commands/events.";
        }

        commandList += `\n\n𝑱𝒖𝒔𝒕 𝒎𝒆𝒔𝒔𝒂𝑔𝒆 𝒽𝒆𝓁𝓅 1, 2, 𝑜𝓇 3 𝓉𝑜 𝓈𝑒𝑒 𝓂𝑜𝓇𝑒 𝒸𝑜𝓂𝒶𝓃𝒹𝓈\n`;
        commandList += `╚════ஜ۩۞۩ஜ═══╝`;
        api.sendMessage(commandList, threadID, messageID);
    }
};
