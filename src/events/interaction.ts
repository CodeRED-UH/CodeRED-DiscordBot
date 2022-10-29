import {
  Client,
  ChatInputCommandInteraction,
  BaseInteraction,
} from "discord.js";
import { CommandList } from "../utils/_Commandlists";
// import { createError } from "../utils/embedCreator";
import DiscordService from "../utils/DiscordService";

export const onInteraction = async (
  interaction: BaseInteraction,
  client: Client
) => {
  if (interaction.isCommand()) {
    for (const Command of CommandList) {
      if (interaction.commandName == Command.data.name) {
        try {
          await Command.execute(
            interaction as ChatInputCommandInteraction,
            client
          );
          break;
        } catch (err) {
          // const errorMessage = createError(
          //   client,
          //   undefined,
          //   "An error occured while attempting to run the command.",
          //   []
          // );
          // await interaction.reply({ embeds: [errorMessage], ephemeral: true });
          await DiscordService.log(`Error in interaction.ts: ${err}`, null);
        }
      }
    }
  }
};
