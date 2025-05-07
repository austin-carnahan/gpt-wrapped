// modules/parser.js

export function getUserMessages(conversations) {
  const result = [];

  conversations.forEach(convo => {
    const mapping = convo.mapping;

    for (const nodeId in mapping) {
      const node = mapping[nodeId];

      if (!node || !node.message || !node.message.author || !node.message.content) continue;

      const author = node.message.author.role;
      const contentParts = node.message.content.parts;
      const timestamp = node.message.create_time;

      if (author === "user" && Array.isArray(contentParts)) {
        const fullMessage = contentParts.join('\n').trim();

        if (fullMessage) {
          result.push({
            message: fullMessage,
            timestamp: timestamp ? new Date(timestamp * 1000).toISOString() : null
          });
        }
      }
    }
  });

  // Optional: sort chronologically
  result.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return result;
}
