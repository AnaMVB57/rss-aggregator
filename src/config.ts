import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
  dbUrl: string;
  currentUserName?: string;
};

function getConfigFilePath(): string {
  return path.join(os.homedir(), ".gatorconfig.json");
}

function validateConfig(rawConfig: any): Config {
  if (typeof rawConfig !== "object" || rawConfig === null) {
    throw new Error("Invalid config: expected an object");
  }
  if (typeof rawConfig.db_url !== "string") {
    throw new Error("Invalid config: missing or invalid db_url");
  }
  return {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name ?? undefined,
  };
}

function writeConfig(config: Config): void {
  const raw = {
    db_url: config.dbUrl,
    current_user_name: config.currentUserName,
  };

  fs.writeFileSync(getConfigFilePath(), JSON.stringify(raw, null, 2), {
    encoding: "utf-8",
  });
}

export function readConfig(): Config {
  const filePath = getConfigFilePath();
  const content = fs.readFileSync(filePath, { encoding: "utf-8" });
  const rawConfig = JSON.parse(content);
  return validateConfig(rawConfig);
}

export function setUser(username: string): void {
  const config = readConfig();
  config.currentUserName = username;
  writeConfig(config);
}
