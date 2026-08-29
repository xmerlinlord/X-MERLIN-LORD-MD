const linkPattern =
  /(https?:\/\/|www\.|chat\.whatsapp\.com\/|wa\.me\/)/i;

export function containsLink(text) {
  return linkPattern.test(text);
}

export function containsBadWord(text, badWords = []) {
  const lowerText = text.toLowerCase();

  return badWords.some((word) =>
    lowerText.includes(word.toLowerCase())
  );
}

export function floodDetected(userId, messageTimes, limit = 5) {
  const now = Date.now();

  if (!messageTimes.has(userId)) {
    messageTimes.set(userId, []);
  }

  const times = messageTimes.get(userId);

  times.push(now);

  const recent = times.filter(
    (time) => now - time < 10000
  );

  messageTimes.set(userId, recent);

  return recent.length >= limit;
}
