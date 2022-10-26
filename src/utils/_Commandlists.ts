import { Command } from "../interfaces/Command";
import { help } from "../commands/help";
import { report } from "../commands/report";
import { checkin } from "../commands/checkin";
import { checkout } from "../commands/checkout";
import { roulette } from "../commands/roulette";
import { createteam } from "../commands/createteam";
import { leaveteam } from "../commands/leaveteam";
import { invite } from "../commands/invite";
import { purge } from "../commands/purge";
import { promote } from "../commands/promote";
import { verify } from "../commands/verify";

export const CommandList: Command[] = [
  help,
  report,
  checkin,
  checkout,
  roulette,
  createteam,
  leaveteam,
  invite,
  purge,
  promote,
  verify,
];
