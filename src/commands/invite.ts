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
    const { user } = interaction;

    const guild = interaction.guild;
    if (!guild) return;

    const invitedUser = interaction.options.getUser("invitee", true);

    // Cancel if invitee is a bot
    if (invitedUser.bot) {
      await interaction.reply(DiscordService.botInviteMessage());
      return;
    }

    const invitedMember = await DiscordService.getMember(guild, invitedUser);
    if (!invitedMember) return;
    const sendingMember = await DiscordService.getMember(guild, user);
    if (!sendingMember) return;

    const team = await DiscordService.getTeam(sendingMember);

    // Cancel if sending user is not in a team
    if (!team) {
      await interaction.reply(DiscordService.noTeamToInviteToMessage());
      return;
    }

    // Cancel if team is at max capacity
    if (team.members.size >= 4) {
      await interaction.reply(DiscordService.teamAtMaxMessage(team));
      return;
    }
    // Cancel if invitee has a team already
    const invitedMemberTeam = await DiscordService.getTeam(invitedMember);
    if (invitedMemberTeam !== undefined) {
      await interaction.reply(
        DiscordService.otherAlreadyInTeamMessage(
          invitedMember,
          invitedMemberTeam
        )
      );
      return;
    }

    // Cancel if inviting to a non-team role
    if (!(await DiscordService.teamNameAllowed(team.name))) {
      await interaction.reply(
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
      time: 60000,
    });
    await interaction.reply(
      DiscordService.inviteSentMessage(invitedUser, team)
    );

    inviteAcceptCollector.on("collect", async (reaction, acceptedUser) => {
      if (acceptedUser.id !== invitedUser.id) return;
      await DiscordService.addToTeam(invitedMember, team);
      await invitedMemberDM.send(await DiscordService.joinedTeamMessage(team));
      inviteAcceptCollector.stop();
    });

    inviteAcceptCollector.on("end", async () => {
      if ((await DiscordService.getTeam(invitedMember)) === team) return;
      await invitedMemberDM.send(`Sorry, this invite has expired!`);
      await interaction.followUp(
        DiscordService.sentInviteExpiredMessage(invitedMember)
      );
    });
  },
};
