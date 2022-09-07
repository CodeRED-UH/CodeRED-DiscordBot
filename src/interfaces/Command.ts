import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import { Client, CommandInteraction } from "discord.js";

export interface Command {
  data:
  | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">
  | SlashCommandSubcommandsOnlyBuilder;
  run: (interaction: CommandInteraction, client: Client) => Promise<void>;
}
