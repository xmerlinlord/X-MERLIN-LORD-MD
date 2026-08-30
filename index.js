import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason
} from "@whiskeysockets/baileys";

import pino from "pino";

import { handleGroupCommand, handleProtection } from "./commands/groupCommands.js";

async function startBot() {
  const { state, saveCreds } =
    await useMultiFileAuthState("./auth_info");

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" }),
    printQRInTerminal: true
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "open") {
      console.log("╭━━━〔 X MERLIN LORD MD 〕━━━╮");
      console.log("┃ ✅ WhatsApp connected");
      console.log("┃ 🛡️ Group Manager active");
      console.log("╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯");
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !==
        DisconnectReason.loggedOut;

      console.log(
        "❌ Connection closed.",
        shouldReconnect
          ? "Reconnecting..."
          : "Logged out."
      );

      if (shouldReconnect) {
        startBot();
      }
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];

    if (!msg || msg.key.fromMe) return;

    try {
      await handleProtection(sock, msg);
      await handleGroupCommand(sock, msg);
    } catch (error) {
      console.error("Message handler error:", error);
    }
  });
}

startBot().catch(console.error);
