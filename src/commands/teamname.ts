import { SlashCommandBuilder } from "@discordjs/builders";
import DiscordService from "../utils/DiscordService";
import { Command } from "../interfaces/Command";

export const teamname: Command = {
  data: new SlashCommandBuilder()
    .setName("teamname")
    .setDescription("Change your team's name!")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name you want to change your team to.")
        .setRequired(true)
    ),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const { user } = interaction;
    const { guild } = interaction;
    if (!guild) return;
    await DiscordService.log(`${user.tag} used /teamname`, guild);
    const newTeamName = interaction.options.getString("name", true);
    const member = await DiscordService.getMember(guild, user);
    if (!member) return;

    // Cancel if not in a team
    const currentTeam = await DiscordService.getTeam(member);
    if (!currentTeam) {
      await interaction.editReply(DiscordService.notInTeamMessage());
      return;
    }

    // Cancel if team name isn't found
    if (!newTeamName) {
      await interaction.editReply("You must have a valid team name!");
      return;
    }

    // Cancel if team name is forbidden
    if (!DiscordService.teamNameAllowed(newTeamName)) {
      await interaction.editReply(
        DiscordService.badTeamNameMessage(newTeamName)
      );
      return;
    }

    // Cancel if team name is taken
    const teams = await DiscordService.getTeams(guild);
    if (teams) {
      // Cancel if team name is taken
      if (await DiscordService.teamNameTaken(newTeamName, teams)) {
        await interaction.editReply(
          DiscordService.takenTeamNameMessage(newTeamName)
        );
        return;
      }
    }

    const teamChannel = await DiscordService.getTeamChannel(currentTeam);
    if (!teamChannel) {
      await DiscordService.log(
        ` - Error: Team Channel for "${currentTeam.name}" could not be found.`,
        guild
      );
      await interaction.editReply(
        `Sorry, there was an error with your request.`
      );
      return;
    }
    const oldTeamName = currentTeam.name;
    // console.log("check");
    teamChannel.edit({ name: newTeamName });
    currentTeam.edit({ name: newTeamName });
    await interaction.editReply(
      `Success! Changed team name to **${newTeamName}**!`
    );
    await teamChannel.send(
      `Team name changed from **${oldTeamName}** to **${newTeamName}**!`
    );
    await DiscordService.log(
      ` - ${user.tag} changed "${oldTeamName}" to "${newTeamName}"`,
      guild
    );
    // console.log("point");
  },
};
