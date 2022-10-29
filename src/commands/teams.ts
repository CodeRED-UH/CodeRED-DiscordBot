import { SlashCommandBuilder } from "@discordjs/builders";
import DiscordService from "../utils/DiscordService";
import { Command } from "../interfaces/Command";

export const teams: Command = {
  data: new SlashCommandBuilder()
    .setName("teams")
    .setDescription("View the teams currently set up for CodeRED Odyssey!"),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const { user } = interaction;
    const { guild } = interaction;
    if (!guild) return;
    await DiscordService.log(`${user.tag} used /teams`, guild);
    const teams = await DiscordService.getTeams(guild);
    if (!teams) {
      interaction.editReply({
        content: `There are no teams currently set up!`,
      });
      return;
    }
    let teamMessage = `Teams:`;
    teams.forEach((team) => (teamMessage += `\n - ${team}`));
    teamMessage += `\nTotal: **${teams.size}**`;
    interaction.editReply({
      content: teamMessage,
    });
  },
};
