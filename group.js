export async function promote(sock, groupId, user) {
  return sock.groupParticipantsUpdate(
    groupId,
    [user],
    "promote"
  );
}

export async function demote(sock, groupId, user) {
  return sock.groupParticipantsUpdate(
    groupId,
    [user],
    "demote"
  );
}

export async function kick(sock, groupId, user) {
  return sock.groupParticipantsUpdate(
    groupId,
    [user],
    "remove"
  );
}

export async function add(sock, groupId, user) {
  return sock.groupParticipantsUpdate(
    groupId,
    [user],
    "add"
  );
}
