import fs from "node:fs";

export function getEnvVariable(key: string): string {
  const filePath = process.env[`${key}_FILE`];
  if (filePath && fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, "utf8").trim();
  }

  const value = process.env[key]?.trim();
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
}
