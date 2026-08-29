const groups = new Map();

export function getGroup(groupId) {
  if (!groups.has(groupId)) {
    groups.set(groupId, {
      warnings: {},
      banned: [],
      muted: [],
      badWords: [],
      settings: {
        antilink: false,
        antispam: false,
        antiflood: false,
        antiraid: false,
        welcome: false,
        goodbye: false,
        lock: false
      }
    });
  }

  return groups.get(groupId);
}

export function saveGroup(groupId, data) {
  groups.set(groupId, data);
}

export function resetGroup(groupId) {
  groups.delete(groupId);
      }
