import {
  getGroup,
  saveGroup,
  resetGroup
} from "../database.js";

import {
  getSettings,
  setSetting
} from "../settings.js";

import {
  warnUser,
  getWarnings,
  resetWarnings,
  banUser,
  unbanUser,
  muteUser,
  unmuteUser
} from "../moderation.js";

import {
  isAdmin,
  isBotAdmin
} from "../permissions.js";

import {
  sendGroupInfo
} from "../groupinfo.js";

import {
  tagAll
} from "../tagall.js";

import {
  getRules,
  setRules,
  sendRules
} from "../rules.js";

import {
  kick,
  add,
  promote,
  demote
} from "../group.js";

import {
  containsLink,
  containsBadWord,
  floodDetected
} from "../anti.js";

const floodMap = new Map();

function getText(msg) {
  return (
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text ||
    ""
  ).trim();
}

function getMentioned(msg) {
  return (
    msg.message?.extendedTextMessage?.contextInfo?.mentionedJid ||
    []
  );
}

function getCommand(text) {
  if (!text.startsWith(".")) return null;

  return text
    .slice(1)
    .trim()
    .split(/\s+/)[0]
    .toLowerCase();
}

function getArgs(text) {
  return text.trim().split(/\s+/).slice(1);
}

async function reply(sock, groupId, text) {
  return sock.sendMessage(groupId, { text });
}

async function requireGroup(sock, msg) {
  const groupId = msg.key.remoteJid;

  if (!groupId?.endsWith("@g.us")) {
    return null;
  }

  return groupId;
}

async function requireAdmin(sock, groupId, msg) {
  const sender = msg.key.participant || msg.participant;

  if (!sender) return false;

  return isAdmin(sock, groupId, sender);
}

async function requireBotAdmin(sock, groupId) {
  return isBotAdmin(sock, groupId);
}

async function targetUser(msg) {
  const mentioned = getMentioned(msg);

  if (mentioned.length) {
    return mentioned;
  }

  return [];
}

export async function handleGroupCommand(sock, msg) {
  const groupId = await requireGroup(sock, msg);

  if (!groupId) return false;

  const text = getText(msg);
  const command = getCommand(text);
  const args = getArgs(text);

  if (!command) return false;

  const adminCommands = [
    "promote",
    "demote",
    "add",
    "kick",
    "ban",
    "unban",
    "revoke",
    "muteuser",
    "unmuteuser",
    "warn",
    "warnreset",
    "unwarn",
    "setrules",
    "setwelcome",
    "setgoodbye",
    "subject",
    "desc",
    "close",
    "open",
    "lock",
    "unlock",
    "lockmedia",
    "locklink",
    "unlocklink",
    "lockphoto",
    "lockvideo",
    "lockaudio",
    "locksticker",
    "antilink",
    "antibot",
    "antighost",
    "antisticker",
    "antiword",
    "antispam",
    "antiflood",
    "antiraid",
    "badword",
    "setbadword",
    "removeword",
    "leaveall",
    "resetgroup"
  ];

  if (adminCommands.includes(command)) {
    const admin = await requireAdmin(sock, groupId, msg);

    if (!admin) {
      await reply(
        sock,
        groupId,
        "❌ This command is for group admins only."
      );

      return true;
    }

    const botAdmin = await requireBotAdmin(sock, groupId);

    if (!botAdmin) {
      await reply(
        sock,
        groupId,
        "❌ I need to be a group admin to perform this action."
      );

      return true;
    }
  }

  switch (command) {

    case "promote": {
      const users = await targetUser(msg);

      if (!users.length) {
        return reply(
          sock,
          groupId,
          "❌ Mention the member to promote."
        );
      }

      for (const user of users) {
        await promote(sock, groupId, user);
      }

      await reply(
        sock,
        groupId,
        "👑 Member promoted successfully."
      );

      return true;
    }

    case "demote": {
      const users = await targetUser(msg);

      if (!users.length) {
        return reply(
          sock,
          groupId,
          "❌ Mention the admin to demote."
        );
      }

      for (const user of users) {
        await demote(sock, groupId, user);
      }

      await reply(
        sock,
        groupId,
        "✅ Admin demoted successfully."
      );

      return true;
    }

    case "add": {
      if (!args[0]) {
        return reply(
          sock,
          groupId,
          "❌ Usage: .add 234XXXXXXXXXX"
        );
      }

      const number =
        args[0].replace(/\D/g, "");

      const user =
        `${number}@s.whatsapp.net`;

      try {
        await add(sock, groupId, user);

        await reply(
          sock,
          groupId,
          `✅ Added ${number} to the group.`
        );
      } catch {
        await reply(
          sock,
          groupId,
          "❌ Unable to add that number."
        );
      }

      return true;
    }

    case "kick": {
      const users = await targetUser(msg);

      if (!users.length) {
        return reply(
          sock,
          groupId,
          "❌ Mention the member to kick."
        );
      }

      for (const user of users) {
        await kick(sock, groupId, user);
      }

      await reply(
        sock,
        groupId,
        "🚫 Member removed."
      );

      return true;
    }

    case "ban": {
      const users = await targetUser(msg);

      if (!users.length) {
        return reply(
          sock,
          groupId,
          "❌ Mention the member to ban."
        );
      }

      for (const user of users) {
        banUser(groupId, user);
        await kick(sock, groupId, user);
      }

      await reply(
        sock,
        groupId,
        "🔨 Member banned and removed."
      );

      return true;
    }

    case "unban": {
      const users = await targetUser(msg);

      if (!users.length) {
        return reply(
          sock,
          groupId,
          "❌ Mention the member to unban."
        );
      }

      for (const user of users) {
        unbanUser(groupId, user);
      }

      await reply(
        sock,
        groupId,
        "✅ Member removed from the ban list."
      );

      return true;
    }

    case "muteuser": {
      const users = await targetUser(msg);

      if (!users.length) {
        return reply(
          sock,
          groupId,
          "❌ Mention the member to mute."
        );
      }

      for (const user of users) {
        muteUser(groupId, user);
      }

      await reply(
        sock,
        groupId,
        "🔇 Member added to the mute list."
      );

      return true;
    }

    case "unmuteuser": {
      const users = await targetUser(msg);

      if (!users.length) {
        return reply(
          sock,
          groupId,
          "❌ Mention the member to unmute."
        );
      }

      for (const user of users) {
        unmuteUser(groupId, user);
      }

      await reply(
        sock,
        groupId,
        "🔊 Member removed from the mute list."
      );

      return true;
    }

    case "warn": {
      const users = await targetUser(msg);

      if (!users.length) {
        return reply(
          sock,
          groupId,
          "❌ Mention the member to warn."
        );
      }

      let result = "";

      for (const user of users) {
        const count =
          warnUser(groupId, user);

        result +=
          `⚠️ @${user.split("@")[0]}: ${count} warning(s)\n`;
      }

      await sock.sendMessage(groupId, {
        text: result,
        mentions: users
      });

      return true;
    }

    case "warncount": {
      const users = await targetUser(msg);

      if (!users.length) {
        return reply(
          sock,
          groupId,
          "❌ Mention a member."
        );
      }

      const count =
        getWarnings(groupId, users[0]);

      return reply(
        sock,
        groupId,
        `⚠️ Warnings: ${count}`
      );
    }

    case "warnreset":
    case "unwarn": {
      const users = await targetUser(msg);

      if (!users.length) {
        return reply(
          sock,
          groupId,
          "❌ Mention a member."
        );
      }

      for (const user of users) {
        resetWarnings(groupId, user);
      }

      return reply(
        sock,
        groupId,
        "✅ Warnings reset."
      );
    }

    case "warnings":
    case "warns": {
      const users = await targetUser(msg);

      if (!users.length) {
        return reply(
          sock,
          groupId,
          "❌ Mention a member."
        );
      }

      const count =
        getWarnings(groupId, users[0]);

      return reply(
        sock,
        groupId,
        `⚠️ Warning count: ${count}`
      );
    }

    case "groupinfo": {
      await sendGroupInfo(sock, groupId);
      return true;
    }

    case "membercount": {
      const metadata =
        await sock.groupMetadata(groupId);

      return reply(
        sock,
        groupId,
        `👥 Group members: ${metadata.participants.length}`
      );
    }

    case "admins":
    case "admin":
    case "listadmin": {
      const metadata =
        await sock.groupMetadata(groupId);

      const admins =
        metadata.participants.filter(
          p =>
            p.admin === "admin" ||
            p.admin === "superadmin"
        );

      const mentions =
        admins.map(p => p.id);

      const text =
        "👑 *GROUP ADMINS*\n\n" +
        admins
          .map(
            p => `• @${p.id.split("@")[0]}`
          )
          .join("\n");

      await sock.sendMessage(groupId, {
        text,
        mentions
      });

      return true;
    }

    case "link": {
      const code =
        await sock.groupInviteCode(groupId);

      return reply(
        sock,
        groupId,
        `🔗 Group link:\nhttps://chat.whatsapp.com/${code}`
      );
    }

    case "revoke": {
      await sock.groupRevokeInvite(groupId);

      const code =
        await sock.groupInviteCode(groupId);

      return reply(
        sock,
        groupId,
        `🔐 Old invite revoked.\n\n🔗 New link:\nhttps://chat.whatsapp.com/${code}`
      );
    }

    case "rules": {
      await sendRules(sock, groupId);
      return true;
    }

    case "setrules": {
      const rules = args.join(" ");

      if (!rules) {
        return reply(
          sock,
          groupId,
          "❌ Usage: .setrules your group rules"
        );
      }

      setRules(groupId, rules);

      return reply(
        sock,
        groupId,
        "✅ Group rules updated."
      );
    }

    case "tagall":
    case "mention": {
      await tagAll(
        sock,
        groupId,
        args.join(" ") ||
        "📢 Attention everyone!"
      );

      return true;
    }

    case "subject": {
      const subject = args.join(" ");

      if (!subject) {
        return reply(
          sock,
          groupId,
          "❌ Usage: .subject New Group Name"
        );
      }

      await sock.groupUpdateSubject(
        groupId,
        subject
      );

      return reply(
        sock,
        groupId,
        "✅ Group subject updated."
      );
    }

    case "desc": {
      const description = args.join(" ");

      if (!description) {
        return reply(
          sock,
          groupId,
          "❌ Usage: .desc New description"
        );
      }

      await sock.groupUpdateDescription(
        groupId,
        description
      );

      return reply(
        sock,
        groupId,
        "✅ Group description updated."
      );
    }

    case "close":
    case "lock": {
      await sock.groupSettingUpdate(
        groupId,
        "announcement"
      );

      setSetting(
        groupId,
        "lock",
        true
      );

      return reply(
        sock,
        groupId,
        "🔒 Group locked. Only admins can send messages."
      );
    }

    case "open":
    case "unlock": {
      await sock.groupSettingUpdate(
        groupId,
        "not_announcement"
      );

      setSetting(
        groupId,
        "lock",
        false
      );

      return reply(
        sock,
        groupId,
        "🔓 Group unlocked."
      );
    }

    case "antilink": {
      const value =
        args[0]?.toLowerCase() === "on";

      setSetting(
        groupId,
        "antilink",
        value
      );

      return reply(
        sock,
        groupId,
        value
          ? "🛡️ Anti-link enabled."
          : "🛡️ Anti-link disabled."
      );
    }

    case "antispam": {
      const value =
        args[0]?.toLowerCase() === "on";

      setSetting(
        groupId,
        "antispam",
        value
      );

      return reply(
        sock,
        groupId,
        value
          ? "🛡️ Anti-spam enabled."
          : "🛡️ Anti-spam disabled."
      );
    }

    case "antiflood": {
      const value =
        args[0]?.toLowerCase() === "on";

      setSetting(
        groupId,
        "antiflood",
        value
      );

      return reply(
        sock,
        groupId,
        value
          ? "🛡️ Anti-flood enabled."
          : "🛡️ Anti-flood disabled."
      );
    }

    case "antiraid": {
      const value =
        args[0]?.toLowerCase() === "on";

      setSetting(
        groupId,
        "antiraid",
        value
      );

      return reply(
        sock,
        groupId,
        value
          ? "🛡️ Anti-raid enabled."
          : "🛡️ Anti-raid disabled."
      );
    }

    case "badword":
    case "setbadword": {
      const word = args.join(" ");

      if (!word) {
        return reply(
          sock,
          groupId,
          "❌ Usage: .setbadword word"
        );
      }

      const data =
        getGroup(groupId);

      if (!data.badWords.includes(word)) {
        data.badWords.push(word);
      }

      saveGroup(groupId, data);

      return reply(
        sock,
        groupId,
        "🚫 Bad word added."
      );
    }

    case "removeword": {
      const word =
        args.join(" ").toLowerCase();

      const data =
        getGroup(groupId);

      data.badWords =
        data.badWords.filter(
          w => w.toLowerCase() !== word
        );

      saveGroup(groupId, data);

      return reply(
        sock,
        groupId,
        "✅ Bad word removed."
      );
    }

    case "banlist": {
      const data =
        getGroup(groupId);

      return reply(
        sock,
        groupId,
        data.banned.length
          ? `🚫 Banned members: ${data.banned.length}`
          : "✅ Ban list is empty."
      );
    }

    case "mutelist": {
      const data =
        getGroup(groupId);

      return reply(
        sock,
        groupId,
        data.muted.length
          ? `🔇 Muted members: ${data.muted.length}`
          : "✅ Mute list is empty."
      );
    }

    case "resetgroup": {
      resetGroup(groupId);

      return reply(
        sock,
        groupId,
        "♻️ Group settings have been reset."
      );
    }

    case "leave": {
      await sock.groupLeave(groupId);
      return true;
    }

    default:
      return false;
  }
}

export async function handleProtection(sock, msg) {
  const groupId =
    msg.key.remoteJid;

  if (!groupId?.endsWith("@g.us")) {
    return;
  }

  const sender =
    msg.key.participant;

  if (!sender) return;

  const text = getText(msg);

  const settings =
    getSettings(groupId);

  const data =
    getGroup(groupId);

  const botAdmin =
    await isBotAdmin(sock, groupId);

  if (!botAdmin) return;

  const senderAdmin =
    await isAdmin(
      sock,
      groupId,
      sender
    );

  if (senderAdmin) return;

  if (
    settings.antilink &&
    containsLink(text)
  ) {
    try {
      await sock.sendMessage(
        groupId,
        { delete: msg.key }
      );

      await sock.sendMessage(
        groupId,
        {
          text:
            `🚫 @${sender.split("@")[0]}, links are not allowed here.`,
          mentions: [sender]
        }
      );
    } catch (error) {
      console.error(
        "Anti-link error:",
        error
      );
    }

    return;
  }

  if (
    data.badWords.length &&
    containsBadWord(
      text,
      data.badWords
    )
  ) {
    try {
      await sock.sendMessage(
        groupId,
        { delete: msg.key }
      );
    } catch {}

    return;
  }

  if (
    settings.antiflood &&
    floodDetected(
      sender,
      floodMap
    )
  ) {
    try {
      await sock.groupParticipantsUpdate(
        groupId,
        [sender],
        "remove"
      );
    } catch (error) {
      console.error(
        "Anti-flood error:",
        error
      );
    }
  }
}
