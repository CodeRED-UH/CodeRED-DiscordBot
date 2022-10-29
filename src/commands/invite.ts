import { SlashCommandBuilder } from "@discordjs/builders";
import DiscordService from "../utils/DiscordService";
import { Command } from "../interfaces/Command";

export const invite: Command = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Invite someone to your hackathon team!")
    .addUserOption((option) =>
      option
        .setName("invitee")
        .setDescription("Your potential team member")
        .setRequired(true)
    ),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const { user } = interaction;

    const guild = interaction.guild;
    if (!guild) return;

    const invitedUser = interaction.options.getUser("invitee", true);
    await DiscordService.log(
      `${user.tag} used /invite to ${invitedUser.tag}`,
      guild
    );

    // Cancel if invitee is a bot
    if (invitedUser.bot) {
      await interaction.editReply(DiscordService.botInviteMessage());
      return;
    }

    const invitedMember = await DiscordService.getMember(guild, invitedUser);
    if (!invitedMember) return;

    if (!(await DiscordService.verified(invitedMember))) {
      await interaction.editReply({
        content: `Sorry, ${invitedUser} is not verified.`,
      });
      return;
    }

    const sendingMember = await DiscordService.getMember(guild, user);
    if (!sendingMember) return;

    const team = await DiscordService.getTeam(sendingMember);

    // Cancel if sending user is not in a team
    if (!team) {
      await interaction.editReply(DiscordService.noTeamToInviteToMessage());
      return;
    }

    // Cancel if team is at max capacity
    if (team.members.size >= 4) {
      await interaction.editReply(DiscordService.teamAtMaxMessage(team));
      return;
    }
    // Cancel if invitee has a team already
    const invitedMemberTeam = await DiscordService.getTeam(invitedMember);
    if (invitedMemberTeam !== undefined) {
      await interaction.editReply(
        DiscordService.otherAlreadyInTeamMessage(
          invitedMember,
          invitedMemberTeam
        )
      );
      return;
    }

    // Cancel if inviting to a non-team role
    if (!DiscordService.teamNameAllowed(team.name)) {
      await interaction.editReply(
        DiscordService.inviteFromDifferentTeamMessage(team)
      );
      return;
    }

    const invitedMemberDM = await invitedMember.createDM();
    const invite = await invitedMemberDM.send(
      DiscordService.inviteMessage(invitedUser, team, user)
    );
    await invite.react("✅");

    const inviteAcceptCollector = invite.createReactionCollector({
      time: 10 * 60000,
    });
    await interaction.editReply(
      DiscordService.inviteSentMessage(invitedUser, team)
    );

    inviteAcceptCollector.on("collect", async (reaction, acceptedUser) => {
      if (acceptedUser.id !== invitedUser.id) return;
      await DiscordService.addToTeam(invitedMember, team);
      await invitedMemberDM.send(await DiscordService.joinedTeamMessage(team));
      await DiscordService.log(
        ` - ${invitedUser.tag} has joined "${team.name}"! Source: /invite from ${user.tag}`,
        guild
      );
      inviteAcceptCollector.stop();
    });

    inviteAcceptCollector.on("end", async () => {
      if ((await DiscordService.getTeam(invitedMember)) === team) return;
      await invitedMemberDM.send(`Sorry, this invite has expired!`);
      await DiscordService.log(
        ` - Invite to ${invitedUser.tag} from ${user.tag} for "${team.name}" has expired!`,
        guild
      );
      await interaction.followUp(
        DiscordService.sentInviteExpiredMessage(invitedMember)
      );
    });
  },
};
