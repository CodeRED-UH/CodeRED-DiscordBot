import { SlashCommandBuilder } from "@discordjs/builders";
import DiscordService from "../utils/DiscordService";
import { Command } from "../interfaces/Command";
import { Role } from "discord.js";

export const team: Command = {
  data: new SlashCommandBuilder()
    .setName("team")
    .setDescription("View the people of a team for CodeRED Odyssey!")
    .addRoleOption((option) =>
      option
        .setName("team")
        .setDescription("The team that you want to view.")
        .setRequired(false)
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user who's team you want to view.")
        .setRequired(false)
    ),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const { user } = interaction;
    const { guild } = interaction;
    if (!guild) return;
    await DiscordService.log(`${user.tag} used /team`, guild);

    const member = await DiscordService.getMember(guild, user);
    if (!member) return;

    const viewUser = interaction.options.getUser("user", false);

    const team =
      interaction.options.getRole("team", false) ||
      (await DiscordService.getTeam(member));
    if (!team) {
      if (!viewUser) {
        await interaction.editReply(DiscordService.notInTeamMessage());
        return;
      }
      const viewMember = await DiscordService.getMember(guild, viewUser);
      if (!viewMember) return;
      const userTeam = await DiscordService.getTeam(viewMember);
      if (!userTeam) {
        await interaction.editReply(
          DiscordService.otherNotInTeamMessage(viewMember)
        );
        return;
      }
      let teamInfo = `Team Name: ${userTeam}\n\nMembers:`;
      const members = (userTeam as Role).members;
      members.forEach((member) => (teamInfo += `\n - ${member}`));
      await interaction.editReply({
        content: teamInfo,
      });
      return;
    }

    if (!(await DiscordService.teamNameAllowed(team.name))) {
      await interaction.editReply(DiscordService.badTeamNameMessage(team.name));
      return;
    }

    if (viewUser) {
      const viewMember = await DiscordService.getMember(guild, viewUser);
      if (!viewMember) return;
      const userTeam = await DiscordService.getTeam(viewMember);
      if (!userTeam) {
        await interaction.editReply(
          DiscordService.userNotInThisTeamMessage(viewUser, team as Role)
        );
        return;
      }
      if (team !== userTeam) {
        await interaction.editReply(
          DiscordService.userNotInThisTeamMessage(viewUser, team as Role)
        );
        return;
      }
    }

    let teamInfo = `Team Name: ${team}\n\nMembers:`;
    const members = (team as Role).members;
    members.forEach((member) => (teamInfo += `\n - ${member}`));
    await interaction.editReply({
      content: teamInfo,
    });
  },
};
