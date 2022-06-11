import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../interfaces/Command";
import { createEmbeded } from "../utils/embeded";

export const report: Command = {
  data: new SlashCommandBuilder()
    .setName("report")
    .setDescription("Provides information on using this bot.")
    .addStringOption((option) =>
      option
        .setName("report")
        .setDescription("The report that you want to make")
        .setRequired(true)
    ),
  run: async (interaction, client) => {
    await interaction.deferReply({ ephemeral: true });
    const { user } = interaction;
    const report = interaction.options.getString("report", true);

    const description = `Your report with the contents\n"${report}"\nhas been successfully submitted`;

    const returnMessage = createEmbeded(
      "**Report 📞**",
      description,
      user,
      client
    );

    await interaction.editReply({ embeds: [returnMessage] });
    return;
  },
};
