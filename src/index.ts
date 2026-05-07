import {
  type CommandsRegistry,
  handleReset,
  middlewareLoggedIn,
  registerCommand,
  runCommand,
} from "./commands/commands.js";
import { handlerLogin, handlerRegister, handlerListUsers } from "./commands/users.js";
import { handleAggregate, handlerAddFeed, handlerFeeds } from "./commands/feeds.js";
import { handlerFollow, handlerListFeedFollows, handlerUnfollow} from "./commands/feedFollows.js";

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
registerCommand(registry, "users", handlerListUsers);
registerCommand(registry, "agg", handleAggregate);
registerCommand(registry, "addfeed", middlewareLoggedIn(handlerAddFeed));
registerCommand(registry, "feeds", middlewareLoggedIn(handlerFeeds));
registerCommand(registry, "follow", middlewareLoggedIn(handlerFollow));
registerCommand(registry, "following", middlewareLoggedIn(handlerListFeedFollows));
registerCommand(registry, "unfollow", middlewareLoggedIn(handlerUnfollow));

  try {
    await runCommand(registry, cmdName, ...cmdArgs);
  } catch (error) {
    console.error(`Error running command ${cmdName} - ${error}`);
    process.exit(1);
  }
  process.exit(0);
}

main();
