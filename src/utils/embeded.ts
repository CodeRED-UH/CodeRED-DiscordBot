import { Client, MessageEmbed } from "discord.js";

const checkAvatar = (client: Client): string => {
  let iconURL: string | null | undefined;

  if (
    client.user?.avatarURL({ format: "png" }) === null ||
    client.user?.avatarURL({ format: "png" }) === undefined
  ) {
    iconURL = "https://avatars.githubusercontent.com/u/107168679?s=200&v=4";
  } else {
    iconURL = client.user?.avatarURL({ format: "png" });
  }

  return iconURL as string;
};

export function general(
  title: string,
  message: string,
  client: Client
): MessageEmbed {
  const iconURL = checkAvatar(client);

  return new MessageEmbed()
    .setColor("#ffeded")
    .setTitle(`${title}`)
    .setDescription(message)
    .setTimestamp()
    .setFooter({
      text: `${client.user?.tag}`,
      iconURL: iconURL as string,
    });
}

export function success(
  title: string | null,
  message: string,
  client: Client
): MessageEmbed {
  const iconURL = checkAvatar(client);

  if (title) {
    return new MessageEmbed()
      .setColor("#4BB543")
      .setTitle(`✅ ${title}`)
      .setDescription(message)
      .setTimestamp()
      .setFooter({
        text: `${client.user?.tag}`,
        iconURL: iconURL as string,
      });
  }

  return new MessageEmbed()
    .setColor("#4BB543")
    .setTitle(`✅ Success!`)
    .setDescription(message)
    .setTimestamp()
    .setFooter({
      text: `${client.user?.tag}`,
      iconURL: iconURL as string,
    });
}

export const error = (
  title: string | null,
  message: string,
  client: Client
): MessageEmbed => {
  const iconURL = checkAvatar(client);

  if (title) {
    return new MessageEmbed()
      .setColor("#FF0000")
      .setTitle(`❌ ${title}`)
      .setDescription(message)
      .setTimestamp()
      .setFooter({
        text: `${client.user?.tag}`,
        iconURL: iconURL as string,
      });
  }

  return new MessageEmbed()
    .setColor("#FF0000")
    .setTitle("❌ There seems to have been an error.")
    .setDescription(message)
    .setTimestamp()
    .setFooter({
      text: `${client.user?.tag}`,
      iconURL: iconURL as string,
    });
};

export const warn = (
  title: string | null,
  message: string,
  client: Client
): MessageEmbed => {
  const iconURL = checkAvatar(client);

  if (title) {
    return new MessageEmbed()
      .setColor("#eed202")
      .setTitle(`⚠️ ${title}`)
      .setDescription(message)
      .setTimestamp()
      .setFooter({
        text: `${client.user?.tag}`,
        iconURL: iconURL as string,
      });
  }

  return new MessageEmbed()
    .setColor("#eed202")
    .setTitle("⚠️ Warning")
    .setDescription(message)
    .setTimestamp()
    .setFooter({
      text: `${client.user?.tag}`,
      iconURL: iconURL as string,
    });
};
