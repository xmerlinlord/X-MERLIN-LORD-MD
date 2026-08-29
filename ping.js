export default async function ping(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "🏓 X Merlin Lord MD is online!"
  });
}
