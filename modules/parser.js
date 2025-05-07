/* Parses the raw ChatGPT export JSON and returns only the user messages 

export function getUserMessages(rawJson) {
    // TODO: filter for { role: "user" } etc.
    return [];
  }
  */ 
 // modules/parser.js

export function getUserMessages(conversations) {
  const result = [];

  conversations.forEach(convo => {
    const mapping = convo.mapping;

    // Loop through all nodes in the conversation mapping
    for (const nodeId in mapping) {
      const node = mapping[nodeId];

      // Defensive checks
      if (!node || !node.message || !node.message.author || !node.message.content) continue;

      const author = node.message.author.role;
      const contentParts = node.message.content.parts;
      const timestamp = node.message.create_time;

      // Only take user messages
      if (author === "user" && Array.isArray(contentParts)) {
        const fullMessage = contentParts.join('\n'); // join in case there are multiple parts
        result.push({ message: fullMessage, timestamp });
      }
    }
  });

  return result;
}
