export const commands = {
  group: [
    "promote", "demote", "add", "kick", "ban", "unban",
    "leave", "join", "invite", "link", "revoke", "groupinfo",
    "membercount", "admin", "admins", "listadmin",
    "muteuser", "unmuteuser", "mutelist", "warn", "warncount",
    "warnreset", "unwarn", "banlist", "kicklist", "rules",
    "setrules", "setwelcome", "welcome", "setgoodbye", "goodbye",
    "announce", "tagall", "hidetag", "mention", "afk", "unafk",
    "subject", "desc", "close", "open", "lock", "unlock",
    "lockmedia", "locklink", "unlocklink", "lockphoto",
    "lockvideo", "lockaudio", "locksticker", "togcstatus",
    "antigroupmention", "antilink", "antibot", "antighost",
    "antisticker", "antiword", "antispam", "antiflood",
    "antiraid", "badword", "setbadword", "removeword",
    "leaveall", "resetgroup"
  ],

  auto: [
    "autoread", "autotyping", "autorecord", "autoreact",
    "autostatus", "autodelete", "autoreply", "autowelcome",
    "autogoodbye", "autowarn", "automute", "autokick",
    "autoban", "autoblock", "autounblock", "automention",
    "autotag", "autopin", "autounpin", "autoremove",
    "autolink", "autolinkdel", "autolinkwarn", "autospam",
    "autoflood", "autoclean", "automedia", "autosticker",
    "autovoice", "autodoc", "autoimage", "autovideo",
    "autogif", "autoai", "autotranslate", "autoreaction",
    "autosave", "autobackup", "autobroadcast", "autonews",
    "autoweather", "autoquote", "automeme", "autojoke",
    "autotagall", "autoafk", "autostart", "autorestart",
    "autoupdate"
  ],

  moderator: [
    "ban", "unban", "kick", "mute", "unmute", "warn",
    "unwarn", "warns", "purge", "delete", "lock", "unlock",
    "lockmedia", "locklink", "antilink", "antispam",
    "antiflood", "antiraid", "clean", "slowmode", "locknew",
    "unlocknew", "badword", "setbadword", "whitelist",
    "blacklist", "mods", "modlog", "warnlog", "mutelist"
  ]
};

export function isCommand(command) {
  const name = command.toLowerCase().replace(/^\./, "");

  return Object.values(commands)
    .flat()
    .includes(name);
    }
