import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason
} from "@whiskeysockets/baileys";
import pino from "pino";
import readline from "readline";
import ping from "./commands/ping.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (text) =>
  new Promise((resolve) => rl.question(text, resolve));

async function startBot() {
  const { state, saveCreds } =
    await useMultiFileAuthState("./session");

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false
  });

  sock.ev.on("creds.update", saveCreds);

  if (!state.creds.registered) {
    const phoneNumber = await question(
      "Enter WhatsApp number with country code: "
    );

    const code = await sock.requestPairingCode(
      phoneNumber.replace(/[^0-9]/g, "")
    );

    console.log(`🔐 Pairing Code: ${code}`);
  }

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];

    if (!msg?.message) return;

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      "";

    if (text.trim().toLowerCase() === ".ping") {
      await ping(sock, msg);
    }
  });

  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "open") {
      console.log("✅ X Merlin Lord MD connected!");
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !==
        DisconnectReason.loggedOut;

      if (shouldReconnect) {
        startBot();
      }
    }
  });
}

startBot();
