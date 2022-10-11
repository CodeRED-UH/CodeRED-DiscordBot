import { Client, EmbedBuilder } from "discord.js";
import { embedField } from "src/interfaces/Embed";

export const createGeneral = (
  client: Client,
  title: string,
  description: string,
  fields: embedField[]
) => {
  const embed = new EmbedBuilder()
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
      embed.addFields([
        {
          name: data.name,
          value: data.value,
        },
      ]);
    });
  }

  return embed;
};

export const createSuccess = (
  client: Client,
  title: string | undefined,
  description: string,
  fields: embedField[]
) => {
  if (title) {
    const embed = new EmbedBuilder()
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
        embed.addFields([
          {
            name: data.name,
            value: data.value,
          },
        ]);
      });
    }

    return embed;
  }

  const embed = new EmbedBuilder()
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
      embed.addFields([
        {
          name: data.name,
          value: data.value,
        },
      ]);
    });
  }

  return embed;
};

export const createError = (
  client: Client,
  title: string | undefined,
  description: string,
  fields: embedField[]
) => {
  if (title) {
    const embed = new EmbedBuilder()
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
        embed.addFields([
          {
            name: data.name,
            value: data.value,
          },
        ]);
      });
    }

    return embed;
  }

  const embed = new EmbedBuilder()
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
      embed.addFields([
        {
          name: data.name,
          value: data.value,
        },
      ]);
    });
  }

  return embed;
};

export const createWarn = (
  client: Client,
  title: string | undefined,
  description: string,
  fields: embedField[]
) => {
  if (title) {
    const embed = new EmbedBuilder()
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
        embed.addFields([
          {
            name: data.name,
            value: data.value,
          },
        ]);
      });
    }

    return embed;
  }

  const embed = new EmbedBuilder()
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
      embed.addFields([
        {
          name: data.name,
          value: data.value,
        },
      ]);
    });
  }

  return embed;
};

export const createImage = (client: Client, title: string, image: string) => {
  const embed = new EmbedBuilder()
    .setColor("#ffeded")
    .setTitle(title)
    .setTimestamp()
    .setFooter({
      text: `${client.user?.tag}`,
      iconURL: client.user?.displayAvatarURL(),
    })
    .setImage(image);

  return embed;
};
