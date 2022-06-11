import { Command } from "../interfaces/Command";
import { help } from "../commands/help";
import { report } from "../commands/report";

export const CommandList: Command[] = [help, report];
