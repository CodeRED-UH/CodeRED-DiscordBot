import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../interfaces/Command";
import { createSuccess } from "../utils/embededCreator";

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
  execute: async (interaction, client) => {
    await interaction.deferReply({ ephemeral: true });

    const report = interaction.options.getString("report", true);

    const description = `Your report with the contents\n"${report}"\nhas been successfully submitted`;

    const returnMessage = createSuccess(
      client,
      "**Report 📞**",
      description,
      []
    );

    await interaction.editReply({ embeds: [returnMessage] });
    return;
  },
};
