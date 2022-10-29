import { Command } from "../interfaces/Command";
import { help } from "../commands/help";
import { report } from "../commands/report";
import { purge } from "../commands/purge";
import { map } from "../commands/map";
import { botmessage } from "../commands/botmessage";
import { checkin } from "../commands/checkin";
import { checkout } from "../commands/checkout";
import { createteam } from "../commands/createteam";
import { invite } from "../commands/invite";
import { leaveteam } from "../commands/leaveteam";
import { promote } from "../commands/promote";
import { roulette } from "../commands/roulette";
import { verify } from "../commands/verify";
import { team } from "../commands/team";
import { teams } from "../commands/teams";
import { teamname } from "../commands/teamname";
import { autoteam } from "../commands/autoteam";
import { autoteamrole } from "../commands/autoteamrole";

export const CommandList: Command[] = [
  help,
  report,
  purge,
  map,
  botmessage,
  checkin,
  checkout,
  createteam,
  invite,
  leaveteam,
  promote,
  roulette,
  verify,
  team,
  teams,
  teamname,
  autoteam,
  autoteamrole,
];
