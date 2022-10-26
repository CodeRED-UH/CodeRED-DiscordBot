import { SlashCommandBuilder } from "@discordjs/builders";
import DiscordService from "../utils/DiscordService";
import { Command } from "../interfaces/Command";

export const leaveteam: Command = {
  data: new SlashCommandBuilder()
    .setName("leaveteam")
    .setDescription("Leave your hackathon team!"),
  run: async (interaction) => {
    const { user } = interaction;
    const guild = interaction.guild;
    if (!guild) return;

    const member = await DiscordService.getMember(guild, user);
    if (!member) return;

    if (!(await DiscordService.getTeam(member)))
      return await interaction.reply(DiscordService.notInTeamMessage());

    const teamName = await DiscordService.leaveTeam(member);

    await interaction.reply(DiscordService.leaveTeamMessage(teamName));
  },
};
