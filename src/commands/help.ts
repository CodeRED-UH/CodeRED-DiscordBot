import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { Command } from "../interfaces/Command";

export const help: Command = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Provides information on using this bot."),
  run: async (interaction, client) => {
    await interaction.deferReply();

    const description = `${client.user?.tag} is CodeRED's official Discord bot!`;

    const helpEmbed = new MessageEmbed()
      .setColor("#ffeded")
      .setTitle("**Help** ⛑")
      .setDescription(description)
      .addField(
        "Ping 🏓",
        "To view the current Websocket & Discord API ping use `/ping`."
      )
      .addField(
        "Stats 📊",
        "To view the current statistics of the bot use `/stats`.\nOnly available to the bot's owner."
      )
      .setTimestamp()
      .setFooter({
        text: `${client.user?.tag}`,
        iconURL: `${client.user?.avatarURL({ format: "png" })}`,
      });
    await interaction.editReply({ embeds: [helpEmbed] });
    return;
  },
};
