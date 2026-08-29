import { kick } from "../group.js";

export default async function kickCommand(sock, msg) {
  const groupId = msg.key.remoteJid;

  if (!groupId?.endsWith("@g.us")) return;

  const mentioned =
    msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

  if (!mentioned.length) {
    return sock.sendMessage(groupId, {
      text: "❌ Mention the member you want to kick."
    });
  }

  try {
    for (const user of mentioned) {
      await kick(sock, groupId, user);
    }

    await sock.sendMessage(groupId, {
      text: "✅ Member removed from the group.",
      mentions: mentioned
    });
  } catch (error) {
    console.error("Kick command error:", error);

    await sock.sendMessage(groupId, {
      text: "❌ Unable to remove the member."
    });
  }
      }
