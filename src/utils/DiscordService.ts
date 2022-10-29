import {
  Collection,
  ColorResolvable,
  Guild,
  GuildMember,
  InteractionReplyOptions,
  MessagePayload,
  Role,
  TextChannel,
  User,
} from "discord.js";

class DiscordService {
  static mainRoles = [
    "Hacker",
    "Teamless",
    "Server Booster",
    "Server Manager",
    "@everyone",
    "everyone",
    "verified ✅",
    "here",
    "admin",
    "coderedbot",
    "mentor",
    "volunteer",
    "autoteam",
  ];

  static ephemeral = true;

  static promotionChannel = (guild: Guild): TextChannel => {
    return guild.channels.cache.find(
      (c) => c.id === "1034669843045167168"
    ) as TextChannel;
  };

  static getMember = async (
    guild: Guild,
    user: User
  ): Promise<GuildMember | undefined> => {
    const members = await guild.members.fetch();
    if (!members)
      console.log(`Error in "getMember": No members fetched from guild.`);

    const member = members.find((m) => m.id === user.id);
    if (!member) console.log(`Error in "getMember": User not found in guild.`);

    return member;
  };

  static getGuildRoles = async (
    guild: Guild
  ): Promise<Collection<string, Role> | undefined> => {
    return await guild.roles.fetch();
  };

  static getMemberRoles = async (
    member: GuildMember
  ): Promise<Collection<string, Role>> => {
    return member.roles.cache;
  };

  static getTeams = async (
    guild: Guild
  ): Promise<Collection<string, Role> | undefined> => {
    return (await guild.roles.fetch()).filter((team) =>
      this.teamNameAllowed(team.name)
    );
  };

  static hasRole = async (
    roles: Collection<string, Role>,
    role: Role
  ): Promise<boolean> => {
    const foundRole = roles.find((r) => r === role);
    return foundRole != undefined;
  };

  static getTeam = async (member: GuildMember): Promise<Role | undefined> => {
    const memberRoles = await this.getMemberRoles(member);
    return memberRoles.find(
      (memberRole) =>
        !this.mainRoles.find(
          (mainRole) => mainRole.toLowerCase() === memberRole.name.toLowerCase()
        )
    );
  };

  static teamNameAllowed = (teamName: string): boolean => {
    return !this.mainRoles.find(
      (mainRole) => mainRole.toLowerCase() === teamName.toLowerCase()
    );
  };

  static teamNameTaken = async (
    teamName: string,
    teams: Collection<string, Role>
  ): Promise<boolean> => {
    return !!teams.find(
      (team) => team.name.toLowerCase() === teamName.toLowerCase()
    );
  };

  static getColor = (color: string | null): ColorResolvable => {
    let r = Math.random() * 256;
    let g = Math.random() * 256;
    let b = Math.random() * 256;
    if (color) {
      if (color.length === 6) {
        r = parseInt(color.substring(0, 2), 16) || r;
        g = parseInt(color.substring(2, 4), 16) || g;
        b = parseInt(color.substring(4, 6), 16) || b;
      }
    }
    return [r, g, b];
  };

  static createTeamChannel = async (
    team: Role
  ): Promise<TextChannel | undefined> => {
    const guild = team.guild;
    const channels = await guild.channels.fetch();
    if (!channels) return;
    const targetChannel = channels.find((channel) => {
      if (!channel) return false;
      return channel.name === "unused";
    });
    if (!targetChannel) {
      console.log(
        `Error in "createTeamChannel": The "unused" channel is not found.`
      );
      return undefined;
    }

    const category = targetChannel.parent;
    if (!category) {
      console.log(
        `Error in "createTeamChannel": The team chat category is not found.`
      );
      return undefined;
    }

    const teamChannel = await category.children.create({
      name: team.name,
      permissionOverwrites: [
        {
          id: guild.roles.cache.find((r) => r.name === "@everyone")?.id || "0",
          deny: ["ViewChannel"],
        },
        {
          id: team.id,
          allow: ["ViewChannel", "ReadMessageHistory"],
        },
      ],
    });

    return teamChannel;
  };

  static getTeamChannel = async (
    team: Role
  ): Promise<TextChannel | undefined> => {
    const guild = team.guild;
    const channels = await guild.channels.fetch();
    const targetChannel = channels.find((channel) => {
      if (!channel) return false;
      return channel.name === "unused";
    });

    if (!targetChannel) {
      console.log(
        `Error in "getTeamChannel": The "unused" channel is not found.`
      );
      return undefined;
    }

    const category = targetChannel.parent;
    if (!category) {
      console.log(
        `Error in "getTeamChannel": The team chat category is not found.`
      );
      return undefined;
    }

    const teamChannel = category.children.cache.find((channel) =>
      channel.permissionsFor(team).has(["ViewChannel"])
    );
    if (!teamChannel) {
      // console.log(
      //   `Error in "getTeamChannel": The team channel for ${team.name} is not found.`
      // );
      return undefined;
    }
    return teamChannel as TextChannel;
  };

  static log = async (
    logBody: string,
    guild: Guild | null
  ): Promise<boolean> => {
    console.log(logBody);
    if (!guild) return false;
    const logChannel = guild.channels.cache.find(
      (channel) => channel.id === "1035400889705451601"
    ) as TextChannel;
    if (!logChannel) {
      console.log("Error: Log Channel could not be found");
      return false;
    }
    await logChannel.send(`\`${new Date().toISOString()}\` **${logBody}**`);
    return true;
  };

  static getTeamless = (guild: Guild): Role | undefined => {
    const teamless = guild.roles.cache.find(
      (r) => r.name.toLowerCase() === "teamless"
    );
    if (!teamless) return undefined;
    return teamless as Role;
  };

  static addToTeam = async (member: GuildMember, team: Role): Promise<void> => {
    const guild = team.guild;
    await member.roles.add(team);

    const teamless = this.getTeamless(guild);
    if (teamless) {
      await member.roles.remove(teamless);
    }

    const teamChannel =
      (await this.getTeamChannel(team)) || (await this.createTeamChannel(team));
    if (!teamChannel) return;

    await teamChannel.send(`${member} has joined ${team}!`);
  };

  static addManyToTeam = async (
    members: GuildMember[],
    team: Role
  ): Promise<void> => {
    const guild = team.guild;
    members.forEach(async (member) => await member.roles.add(team));

    const teamless = this.getTeamless(guild);
    if (teamless) {
      members.forEach(async (member) => await member.roles.remove(teamless));
    }

    const teamChannel =
      (await this.getTeamChannel(team)) || (await this.createTeamChannel(team));
    if (!teamChannel) return;

    members.forEach(
      async (member) => await teamChannel.send(`${member} has joined ${team}!`)
    );
  };

  static leaveTeam = async (member: GuildMember): Promise<string> => {
    const guild = member.guild;

    const team = await this.getTeam(member);
    if (!team) return "nothing";

    await member.roles.remove(team);

    const teamless = await this.getTeamless(guild);
    if (teamless) {
      await member.roles.add(teamless);
    }

    const teamChannel =
      (await this.getTeamChannel(team)) || (await this.createTeamChannel(team));
    if (!teamChannel) return team.name;

    await teamChannel.send(`${member} has left ${team}`);

    if (team.members.size > 0) return team.name;
    await teamChannel.delete();
    await team.delete();

    return team.name;
  };

  static verified = async (member: GuildMember): Promise<boolean> => {
    const roles = await this.getMemberRoles(member);
    return !!roles.find((r) => r.name.toLowerCase() === "verified ✅");
  };

  static alreadyInTeamMessage = (team: Role): { content: string } => {
    return {
      content: `Sorry, you can only be in 1 team at a time! You're currently in: ${team}.`,
    };
  };

  static otherAlreadyInTeamMessage = (
    member: GuildMember,
    team: Role
  ): string | MessagePayload | InteractionReplyOptions => {
    return {
      content: `Sorry, ${member} is already in team ${team}.`,
    };
  };

  static otherNotInTeamMessage = (
    member: GuildMember
  ): string | MessagePayload | InteractionReplyOptions => {
    return {
      content: `${member} is not in a team.`,
    };
  };

  static userNotInThisTeamMessage = (
    user: User,
    team: Role
  ): string | MessagePayload | InteractionReplyOptions => {
    return {
      content: `${user} is not in ${team}.`,
    };
  };

  static badTeamNameMessage = (
    teamName: string
  ): string | MessagePayload | InteractionReplyOptions => {
    return {
      content: `Sorry, the team name **${teamName}** is not allowed. Please pick another name!`,
    };
  };

  static takenTeamNameMessage = (
    teamName: string
  ): string | MessagePayload | InteractionReplyOptions => {
    return {
      content: `Sorry, the team name **${teamName}** is already taken. Please pick another name!`,
    };
  };

  static newTeamMessage = async (
    team: Role
  ): Promise<string | MessagePayload | InteractionReplyOptions> => {
    const teamChannel = (await this.getTeamChannel(team)) || `#${team.name}`;
    return {
      content: `Congratulations! You have successfully created your new team, ${team}! Chat with your team in ${teamChannel}!`,
    };
  };

  static botInviteMessage = ():
    | string
    | MessagePayload
    | InteractionReplyOptions => {
    return {
      content: `You cannot have a bot on your team. 🤖`,
    };
  };

  static inviteFromDifferentTeamMessage = (
    team: Role
  ): string | MessagePayload | InteractionReplyOptions => {
    return {
      content: `You cannot send an invite for ${team}.`,
    };
  };

  static teamAtMaxMessage = (
    team: Role
  ): string | MessagePayload | InteractionReplyOptions => {
    return {
      content: `Your team ${team} has already hit the maximum of 4 people.`,
    };
  };

  static inviteSentMessage = (
    user: User,
    team: Role
  ): string | MessagePayload | InteractionReplyOptions => {
    return {
      content: `Invite for ${user} to join ${team} sent!`,
    };
  };

  static noTeamToInviteToMessage = ():
    | string
    | MessagePayload
    | InteractionReplyOptions => {
    return {
      content: `You must be in a team to invite somebody!`,
    };
  };

  static joinedTeamMessage = async (team: Role): Promise<string> => {
    const teamName = team.name;
    const teamChannel = await this.getTeamChannel(team);
    return `Congratulations! You have successfully joined **${teamName}**! Chat with your team in ${teamChannel}!`;
  };

  static cannotLeaveTeamMessage = (
    team: Role
  ): string | MessagePayload | InteractionReplyOptions => {
    return {
      content: `Sorry, you cannot leave **${team.name}**.`,
    };
  };

  static leaveTeamMessage = (
    teamName: string
  ): string | MessagePayload | InteractionReplyOptions => {
    return {
      content: `You have left the team **${teamName}**.`,
    };
  };

  static inviteMessage = (user: User, team: Role, sender: User): string => {
    return `Hello ${user}! You have been invited to join the team **${team.name}** from ${sender}! Please react with ✅ in the next 10 minutes to accept!`;
  };

  static sentInviteExpiredMessage = (
    invitedMember: GuildMember
  ): string | MessagePayload | InteractionReplyOptions => {
    return {
      content: `Invite to ${invitedMember} has expired.`,
      ephemeral: this.ephemeral,
    };
  };

  static notInTeamMessage = ():
    | string
    | MessagePayload
    | InteractionReplyOptions => {
    return {
      content: `You are not currently in a team.`,
    };
  };

  static promotionMessage = async (team: Role): Promise<string> => {
    const teamless = (await this.getTeamless(team.guild)) || "Teamless people!";
    return `${teamless} React with ✅ to join ${team}!`;
  };

  static verifiedMessage = ():
    | string
    | MessagePayload
    | InteractionReplyOptions => {
    return {
      content: `✅ You have been verified!`,
    };
  };

  static notVerifiedMessage = (
    email: string
  ): string | MessagePayload | InteractionReplyOptions => {
    return {
      content: `❌ We could not verify you with the email **${email}**.`,
    };
  };
}

export default DiscordService;
