import { SlashCommandBuilder } from "@discordjs/builders";
import { AttachmentBuilder, EmbedBuilder } from "discord.js";
import { createImage, createError } from "../utils/embededCreator";
import { Command } from "../interfaces/Command";

export const map: Command = {
  data: new SlashCommandBuilder()
    .setName("map")
    .setDescription("Provides venue and exit plan maps")
    .addStringOption((option) =>
      option
        .setName("map")
        .setDescription("Enter either 'venue' or 'exit'")
        .setRequired(true)
    ),
  execute: async (interaction, client) => {
    await interaction.deferReply();

    let file: AttachmentBuilder;
    let mapEmbed: EmbedBuilder;

    const option = interaction.options.getString("map", true);

    if (option === "venue") {
      file = new AttachmentBuilder("src/assets/venue_map.jpg");

      mapEmbed = createImage(client, "Venue Map", "attachment://venue_map.jpg");
      await interaction.editReply({ embeds: [mapEmbed], files: [file] });
    } else if (option === "exit") {
      file = new AttachmentBuilder("src/assets/exit_map.jpg");

      mapEmbed = createImage(client, "Exit Map", "attachment://exit_map.jpg");
      await interaction.editReply({ embeds: [mapEmbed], files: [file] });
    } else {
      mapEmbed = createError(client, "❌ Option not found", "", []);

      await interaction.editReply({ embeds: [mapEmbed] });
    }
  },
};
