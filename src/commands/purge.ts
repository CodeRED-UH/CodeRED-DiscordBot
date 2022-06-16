import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../interfaces/Command";
import { createEmbeded } from "../utils/embeded";

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
      await interaction.editReply("You can only delete messages in guilds.");
      return;
    }

    const guildMember = await interaction.guild.members.cache.find(
      (u) => u.id === user.id
    );

    if (!guildMember) {
      await interaction.editReply(
        "Failed to retrieve your information in this guild."
      );
      return;
    }

    let isOfficer = false;

    await guildMember.roles.cache.forEach((roleID) => {
      if (roleID.name === "Officer") {
        isOfficer = true;
      }
    });

    if (!isOfficer) {
      await interaction.editReply("You are not an officer.");
      return;
    }

    if (!isInRange(n, 1, 100)) {
      await interaction.editReply("Must be in range 1-100.");
      return;
    }

    let description = `You have purged up to ${n} messages from this channel.`;
    await channel?.bulkDelete(n, true).catch((err: Error) => {
      description = `An error has occurred.\n${err}`;
    });

    const returnMessage = createEmbeded("Purge", description, user, client);

    await interaction.editReply({ embeds: [returnMessage] });
    return;
  },
};
