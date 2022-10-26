import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../interfaces/Command";
import { createEmbeded } from "../utils/embeded";
import GoogleService from "../utils/GoogleService";
import {
  MessageActionRow,
  MessageSelectMenu,
  Modal,
  TextInputComponent,
  MessageButton,
  User,
  Client,
} from "discord.js";

const failMessage = (email: string, user: User, client: Client<boolean>) => {
  return createEmbeded(
    "**CHECK-IN FAILED** ❌",
    `The email ***${email}*** does not match our records.\nPlease make sure to enter the email you signed up with.`,
    user,
    client
  )
    .setColor(0xff0000)
    .setFooter(null)
    .setTimestamp(null);
};

const cancelMessage = (
  email: string,
  timestamp: string,
  user: User,
  client: Client<boolean>
) => {
  return createEmbeded(
    "**CHECK-IN CANCELED!** ✋",
    `You have already checked in with ***${email}*** at ***${timestamp}***.\nIf this is wrong, please contact a CodeRED officer.`,
    user,
    client
  )
    .setColor(0xff8000)
    .setFooter(null)
    .setTimestamp(null);
};

export const checkin: Command = {
  data: new SlashCommandBuilder()
    .setName("checkin")
    .setDescription("Check's you into the CodeRED Odyssey!")
    .addStringOption((option) =>
      option
        .setName("email")
        .setDescription("The email you entered when signing up")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(1),
  run: async (interaction, client) => {
    await interaction.deferReply({ ephemeral: true });
    const { user } = interaction;
    const email = interaction.options.getString("email", true);

    const emailRange = "B1:B";
    const rowIndexArray = await GoogleService.linearSearch(email, emailRange);

    if (rowIndexArray.length == 0) {
      console.log("FAILURE - EMAIL NOT FOUND");
      await interaction.editReply({
        embeds: [failMessage(email, user, client)],
      });
      return;
    }
    if (rowIndexArray.length === 1 && rowIndexArray[0] === -1) {
      console.log("FAILURE - UNKNOWN SPREADSHEET ERROR");
      await interaction.editReply({
        embeds: [failMessage(email, user, client)],
      });
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
      console.log("FAILURE - NO MATCH");
      await interaction.editReply({
        embeds: [failMessage(email, user, client)],
      });
      return;
    }

    const statusCell = await GoogleService.getData("C" + rowIndex.toString());
    if (statusCell.data.values?.at(0).at(0) === "Checked In ✅") {
      console.log("USELESS - CHECKED IN");
      const timestamp = await GoogleService.getData("D" + rowIndex.toString());
      await interaction.editReply({
        embeds: [
          cancelMessage(email, timestamp.data.values.at(0).at(0), user, client),
        ],
      });
      return;
    }

    const waiverMessage = createEmbeded(
      "**REQUIRED WAIVER** 📝",
      "Please review the following Accident Waiver and Release of Liability Form:\n" +
        "https://drive.google.com/file/d/1XJisJxg0LmXsVyWS-3KnYBrCqfuAF9cJ/view",
      user,
      client
    )
      .setColor(0xff0000)
      .setFooter(null)
      .setTimestamp(null);

    const button = new MessageButton()
      .setCustomId("waiverModal")
      .setLabel("Sign Waiver")
      .setEmoji("✏️")
      .setStyle(1);

    const buttonArea = new MessageActionRow().addComponents(button);

    await interaction.editReply({
      embeds: [waiverMessage],
      components: [buttonArea],
    });

    client.once("interactionCreate", async (buttonInteraction) => {
      if (!buttonInteraction.isButton()) return;

      const firstName = new TextInputComponent()
        .setCustomId("first")
        .setPlaceholder("First Name")
        .setLabel("Signature of Acknowledgement & Agreement")
        .setStyle(1)
        .setRequired(true)
        .setMinLength(1);
      const lastName = new TextInputComponent()
        .setCustomId("last")
        .setPlaceholder("Last Name")
        .setLabel("Signature of Acknowledgement & Agreement")
        .setStyle(1)
        .setRequired(true)
        .setMinLength(1);

      const row1 = new MessageActionRow<TextInputComponent>().addComponents(
        firstName
      );
      const row2 = new MessageActionRow<TextInputComponent>().addComponents(
        lastName
      );

      const modal = new Modal()
        .setCustomId("myModal")
        .setTitle("Required Waiver")
        .addComponents(row1, row2);
      await buttonInteraction.showModal(modal);
      await interaction.editReply({
        components: [],
      });

      client.once("interactionCreate", async (modalSubmitInteraction) => {
        if (!modalSubmitInteraction.isModalSubmit()) return;
        const first = modalSubmitInteraction.fields.getField("first").value;
        const last = modalSubmitInteraction.fields.getField("last").value;
        await modalSubmitInteraction.deferReply({ ephemeral: true });

        const message = createEmbeded(
          "**CHECK-IN SUCCESSFUL!** ✅",
          `Thank you for checking into CodeRED Odyssey!\nYour email ***${email}*** has been verified!\n\n**Do you already have a team?**`,
          user,
          client
        )
          .setColor(0x00ff00)
          .setFooter(null)
          .setTimestamp(null);

        await GoogleService.updateCell(
          "F" + rowIndex.toString(),
          `${first} ${last}`
        );
        const range = "C" + rowIndex.toString();
        const values = [
          [
            "Checked In ✅",
            new Date().toLocaleTimeString() +
              " " +
              new Date().toLocaleDateString(),
          ],
        ];
        await GoogleService.updateRange(range, values);
        if (modalSubmitInteraction.member === null) {
          console.log("FAILURE - MEMBER ERROR");
          await modalSubmitInteraction.editReply({
            embeds: [failMessage(email, user, client)],
          });
          return;
        }

        const member = modalSubmitInteraction.guild?.members.cache.get(
          modalSubmitInteraction.member?.user.id
        );
        if (!member) return;
        if (
          !modalSubmitInteraction.guild?.roles.cache.find(
            (r) => r.name == "Hacker"
          )
        ) {
          member.guild.roles.create({ name: "Hacker" });
        }

        const participantRole = member.guild.roles.cache.find(
          (r) => r.name == "Hacker"
        );
        if (!participantRole) return;
        member.roles.add(participantRole);

        const dropdown = new MessageActionRow().addComponents(
          new MessageSelectMenu()
            .setCustomId("select")
            .setPlaceholder("Select an option")
            .addOptions([
              {
                label: "Yes! My team is gonna crush it!",
                value: "1",
              },
              {
                label: "No, and I want to find a team!",
                value: "2",
              },
              {
                label: "No, and I'd prefer to participate solo!",
                value: "3",
              },
            ])
        );

        console.log("SUCCESS - CHECKIN");
        await modalSubmitInteraction.editReply({
          embeds: [message],
          components: [dropdown],
        });

        member.setNickname(first);

        client.once("interactionCreate", async (interaction2) => {
          if (!interaction2.isSelectMenu()) return;
          if (interaction2.values.at(0) === "2") {
            await interaction2.deferReply({ ephemeral: true });
            await interaction2.editReply(
              "Try the `/roulette` command to find other teamless participants! Good luck!"
            );
            if (modalSubmitInteraction.member != undefined) {
              // const member = interaction2.guild?.members.cache.get(
              //   modalSubmitInteraction.member.user.id
              // );
            }
          } else {
            await interaction2.deferReply({ ephemeral: true });
            await interaction2.editReply(
              "Great! Use the `\\createteam` command to form your own team. Have fun!"
            );
          }
          await modalSubmitInteraction.editReply({
            embeds: [message],
            components: [],
          });
        });
      });
    });
    return;
  },
};

// add your email
// connect with google excel and check if it's there
// if not it will say no basically
// maybe give you a role?
