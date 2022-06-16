import { Command } from "../interfaces/Command";
import { help } from "../commands/help";
import { report } from "../commands/report";
import { purge } from "../commands/purge";
import { map } from "../commands/map";

export const CommandList: Command[] = [help, report, purge, map];
