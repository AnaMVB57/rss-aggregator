import { CommandsRegistry, handlerLogin, registerCommand, runCommand } from "./commands.js";

function main(){
    const registry: CommandsRegistry = {};

    registerCommand(registry, "login", handlerLogin);
    
    const args = process.argv.slice(2);
    const cmdName = args[0];
    const cmdArgs = args.slice(1);

    runCommand(registry, cmdName, ...cmdArgs);
}

main();