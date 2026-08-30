export async function getGroupInfo(sock, groupId) {
  const metadata = await sock.groupMetadata(groupId);

  const admins = metadata.participants.filter(
    (member) =>
      member.admin === "admin" ||
      member.admin === "superadmin"
  );

  return {
    subject: metadata.subject,
    description: metadata.desc || "No description",
    memberCount: metadata.participants.length,
    adminCount: admins.length,
    admins
  };
}

export async function sendGroupInfo(sock, groupId) {
  const info = await getGroupInfo(sock, groupId);

  const adminList = info.admins
    .map((admin) => `• @${admin.id.split("@")[0]}`)
    .join("\n");

  await sock.sendMessage(groupId, {
    text:
      `┏━ ɢʀᴏᴜᴘ ɪɴғᴏ ━┓\n` +
      `│\n` +
      `│ 📛 Name: ${info.subject}\n` +
      `│ 👥 Members: ${info.memberCount}\n` +
      `│ 👑 Admins: ${info.adminCount}\n` +
      `│ 📝 Description: ${info.description}\n` +
      `│\n` +
      `┗━━━━━━━━━━━━━━┛\n\n` +
      `👑 ᴀᴅᴍɪɴs\n${adminList}`,
    mentions: info.admins.map((admin) => admin.id)
  });
}
