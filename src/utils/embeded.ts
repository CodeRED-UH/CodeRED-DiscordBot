import { Client, MessageEmbed, User } from "discord.js";

export function createEmbeded(
  title: string,
  message: string,
  user: User,
  client: Client
): MessageEmbed {
  let iconURL: string | null | undefined;

  if (client.user?.avatarURL({ format: "png" }) === null) {
    iconURL = "https://avatars.githubusercontent.com/u/107168679?s=200&v=4";
  } else {
    iconURL = client.user?.avatarURL({ format: "png" });
  }

  return new MessageEmbed()
    .setColor("#ffeded")
    .setTitle(title)
    .setDescription(message)
    .setTimestamp()
    .setFooter({
      text: `${client.user?.tag}`,
      iconURL: iconURL as string,
    });
}
