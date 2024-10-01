const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const login = require("./fca-unofficial");
const loggingin = require("./fca-unofficial/src/fca")
const fs = require("fs");
const detectTyping = require("./handle/detectTyping");
const autoReact = require("./handle/autoReact");
const unsendReact = require("./handle/unsendReact");

const app = express();
const configPath = path.join(__dirname, "config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static("public"));
loggingin();

global.NashBoT = {
  commands: new Map(),
  events: new Map(),
  onlineUsers: new Map(),
};

global.NashBot = {
  ENDPOINT: "https://nash-rest-api-production.up.railway.app/",
  END: "https://deku-rest-api.gleeze.com/",
  KEN: "https://api.kenliejugarap.com/",
  MONEY: "https://database2.vercel.app/",
};

const loadModules = (type) => {
  const folderPath = path.join(__dirname, type);
  const files = fs.readdirSync(folderPath).filter(file => file.endsWith(".js"));
  files.forEach(file => {
    const module = require(path.join(folderPath, file));
    if (module && module.name && module[type === "commands" ? "execute" : "onEvent"]) {
      module.nashPrefix = module.nashPrefix !== undefined ? module.nashPrefix : true;
      global.NashBoT[type].set(module.name, module);
    }
  });
};

const init = async () => {
  await loadModules("commands");
  await loadModules("events");
  await autoLogin();
};

const autoLogin = async () => {
  const appStatePath = path.join(__dirname, "appstate.json");
  if (fs.existsSync(appStatePath)) {
    const appState = JSON.parse(fs.readFileSync(appStatePath, "utf8"));
    login({ appState }, config.FCA_OPTIONS, (err, api) => {
      if (err) {
        console.error("Failed to auto-login:", err);
        return;
      }
      const cuid = api.getCurrentUserID();
      global.NashBoT.onlineUsers.set(cuid, { userID: cuid, prefix: config.prefix });
      setupBot(api, config.prefix);
    });
  }
};

const setupBot = (api, prefix) => {
  api.setOptions({
    forceLogin: false,
    selfListen: true,
    autoReconnect: true,
    listenEvents: true,
  });

  setInterval(() => {
    api.getFriendsList(() => console.log("Keep-alive signal sent"));
  }, 1000 * 60 * 15);

  api.listenMqtt((err, event) => {
    if (err) return;
    handleMessage(api, event, prefix);
    handleEvent(api, event, prefix);
    detectTyping(api, event);
    autoReact(api, event);
    unsendReact(api, event);
  });
};

const handleEvent = async (api, event, prefix) => {
  const { events } = global.NashBoT;
  try {
    for (const { name, onEvent } of events.values()) {
      await onEvent({ prefix, api, event });
    }
  } catch (err) {
    console.error("Event handler error:", err);
  }
};

const handleMessage = async (api, event, prefix) => {
  if (!event.body) return;
  let [command, ...args] = event.body.trim().split(" ");
  if (command.startsWith(prefix)) command = command.slice(prefix.length);

  const cmdFile = global.NashBoT.commands.get(command.toLowerCase());
  if (cmdFile) {
    const nashPrefix = cmdFile.nashPrefix !== false;
    if (nashPrefix && !event.body.toLowerCase().startsWith(prefix)) return;

    const userId = event.senderID;
    if (cmdFile.role === "admin" && userId !== config.adminUID) {
      return api.sendMessage("You lack admin privileges.", event.threadID);
    }

    try {
      await cmdFile.execute(api, event, args, prefix);
    } catch (err) {
      api.sendMessage(`Command error: ${err.message}`, event.threadID);
    }
  }
};

init().then(() => app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`)));
