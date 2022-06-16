import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, MessageAttachment } from "discord.js";
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
  run: async (interaction, client) => {
    await interaction.deferReply();

    let iconURL: string | null | undefined;
    if (client.user?.avatarURL({ format: "png" }) === null) {
      iconURL = "https://avatars.githubusercontent.com/u/107168679?s=200&v=4";
    } else {
      iconURL = client.user?.avatarURL({ format: "png" });
    }

    let file: MessageAttachment;
    let mapEmbed: MessageEmbed;

    switch (interaction.options.getString("map", true)) {
      case "venue": {
        file = new MessageAttachment("src/assets/venue_map.jpg");
        mapEmbed = new MessageEmbed()
          .setColor("#ffeded")
          .setTitle("Venue Map")
          .setTimestamp()
          .setImage("attachment://venue_map.jpg")
          .setFooter({
            text: `${client.user?.tag}`,
            iconURL: iconURL as string,
          });
        await interaction.editReply({ embeds: [mapEmbed], files: [file] });
        break;
      }
      case "exit": {
        file = new MessageAttachment("src/assets/exit_map.jpg");
        mapEmbed = new MessageEmbed()
          .setColor("#ffeded")
          .setTitle("Venue Map")
          .setTimestamp()
          .setImage("attachment://exit_map.jpg")
          .setFooter({
            text: `${client.user?.tag}`,
            iconURL: iconURL as string,
          });
        await interaction.editReply({ embeds: [mapEmbed], files: [file] });
        break;
      }
      default: {
        mapEmbed = new MessageEmbed()
          .setColor("#ffeded")
          .setTitle("Option not found")
          .setTimestamp()
          .setFooter({
            text: `${client.user?.tag}`,
            iconURL: iconURL as string,
          });
        await interaction.editReply({ embeds: [mapEmbed] });
        break;
      }
    }
  },
};
