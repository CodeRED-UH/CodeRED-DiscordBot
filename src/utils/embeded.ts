import { Client, MessageEmbed, User } from "discord.js";

export function createEmbeded(
  title: string,
  message: string,
  user: User,
  client: Client
): MessageEmbed {
  return new MessageEmbed()
    .setColor("#ffeded")
    .setTitle(title)
    .setDescription(message)
    .setTimestamp()
    .setFooter({
      text: `${client.user?.tag}`,
      iconURL: `${client.user?.avatarURL({ format: "png" })}`,
    });
}
