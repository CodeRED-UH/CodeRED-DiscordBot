import { SlashCommandBuilder } from "@discordjs/builders";
import DiscordService from "../utils/DiscordService";
import { Command } from "../interfaces/Command";

export const promote: Command = {
  data: new SlashCommandBuilder()
    .setName("promote")
    .setDescription(
      "Promote your team to the entire server! This will let anyone join!"
    ),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const { user } = interaction;

    const guild = interaction.guild;
    if (!guild) return;
    await DiscordService.log(`${user.tag} used /promote`, guild);

    const member = await DiscordService.getMember(guild, user);
    if (!member) return;

    const team = await DiscordService.getTeam(member);

    // Cancel if user is not in a team
    if (!team) {
      await interaction.editReply(DiscordService.notInTeamMessage());
      return;
    }

    // Cancel if team is at max capacity
    if (team.members.size >= 4) {
      await interaction.editReply(DiscordService.teamAtMaxMessage(team));
      return;
    }

    const promotionChannel = DiscordService.promotionChannel(guild);
    const promotion = await promotionChannel.send(
      await DiscordService.promotionMessage(team)
    );

    await promotion.react("✅");

    const collector = promotion.createReactionCollector({ time: 5 * 60000 });

    await interaction.editReply({
      content: `Promoted ${team} in ${promotionChannel}!`,
    });

    collector.on("collect", async (reaction, joiningUser) => {
      const joiningMember = await DiscordService.getMember(guild, joiningUser);
      if (!joiningMember) return;

      const currentTeam = await DiscordService.getTeam(joiningMember);
      if (currentTeam)
        return (await user.createDM()).send(
          DiscordService.alreadyInTeamMessage(currentTeam)
        );

      await DiscordService.addToTeam(joiningMember, team);

      if (team.members.size >= 4) {
        collector.stop();
      }
    });

    collector.on("end", async () => {
      await promotion.delete();
    });
  },
};
