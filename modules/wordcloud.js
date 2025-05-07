export function makeFreqTable(messages) {
  const text = messages.map(m => m.message || '').join(' ').toLowerCase();

  // Extract all words (3+ letters)
  const words = text.match(/\b[a-z]{3,}\b/g) || [];

  // Filter words containing "that"
  const filtered = words.filter(word => word.includes('that'));

  console.log("Words containing 'that':", filtered);

  return filtered;
}
export function makeWordCloud(freqTable) {
  
}
