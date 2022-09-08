import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { Command } from "../interfaces/Command";
import { success, error } from "../utils/embeded";

const isInRange = (
  n: number,
  lowerBound: number,
  upperBound: number
): boolean => {
  return n >= lowerBound && n <= upperBound;
};

export const purge: Command = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Clear n amount of messages.")
    .setDMPermission(false)
    .addNumberOption((option) =>
      option
        .setName("n")
        .setDescription("Enter a number from 1-100.")
        .setRequired(true)
    ),
  run: async (interaction, client) => {
    await interaction.deferReply({ ephemeral: true });
    const { user, channel } = interaction;
    const n = interaction.options.getNumber("n", true);

    if (channel?.type === "DM" || !interaction.guild) {
      await interaction.editReply({
        embeds: [
          error(null, "You can only delete messages in guilds.", client),
        ],
      });
      return;
    }

    const guildMember = await interaction.guild.members.cache.find(
      (u) => u.id === user.id
    );

    if (!guildMember) {
      await interaction.editReply({
        embeds: [
          error(
            null,
            "Failed to retrieve your information in this guild.",
            client
          ),
        ],
      });
      return;
    }

    let isOfficer = false;

    await guildMember.roles.cache.forEach((roleID) => {
      if (roleID.name === "Officer") {
        isOfficer = true;
      }
    });

    if (!isOfficer) {
      await interaction.editReply({
        embeds: [error("Permission Error", "You are not an officer.", client)],
      });
      return;
    }

    if (!isInRange(n, 1, 100)) {
      await interaction.editReply({
        embeds: [error("Out of range", "Must be in range 1-100.", client)],
      });
      return;
    }

    let returnMessage: MessageEmbed;
    let description = `You have purged up to ${n} messages from this channel.`;

    returnMessage = success(null, description, client);

    await channel?.bulkDelete(n, true).catch((err: Error) => {
      description = `An error has occurred.\n${err}`;
      returnMessage = error(null, description, client);
    });

    await interaction.editReply({ embeds: [returnMessage] });
    return;
  },
};
