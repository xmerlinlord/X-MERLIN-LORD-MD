export async function sendWelcome(sock, groupId, userId) {
  await sock.sendMessage(groupId, {
    text:
      `👋 Welcome @${userId.split("@")[0]}!\n\n` +
      `⚡ Welcome to the group!\n` +
      `📜 Please follow the group rules.`,
    mentions: [userId]
  });
}

export async function sendGoodbye(sock, groupId, userId) {
  await sock.sendMessage(groupId, {
    text:
      `👋 Goodbye @${userId.split("@")[0]}!\n\n` +
      `⚡ You have left the group.`,
    mentions: [userId]
  });
}
