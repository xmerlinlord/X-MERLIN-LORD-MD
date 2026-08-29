export async function lockGroup(sock, groupId) {
  await sock.groupSettingUpdate(groupId, "announcement");
}

export async function unlockGroup(sock, groupId) {
  await sock.groupSettingUpdate(groupId, "not_announcement");
}

export async function closeGroup(sock, groupId) {
  await sock.groupSettingUpdate(groupId, "announcement");
}

export async function openGroup(sock, groupId) {
  await sock.groupSettingUpdate(groupId, "not_announcement");
}
