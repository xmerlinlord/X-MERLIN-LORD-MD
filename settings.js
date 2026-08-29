const settings = new Map();

export function getSettings(groupId) {
  if (!settings.has(groupId)) {
    settings.set(groupId, {
      antilink: false,
      antispam: false,
      antiflood: false,
      antiraid: false,
      welcome: false,
      goodbye: false,
      lock: false,
      lockmedia: false,
      locklink: false
    });
  }

  return settings.get(groupId);
}

export function setSetting(groupId, name, value) {
  const group = getSettings(groupId);

  if (name in group) {
    group[name] = value;
  }

  settings.set(groupId, group);
  return group;
}
