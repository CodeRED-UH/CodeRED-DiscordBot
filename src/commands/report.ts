import { SlashCommandBuilder } from "@discordjs/builders";
import { TextChannel } from "discord.js";
import DiscordService from "../utils/DiscordService";
import { Command } from "../interfaces/Command";
import { createGeneral, createSuccess } from "../utils/embedCreator";

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
    const { user } = interaction;

    const { guild } = interaction;
    if (!guild) return;
    await DiscordService.log(`${user.tag} used /report`, guild);

    const report = interaction.options.getString("report", true);

    const description = `Your report with the contents:\n\n"${report}"\n\nhas been successfully submitted!`;

    const returnMessage = createSuccess(
      client,
      "**Report 📞**",
      description,
      []
    )
      .setFooter(null)
      .setTimestamp(null);

    const adminRole =
      guild.roles.cache.find((r) => r.name === "Admin") || "Administrators!";

    const reportMessage = createGeneral(
      client,
      "**User Report 📢**",
      `Report from ${user}:\n\n"${report}"`,
      []
    )
      .setFooter(null)
      .setTimestamp(null)
      .setColor(0xff0000);

    await interaction.editReply({ embeds: [returnMessage] });

    const officerChannel = guild.channels.cache.find(
      (c) => c.id === "1026240330212843540"
    ) as TextChannel;
    if (!officerChannel) return;
    await officerChannel.send({
      content: `${adminRole}`,
      embeds: [reportMessage],
    });
    return;
  },
};
