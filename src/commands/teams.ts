import { SlashCommandBuilder } from "@discordjs/builders";
import DiscordService from "../utils/DiscordService";
import { Command } from "../interfaces/Command";

export const teams: Command = {
  data: new SlashCommandBuilder()
    .setName("teams")
    .setDescription("View the teams currently set up for CodeRED Odyssey!"),
  execute: async (interaction) => {
    const { guild } = interaction;
    if (!guild) return;
    const teams = await DiscordService.getTeams(guild);
    if (!teams) {
      interaction.reply({
        content: `There are no teams currently set up!`,
        ephemeral: true,
      });
      return;
    }
    let teamMessage = `Teams:`;
    teams.forEach((team) => (teamMessage += `\n - ${team}`));
    teamMessage += `\nTotal: **${teams.size}**`;
    interaction.reply({
      content: teamMessage,
      ephemeral: true,
    });
  },
};
