import { SlashCommandBuilder } from "@discordjs/builders";
import DiscordService from "../utils/DiscordService";
import { Command } from "../interfaces/Command";
import { createGeneral } from "../utils/embedCreator";
import GoogleService from "../utils/GoogleService";

export const checkout: Command = {
  data: new SlashCommandBuilder()
    .setName("checkout")
    .setDescription("Check's you out of the CodeRED Odyssey!")
    .addStringOption((option) =>
      option
        .setName("email")
        .setDescription("The email you entered when signing up")
        .setRequired(true)
    ),
  execute: async (interaction, client) => {
    await interaction.deferReply({ ephemeral: true });
    const { user } = interaction;

    const { guild } = interaction;
    if (!guild) return;

    await DiscordService.log(`${user.tag} used /checkout`, guild);
    const email = interaction.options.getString("email", true);

    const emailRange = "B1:B";
    const rowIndexArray = await GoogleService.linearSearch(email, emailRange);

    let message = createGeneral(
      client,
      "**CHECK-OUT SUCCESSFUL!** 👋",
      `You've checked out with ***${email}***.\nThank you for being a part of CodeRED Odyssey!`,
      []
    )
      .setColor(0x00ff00)
      .setFooter(null)
      .setTimestamp(null);

    const failMessage = createGeneral(
      client,
      "**CHECK-OUT FAILED!** ❌",
      `The email ***${email}*** does not match our records.\nPlease make sure to enter the email you signed up with.`,
      []
    )
      .setColor(0xff0000)
      .setFooter(null)
      .setTimestamp(null);

    if (rowIndexArray.length == 0) {
      await DiscordService.log("FAILURE - EMAIL NOT FOUND", guild);
      await interaction.editReply({ embeds: [failMessage] });
      return;
    }

    if (rowIndexArray.length === 1 && rowIndexArray[0] === -1) {
      await DiscordService.log("FAILURE - UNKNOWN SPREADSHEET ERROR", guild);
      await interaction.editReply({ embeds: [failMessage] });
      return;
    }

    let rowIndex = -1;
    for (let i = 0; i < rowIndexArray.length; i++) {
      const ri = rowIndexArray[i];
      const discordCell = (
        await GoogleService.getData("A" + ri.toString())
      ).data.values
        .at(0)
        .at(0);
      if (discordCell === user.tag) {
        rowIndex = ri;
        break;
      }
    }

    if (rowIndex === -1) {
      await DiscordService.log("FAILURE - NO MATCH", guild);
      await interaction.editReply({ embeds: [failMessage] });
      return;
    }

    const statusCell = await GoogleService.getData("C" + rowIndex.toString());
    if (statusCell.data.values.at(0).at(0) !== "Checked In ✅") {
      await DiscordService.log("USELESS - NOT CHECKED IN", guild);
      message = createGeneral(
        client,
        "**CHECK-OUT CANCELED!** ❌",
        `You're not currently checked in with ***${email}***.\nPlease check into the event before checking out.`,
        []
      )
        .setColor(0xff8000)
        .setFooter(null)
        .setTimestamp(null);
      await interaction.editReply({ embeds: [message] });
      return;
    }

    await GoogleService.updateCell("C" + rowIndex.toString(), "Checked Out 🚗");
    await GoogleService.updateCell(
      "E" + rowIndex.toString(),
      new Date().toLocaleTimeString() + " " + new Date().toLocaleDateString()
    );

    if (interaction.member === null) {
      await DiscordService.log("FAILURE - MEMBER ERROR", guild);
      await interaction.editReply({ embeds: [failMessage] });
      return;
    }

    const member = interaction.guild?.members.cache.get(
      interaction.member?.user.id
    );
    const participantRole = interaction.guild?.roles.cache.find(
      (r) => r.name === "Hacker"
    );
    const teamlessRole = interaction.guild?.roles.cache.find(
      (r) => r.name === "Teamless"
    );

    if (!participantRole)
      await DiscordService.log("ROLE ERROR - NOT FOUND", guild);
    else member?.roles.remove(participantRole);
    if (!teamlessRole)
      await DiscordService.log("ROLE ERROR - NOT FOUND", guild);
    else member?.roles.remove(teamlessRole);

    await DiscordService.log("SUCCESS - CHECKOUT", guild);
    await interaction.editReply({ embeds: [message] });
    return;
  },
};
