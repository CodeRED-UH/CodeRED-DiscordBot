import { Client, Intents } from "discord.js";
require("dotenv").config();

(async () => {
  const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

  client.once("ready", () => console.log("ready"));

  await client.login(process.env.TOKEN);
})();
