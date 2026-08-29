const groupRules = new Map();

export function setRules(groupId, rules) {
  groupRules.set(groupId, rules);
}

export function getRules(groupId) {
  return (
    groupRules.get(groupId) ||
    "📜 No group rules have been set yet."
  );
}

export async function sendRules(sock, groupId) {
  const rules = getRules(groupId);

  await sock.sendMessage(groupId, {
    text:
      `┏━ 📜 ɢʀᴏᴜᴘ ʀᴜʟᴇs ━┓\n\n` +
      `${rules}\n\n` +
      `┗━━━━━━━━━━━━━━┛`
  });
}
