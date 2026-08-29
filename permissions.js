export async function isAdmin(sock, groupId, userId) {
  const metadata = await sock.groupMetadata(groupId);

  const participant = metadata.participants.find(
    (p) => p.id === userId
  );

  return (
    participant?.admin === "admin" ||
    participant?.admin === "superadmin"
  );
}

export async function isBotAdmin(sock, groupId) {
  const botId = sock.user?.id;

  if (!botId) return false;

  return isAdmin(sock, groupId, botId);
    }
