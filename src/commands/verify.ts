import { SlashCommandBuilder } from "@discordjs/builders";
import GoogleService from "../utils/GoogleService";
import { Command } from "../interfaces/Command";
import DiscordService from "../utils/DiscordService";

export const verify: Command = {
  data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Verify your registration for CodeRED!")
    .addStringOption((option) =>
      option
        .setName("email")
        .setDescription("The email you entered when signing up")
        .setRequired(true)
    ),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const { user } = interaction;
    const guild = interaction.guild;
    if (!guild) return;
    await DiscordService.log(`${user.tag} used /verify`, guild);

    const email = interaction.options.getString("email", true);

    const member = await DiscordService.getMember(guild, user);
    if (!member) return;

    if (await DiscordService.verified(member)) {
      await DiscordService.log(` - ${user.tag} has been verified!`, guild);
      await interaction.editReply(DiscordService.verifiedMessage());
      return;
    }

    const emailRange = "B1:B";
    const rowIndexArray = await GoogleService.binarySearch(email, emailRange);
    if (rowIndexArray.length == 0) {
      await DiscordService.log(
        ` - ${user.tag} has NOT been verified! Reason: email doesn't exist. Email: ${email}`,
        guild
      );
      await interaction.editReply(DiscordService.notVerifiedMessage(email));
      return;
    }

    let rowIndex = -1;
    for (let i = 0; i < rowIndexArray.length; i++) {
      const ri = rowIndexArray[i];
      const discordCell = (
        await GoogleService.getData("A" + ri.toString())
      ).data.values
        .at(0)
        .at(0) as string;
      if (discordCell === user.tag) {
        rowIndex = ri;
        break;
      }
    }

    if (rowIndex === -1) {
      await DiscordService.log(
        ` - ${user.tag} has NOT been verified! Reason: email doesn't match Discord tag. Email: ${email}`,
        guild
      );
      await interaction.editReply(DiscordService.notVerifiedMessage(email));
      return;
    }

    await interaction.editReply(DiscordService.verifiedMessage());

    const guildRoles = await DiscordService.getGuildRoles(guild);
    if (!guildRoles) return;

    const verifiedRole = guildRoles.find(
      (r) => r.name.toLowerCase() === "verified ✅"
    );
    if (!verifiedRole) return;
    await member.roles.add(verifiedRole);

    const teamless = DiscordService.getTeamless(guild);
    if (!teamless) return;
    await member.roles.add(teamless);

    await DiscordService.log(` - ${user.tag} has been verified!`, guild);
  },
};
