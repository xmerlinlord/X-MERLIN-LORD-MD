import { getGroup, saveGroup } from "./database.js";

export function warnUser(groupId, userId) {
  const group = getGroup(groupId);

  group.warnings[userId] = (group.warnings[userId] || 0) + 1;

  saveGroup(groupId, group);

  return group.warnings[userId];
}

export function getWarnings(groupId, userId) {
  const group = getGroup(groupId);

  return group.warnings[userId] || 0;
}

export function resetWarnings(groupId, userId) {
  const group = getGroup(groupId);

  delete group.warnings[userId];

  saveGroup(groupId, group);
}

export function banUser(groupId, userId) {
  const group = getGroup(groupId);

  if (!group.banned.includes(userId)) {
    group.banned.push(userId);
  }

  saveGroup(groupId, group);
}

export function unbanUser(groupId, userId) {
  const group = getGroup(groupId);

  group.banned = group.banned.filter(
    (id) => id !== userId
  );

  saveGroup(groupId, group);
}

export function muteUser(groupId, userId) {
  const group = getGroup(groupId);

  if (!group.muted.includes(userId)) {
    group.muted.push(userId);
  }

  saveGroup(groupId, group);
}

export function unmuteUser(groupId, userId) {
  const group = getGroup(groupId);

  group.muted = group.muted.filter(
    (id) => id !== userId
  );

  saveGroup(groupId, group);
}
