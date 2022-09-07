import { Client, EmbedBuilder } from "discord.js";
import { EmbededField } from "../interfaces/Embeded";

export const general = (
  client: Client,
  title: string,
  description: string,
  fields: EmbededField[]
) => {
  const embeded = new EmbedBuilder()
    .setColor("#ffeded")
    .setTitle(title)
    .setDescription(description)
    .setTimestamp()
    .setFooter({
      text: `${client.user?.tag}`,
      iconURL: client.user?.displayAvatarURL(),
    });

  if (fields.length !== 0) {
    fields.map((data) => {
      embeded.addFields([
        {
          name: data.name,
          value: data.value,
        },
      ]);
    });
  }

  return embeded;
};

export const success = (
  client: Client,
  title: string | undefined,
  description: string,
  fields: EmbededField[]
) => {
  if (title) {
    const embeded = new EmbedBuilder()
      .setColor("#4BB543")
      .setTitle(`✅ ${title}`)
      .setDescription(description)
      .setTimestamp()
      .setFooter({
        text: `${client.user?.tag}`,
        iconURL: client.user?.displayAvatarURL(),
      });

    if (fields.length !== 0) {
      fields.map((data) => {
        embeded.addFields([
          {
            name: data.name,
            value: data.value,
          },
        ]);
      });
    }

    return embeded;
  }

  const embeded = new EmbedBuilder()
    .setColor("#4BB543")
    .setTitle(`✅ Success!`)
    .setDescription(description)
    .setTimestamp()
    .setFooter({
      text: `${client.user?.tag}`,
      iconURL: client.user?.displayAvatarURL(),
    });

  if (fields.length !== 0) {
    fields.map((data) => {
      embeded.addFields([
        {
          name: data.name,
          value: data.value,
        },
      ]);
    });
  }

  return embeded;
};

export const error = (
  client: Client,
  title: string | undefined,
  description: string,
  fields: EmbededField[]
) => {
  if (title) {
    const embeded = new EmbedBuilder()
      .setColor("#FF0000")
      .setTitle(`❌ ${title}`)
      .setDescription(description)
      .setTimestamp()
      .setFooter({
        text: `${client.user?.tag}`,
        iconURL: client.user?.displayAvatarURL(),
      });

    if (fields.length !== 0) {
      fields.map((data) => {
        embeded.addFields([
          {
            name: data.name,
            value: data.value,
          },
        ]);
      });
    }

    return embeded;
  }

  const embeded = new EmbedBuilder()
    .setColor("#FF0000")
    .setTitle("❌ There seems to have been an error.")
    .setDescription(description)
    .setTimestamp()
    .setFooter({
      text: `${client.user?.tag}`,
      iconURL: client.user?.displayAvatarURL(),
    });

  if (fields.length !== 0) {
    fields.map((data) => {
      embeded.addFields([
        {
          name: data.name,
          value: data.value,
        },
      ]);
    });
  }

  return embeded;
};

export const warn = (
  client: Client,
  title: string | undefined,
  description: string,
  fields: EmbededField[]
) => {
  if (title) {
    const embeded = new EmbedBuilder()
      .setColor("#eed202")
      .setTitle(`⚠️ ${title}`)
      .setDescription(description)
      .setTimestamp()
      .setFooter({
        text: `${client.user?.tag}`,
        iconURL: client.user?.displayAvatarURL(),
      });

    if (fields.length !== 0) {
      fields.map((data) => {
        embeded.addFields([
          {
            name: data.name,
            value: data.value,
          },
        ]);
      });
    }

    return embeded;
  }

  const embeded = new EmbedBuilder()
    .setColor("#eed202")
    .setTitle("⚠️ Warning")
    .setDescription(description)
    .setTimestamp()
    .setFooter({
      text: `${client.user?.tag}`,
      iconURL: client.user?.displayAvatarURL(),
    });

  if (fields.length !== 0) {
    fields.map((data) => {
      embeded.addFields([
        {
          name: data.name,
          value: data.value,
        },
      ]);
    });
  }

  return embeded;
};
