import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder } from "discord.js";
import { Command } from "../interfaces/Command";
import { createSuccess, createError } from "../utils/embededCreator";

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
  execute: async (interaction, client) => {
    await interaction.deferReply({ ephemeral: true });
    const { user, channel } = interaction;
    const n = interaction.options.getNumber("n", true);

    if (channel?.isDMBased()) {
      await interaction.editReply({
        embeds: [
          createError(
            client,
            undefined,
            "You can only delete messages in guilds.",
            []
          ),
        ],
      });
      return;
    }

    const guildMember = interaction.guild?.members.cache.find(
      (u) => u.id === user.id
    );

    if (!guildMember) {
      await interaction.editReply({
        embeds: [
          createError(
            client,
            undefined,
            "Failed to retrieve your information in this guild.",
            []
          ),
        ],
      });
      return;
    }

    let isOfficer = false;

    guildMember.roles.cache.forEach((roleID) => {
      if (roleID.name === "Officer") {
        isOfficer = true;
      }
    });

    if (!isOfficer) {
      await interaction.editReply({
        embeds: [
          createError(
            client,
            "Permission Error",
            "You are not an officer.",
            []
          ),
        ],
      });
      return;
    }

    if (!isInRange(n, 1, 100)) {
      await interaction.editReply({
        embeds: [
          createError(client, "Out of range", "Must be in range 1-100.", []),
        ],
      });
      return;
    }

    let returnMessage: EmbedBuilder;
    let description = `You have purged ${n} messages from this channel.`;

    returnMessage = createSuccess(client, undefined, description, []);

    /*
    The bultDelete() error below is ignored as channel type is checked above at line 30 to prevent
    bultDelete() from being executed in a DM channel.  
    */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await channel?.bulkDelete(n, true).catch((err: Error) => {
      description = `An error has occurred.\n${err}`;
      returnMessage = createError(client, undefined, description, []);
    });

    await interaction.editReply({ embeds: [returnMessage] });
    return;
  },
};
