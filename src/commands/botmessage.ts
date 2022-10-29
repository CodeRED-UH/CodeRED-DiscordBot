import { TextChannel } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../interfaces/Command";
import DiscordService from "../utils/DiscordService";

export const botmessage: Command = {
  data: new SlashCommandBuilder()
    .setName("botmessage")
    .setDescription("Send a server message from the bot!")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Message that the bot should send.")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Channel to send the message in.")
        .setRequired(true)
    ),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const { user } = interaction;

    const { guild } = interaction;
    if (!guild) return;
    await DiscordService.log(`${user.tag} used /botmessage`, guild);
    const messageBody = interaction.options.getString("message", true);
    const channel = interaction.options.getChannel(
      "channel",
      true
    ) as TextChannel;
    await channel.send(messageBody);
    await interaction.editReply({
      content: `Message sent!`,
    });
  },
};
