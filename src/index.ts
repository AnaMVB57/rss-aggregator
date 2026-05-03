import {
  type CommandsRegistry,
  handlerLogin,
  registerCommand,
  runCommand,
} from "./commands/commands.js";

function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log("usage syntax: cli <command> [args...]");
    process.exit(1);
  }

  const registry: CommandsRegistry = {};
  const cmdName = args[0];
  const cmdArgs = args.slice(1);

  registerCommand(registry, "login", handlerLogin);

  try {
    runCommand(registry, cmdName, ...cmdArgs);
  } catch (error) {
    console.error(`Error running command ${cmdName} - ${error}`);
    process.exit(1);
  }
}

main();
