import { SlashCommandBuilder } from "@discordjs/builders";
import DiscordService from "../utils/DiscordService";
import { Command } from "../interfaces/Command";
import { TextChannel } from "discord.js";
import { createGeneral } from "../utils/embedCreator";

export const autoteamrole: Command = {
  data: new SlashCommandBuilder()
    .setName("autoteamrole")
    .setDescription("Send the auto team role message!")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Channel to send the message in.")
        .setRequired(true)
    ),
  execute: async (interaction, client) => {
    await interaction.deferReply({ ephemeral: true });
    const { user } = interaction;
    const guild = interaction.guild;
    if (!guild) return;
    await DiscordService.log(`${user.tag} used /autoteamrole`, guild);
    const channel = interaction.options.getChannel(
      "channel",
      true
    ) as TextChannel;
    await channel.bulkDelete(100);

    const teamless = DiscordService.getTeamless(guild);
    if (!teamless) return;
    const embed = createGeneral(
      client,
      "👥 Sign Up for AutoTeam!",
      `${teamless} If you want to be part of a team but don't know anyone to team with, sign up for AutoTeam! After a while once enough people have joined, AutoTeam will randomly select 4 people and create a new team for them! Keep in mind that this is totally voluntary, so it's completely up to you!\n\nReact below to sign up!`,
      []
    ).setColor("Yellow");

    const message = await channel.send({ embeds: [embed] });
    await message.react("👥");

    const collector = message.createReactionCollector();

    await interaction.editReply({
      content: `Message sent in ${channel}!`,
    });

    collector.on("collect", async (reaction, joinUser) => {
      const joinMember = await DiscordService.getMember(guild, joinUser);
      if (!joinMember) return;

      if (await DiscordService.getTeam(joinMember)) return;

      const role = guild.roles.cache.find(
        (role) => role.name.toLowerCase() === "autoteam"
      );
      if (!role) return;

      await joinMember.roles.add(role);
      await DiscordService.log(
        ` - ${joinUser.tag} signed up for AutoTeam!`,
        guild
      );
    });
  },
};
