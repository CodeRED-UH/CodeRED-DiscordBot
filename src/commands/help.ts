import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../interfaces/Command";
import { createGeneral } from "../utils/embedCreator";

export const help: Command = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Provides information on using this bot."),
  execute: async (interaction, client) => {
    await interaction.deferReply({ ephemeral: true });

    const title = "**Help** ⛑ ";
    const description = `Hi! I'm <@${client.user?.id}>! Here are some of my commands!\n`;
    const fields = [
      {
        name: "✅ `/verify`",
        value: "Verifies your registration prior to CodeRED Odyssey.",
      },
      {
        name: "📝 `/checkin`",
        value:
          "Checks you into CodeRED Odyssey using your registered email address.",
      },
      {
        name: "🚗 `/checkout`",
        value:
          "Checks you out of CodeRED Odyssey using your registered email address.",
      },
      {
        name: "🫂 `/createteam`",
        value:
          "Creates a new role and channel for your hackathon team! You can also set the hex value color.",
      },
      {
        name: "🚪 `/leaveteam`",
        value:
          "Removes your from your current team. If you are the last member then the team will be permanently deleted.",
      },
      {
        name: "📨 `/invite`",
        value: "Allows you to send an invite for your team to another hacker!",
      },
      {
        name: "✨ `/promote`",
        value:
          "Sends a promotion message to allow any hacker to join your team!",
      },
      {
        name: "🎲 `/roulette`",
        value:
          "Randomly matches you with another teamless hacker to hopefully start a new team!",
      },
      {
        name: "👤 `/team`",
        value:
          "View a team's info given a user or team name, or neither to see your own!",
      },
      {
        name: "👥 `/teams`",
        value: "View all of the different teams signed up for CodeRED Odyssey!",
      },
      {
        name: "🗺️ `/map`",
        value: "Shows you the map of our venue and exit.",
      },
      {
        name: "📢 `/report`",
        value:
          "Lets you send a report to the CodeRED Officer team for emergencies or other critical issues.",
      },
    ];

    const returnMessage = createGeneral(client, title, description, fields);

    await interaction.editReply({ embeds: [returnMessage] });
    return;
  },
};
