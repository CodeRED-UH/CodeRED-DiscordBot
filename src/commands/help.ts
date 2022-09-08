import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../interfaces/Command";
import { general } from "../utils/embededCreator";

export const help: Command = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Provides information on using this bot."),
  run: async (interaction, client) => {
    await interaction.deferReply();

    const title = "**Help** ⛑ ";
    const description = `Hi! I'm <@${client.user?.id}>! Here are some of my commands!`;
    const fields = [
      {
        name: "Ping 🏓",
        value: "To view the current Websocket & Discord API ping use `/ping`.",
      },
      {
        name: "Purge 🗑️",
        value:
          "To clear messages use `/purge`\nCommand is only available to officers.",
      },
    ];

    const returnMessage = general(client, title, description, fields);

    await interaction.editReply({ embeds: [returnMessage] });
    return;
  },
};
