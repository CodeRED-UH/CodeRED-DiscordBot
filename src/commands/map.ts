import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../interfaces/Command";

export const map: Command = {
  data: new SlashCommandBuilder()
    .setName("map")
    .setDescription("Provides venue and exit plan maps"),
  execute: async (interaction) => {
    await interaction.deferReply();

    await interaction.editReply(
      "https://media.discordapp.net/attachments/930994566201487370/1035024330289061919/image0.png?width=1133&height=663"
    );
    return;
  },
};
