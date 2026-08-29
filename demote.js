import { demote } from "../group.js";

export default async function demoteCommand(sock, msg) {
  const groupId = msg.key.remoteJid;

  const mentioned =
    msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

  if (!groupId.endsWith("@g.us")) return;

  if (!mentioned.length) {
    return sock.sendMessage(groupId, {
      text: "❌ Mention the admin you want to demote."
    });
  }

  for (const user of mentioned) {
    await demote(sock, groupId, user);
  }

  await sock.sendMessage(groupId, {
    text: "✅ Admin demoted successfully."
  });
                            }
