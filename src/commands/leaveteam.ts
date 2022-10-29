import { SlashCommandBuilder } from "@discordjs/builders";
import DiscordService from "../utils/DiscordService";
import { Command } from "../interfaces/Command";

export const leaveteam: Command = {
  data: new SlashCommandBuilder()
    .setName("leaveteam")
    .setDescription("Leave your hackathon team!"),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const { user } = interaction;

    const guild = interaction.guild;
    if (!guild) return;
    await DiscordService.log(`${user.tag} used /leaveteam`, guild);

    const member = await DiscordService.getMember(guild, user);
    if (!member) return;

    if (!(await DiscordService.getTeam(member))) {
      await interaction.editReply(DiscordService.notInTeamMessage());
      return;
    }

    const teamName = await DiscordService.leaveTeam(member);

    await interaction.editReply(DiscordService.leaveTeamMessage(teamName));
  },
};
