import { add } from "../group.js";

export default async function addCommand(sock, msg) {
  const groupId = msg.key.remoteJid;

  if (!groupId?.endsWith("@g.us")) return;

  const text =
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text ||
    "";

  const number = text.trim().split(/\s+/)[1];

  if (!number) {
    return sock.sendMessage(groupId, {
      text: "❌ Usage: .add 234XXXXXXXXXX"
    });
  }

  const user = number.replace(/\D/g, "") + "@s.whatsapp.net";

  try {
    await add(sock, groupId, user);

    await sock.sendMessage(groupId, {
      text: `✅ Added @${number.replace(/\D/g, "")} to the group.`,
      mentions: [user]
    });
  } catch (error) {
    console.error("Add command error:", error);

    await sock.sendMessage(groupId, {
      text: "❌ Unable to add that member."
    });
  }
  }
