export function getText(msg) {
  return (
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text ||
    ""
  ).trim();
}

export function getCommand(text) {
  if (!text.startsWith(".")) return null;

  return text
    .slice(1)
    .trim()
    .split(/\s+/)[0]
    .toLowerCase();
}

export function getArgs(text) {
  return text
    .trim()
    .split(/\s+/)
    .slice(1);
}

export function isGroup(jid) {
  return jid?.endsWith("@g.us");
}
