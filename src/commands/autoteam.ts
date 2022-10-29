import { SlashCommandBuilder } from "@discordjs/builders";
import DiscordService from "../utils/DiscordService";
import { Command } from "../interfaces/Command";
import { GuildMember } from "discord.js";

export const autoteam: Command = {
  data: new SlashCommandBuilder()
    .setName("autoteam")
    .setDescription("Send the auto team role message!")
    .addStringOption((option) =>
      option
        .setName("team-name")
        .setDescription("Your team's name")
        .setRequired(true)
    ),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const { user } = interaction;
    const guild = interaction.guild;
    if (!guild) return;
    const teamName = interaction.options.getString("team-name", true);
    await DiscordService.log(`${user.tag} used /autoteam`, guild);

    // Cancel if team name is bad
    if (!DiscordService.teamNameAllowed(teamName)) {
      await interaction.editReply(DiscordService.badTeamNameMessage(teamName));
      return;
    }

    const currentRoles = await DiscordService.getGuildRoles(guild);
    if (!currentRoles) return;

    // Cancel if team name is taken
    if (await DiscordService.teamNameTaken(teamName, currentRoles)) {
      await interaction.editReply(
        DiscordService.takenTeamNameMessage(teamName)
      );
      return;
    }

    const role = guild.roles.cache.find(
      (role) => role.name.toLowerCase() === "autoteam"
    );
    if (!role) return;

    if (role.members.size < 4) {
      await interaction.editReply(`Not enough people signed up for AutoTeam!`);
      return;
    }

    const members: GuildMember[] = [];

    while (members.length < 4) {
      const member = role.members.at(Math.random() * role.members.size);
      if (!member) {
        await interaction.editReply(
          `Not enough people signed up for AutoTeam!`
        );
        return;
      }
      if (!(await DiscordService.getTeam(member))) {
        members.push(member);
      }

      await member.roles.remove(role);
    }

    const newTeam = await guild.roles.create({
      name: teamName,
      color: DiscordService.getColor(null),
    });

    members.forEach(async (member) => {
      await member.roles.remove(role);
    });
    await DiscordService.addManyToTeam(members, newTeam);

    await interaction.editReply(
      `AutoTeam Success! Check ${await DiscordService.getTeamChannel(newTeam)}`
    );
  },
};
