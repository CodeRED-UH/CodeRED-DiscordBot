import { Command } from "../interfaces/Command";
import { help } from "../commands/help";
import { report } from "../commands/report";
import { checkin } from "../commands/checkin";

export const CommandList: Command[] = [help, report, checkin];
