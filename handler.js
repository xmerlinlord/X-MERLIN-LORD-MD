import { isCommand } from "./commands.js";

export async function handleCommand(sock, msg) {
  const text =
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text ||
    "";

  if (!text.startsWith(".")) return;

  const parts = text.trim().split(/\s+/);
  const command = parts[0].toLowerCase();

  if (!isCommand(command)) return;

  console.log(`📌 Command detected: ${command}`);

  // Command implementation will be added here.
}
