import { SlashCommandBuilder } from "discord.js/node_modules/@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { Command } from "../interfaces/Command";

export const help: Command = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Provides information on using this bot."),
  run: async (interaction, client) => {
    await interaction.deferReply();

    const description = `${client.user?.tag} is CodeRED's official Discord bot!`;
    let iconURL: string | null | undefined;

    if (
      client.user?.avatarURL({ format: "png" }) === null ||
      client.user?.avatarURL({ format: "png" }) === undefined
    ) {
      iconURL = "https://avatars.githubusercontent.com/u/107168679?s=200&v=4";
    } else {
      iconURL = client.user?.avatarURL({ format: "png" });
    }

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
        iconURL: iconURL as string,
      });

    await interaction.editReply({ embeds: [helpEmbed] });
    return;
  },
};
