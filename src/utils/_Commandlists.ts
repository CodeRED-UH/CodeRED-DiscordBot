import { Command } from "../interfaces/Command";
import { help } from "../commands/help";
import { report } from "../commands/report";
import { purge } from "../commands/purge";

export const CommandList: Command[] = [help, report, purge];
