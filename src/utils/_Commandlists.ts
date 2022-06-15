import { Command } from "../interfaces/Command";
import { help } from "../commands/help";
import { report } from "../commands/report";
import { checkin } from "../commands/checkin";
import { checkout } from "../commands/checkout";

export const CommandList: Command[] = [help, report, checkin, checkout];
