import { SlashCommandBuilder } from "discord.js/node_modules/@discordjs/builders";
import { Command } from "../interfaces/Command";

export const roulette: Command = {
  data: new SlashCommandBuilder()
    .setName("roulette")
    .setDescription("Find a random member looking for a team!"),
  run: async (interaction) => {
    const { user } = interaction;

    const guild = interaction.guild;
    await guild?.members.fetch();
    const teamlessPeople = await guild?.roles.cache.find(
      (r) => r.name === "Teamless"
    )?.members;

    teamlessPeople?.delete(user.id);

    if (teamlessPeople?.size === 0)
      return await interaction.reply(
        `Nobody else is looking for a team right now. Come back later!`
      );

    await interaction.reply(
      `${
        interaction.user
      }, you have been randomly matched with ${teamlessPeople?.at(
        teamlessPeople.size * Math.random()
      )}! Ask them if they want to join your team!\nYou can start a team with \`/createteam\` and invite someone with \`/invite\``
    );
  },
};
