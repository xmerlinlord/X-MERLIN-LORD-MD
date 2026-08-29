export default async function ping(sock, msg) {
  try {
    const jid = msg.key?.remoteJid || msg.key?.participant || msg.sender || "";
    if (!jid) return;

    await sock.sendMessage(jid, { text: "Pong!" }, { quoted: msg });
  } catch (err) {
    console.error("ping command error:", err);
  }
}
