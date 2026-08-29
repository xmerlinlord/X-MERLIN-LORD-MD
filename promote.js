import { promote } from "../group.js";

export default async function promoteCommand(sock, msg) {
  const groupId = msg.key.remoteJid;

  const mentioned =
    msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

  if (!groupId.endsWith("@g.us")) return;

  if (!mentioned.length) {
    return sock.sendMessage(groupId, {
      text: "❌ Mention the member you want to promote."
    });
  }

  for (const user of mentioned) {
    await promote(sock, groupId, user);
  }

  await sock.sendMessage(groupId, {
    text: "👑 Member promoted to admin successfully."
  });
  }
