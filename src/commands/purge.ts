import { SlashCommandBuilder } from "@discordjs/builders";
import { Role, TextChannel } from "discord.js";
import { Command } from "../interfaces/Command";

export const purge: Command = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Purge this channel"),
  run: async (interaction) => {
    const { user } = interaction;

    const guild = interaction.guild;
    await guild?.members.fetch();

    const member = guild?.members.cache.find((m) => m.id === user.id);
    if (!member) return;

    if (member.roles.highest.editable) {
      await interaction.reply({ content: "Invalid permissions" });
      return;
    }

    await (interaction.channel as TextChannel).bulkDelete(100);
    await interaction.reply({ content: "Chat purged!" });
    setTimeout(async () => await interaction.deleteReply(), 3000);
  },
};
