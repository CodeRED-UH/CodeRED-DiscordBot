import { SlashCommandBuilder } from "@discordjs/builders";
import DiscordService from "../utils/DiscordService";
import { Command } from "../interfaces/Command";

export const roulette: Command = {
  data: new SlashCommandBuilder()
    .setName("roulette")
    .setDescription("Find a random member looking for a team!"),
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const { user } = interaction;

    const guild = interaction.guild;
    if (!guild) return;
    await DiscordService.log(`${user.tag} used /roulette`, guild);

    await guild.members.fetch();
    const teamlessPeople = guild?.roles.cache.find(
      (r) => r.name === "Teamless"
    )?.members;

    teamlessPeople?.delete(user.id);

    if (teamlessPeople?.size === 0) {
      await interaction.editReply(
        `Nobody else is looking for a team right now. Come back later!`
      );
      return;
    }

    await interaction.editReply(
      `${
        interaction.user
      }, you have been randomly matched with ${teamlessPeople?.at(
        teamlessPeople.size * Math.random()
      )}! Ask them if they want to join your team!\nYou can start a team with \`/createteam\` and invite someone with \`/invite\``
    );
  },
};
