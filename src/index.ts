import {
  type CommandsRegistry,
  handleReset,
  registerCommand,
  runCommand,
} from "./commands/commands.js";
import { handlerLogin, handlerRegister, handlerUsers } from "./commands/users.js";
import { handleAggregate, handlerAddFeed, handlerFeeds } from "./commands/feeds.js";
import { handlerFollow, handlerFollowing } from "./commands/feedFollows.js";

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log("usage syntax: cli <command> [args...]");
    process.exit(1);
  }

  const registry: CommandsRegistry = {};
  const cmdName = args[0];
  const cmdArgs = args.slice(1);

registerCommand(registry, "register", handlerRegister);
registerCommand(registry, "login", handlerLogin);
registerCommand(registry, "reset", handleReset);
registerCommand(registry, "users", handlerUsers);
registerCommand(registry, "agg", handleAggregate);
registerCommand(registry, "addfeed", handlerAddFeed);
registerCommand(registry, "feeds", handlerFeeds);
registerCommand(registry, "follow", handlerFollow);
registerCommand(registry, "following", handlerFollowing);

  try {
    await runCommand(registry, cmdName, ...cmdArgs);
  } catch (error) {
    console.error(`Error running command ${cmdName} - ${error}`);
    process.exit(1);
  }
  process.exit(0);
}

main();
