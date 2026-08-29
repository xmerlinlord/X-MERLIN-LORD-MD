import { banUser } from "../moderation.js";
import { kick } from "../group.js";

export default async function banCommand(sock, msg) {
  const groupId = msg.key.remoteJid;

  if (!groupId?.endsWith("@g.us")) return;

  const mentioned =
    msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

  if (!mentioned.length) {
    return sock.sendMessage(groupId, {
      text: "❌ Mention the member you want to ban."
    });
  }

  try {
    for (const user of mentioned) {
      banUser(groupId, user);
      await kick(sock, groupId, user);
    }

    await sock.sendMessage(groupId, {
      text: "🚫 Member banned and removed from the group.",
      mentions: mentioned
    });
  } catch (error) {
    console.error("Ban command error:", error);

    await sock.sendMessage(groupId, {
      text: "❌ Unable to ban the member."
    });
  }
}
