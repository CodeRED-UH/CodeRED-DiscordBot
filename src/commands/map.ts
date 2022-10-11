import { SlashCommandBuilder } from "@discordjs/builders";
import { AttachmentBuilder, Client, EmbedBuilder } from "discord.js";
import { createImage, createError } from "../utils/embedCreator";
import { Command } from "../interfaces/Command";

interface option {
  attachment: AttachmentBuilder;
  imageEmbed: EmbedBuilder;
}

const createOption = (file: string, client: Client, title: string): option => {
  const attachment = new AttachmentBuilder(`src/assets/${file}`);
  const imageEmbed = createImage(client, title, `attachment://${file}`);

  return {
    attachment: attachment,
    imageEmbed: imageEmbed,
  };
};

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

    const option = interaction.options.getString("map", true);

    if (option === "venue") {
      const data = createOption("venue_map.jpg", client, "Venue Map");

      await interaction.editReply({
        embeds: [data.imageEmbed],
        files: [data.attachment],
      });

      return;
    } else if (option === "exit") {
      const data = createOption("exit_map.jpg", client, "Exit Map");

      await interaction.editReply({
        embeds: [data.imageEmbed],
        files: [data.attachment],
      });

      return;
    }

    const errorEmbed = createError(
      client,
      undefined,
      "You've selected an invalid option.",
      []
    );

    await interaction.editReply({ embeds: [errorEmbed] });
    return;
  },
};
