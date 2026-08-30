export async function tagAll(sock, groupId, message = "📢 Attention everyone!") {
  try {
    const metadata = await sock.groupMetadata(groupId);
    const members = metadata.participants.map(p => p.id);
    
    await sock.sendMessage(groupId, {
      text: message,
      mentions: members
    });
  } catch (error) {
    console.error("Tag all error:", error);
  }
}
