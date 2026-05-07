import { deleteAllUsers } from "../lib/database/queries/users.js";

export async function handleReset(){
    await deleteAllUsers();
    console.log("Users reseted successfully.");
    process.exit(0);
}