// wordcloud.js
// Load d3 and d3-cloud via CDN in your HTML (not here)
// If using stopword filter, uncomment import below for ES modules:
import { removeStopwords } from 'https://cdn.jsdelivr.net/npm/stopword/+esm';

/**
 * Generates a frequency table from chat messages.
 * @param {string[]} messages - Array of chat message strings.
 * @returns {{ text: string, size: number }[]} Array for word cloud.
 */
export function makeFreqTable(messages) {
  const freqMap = {};
  const allText = messages.join(" ").toLowerCase();
  const words = allText.match(/\b\w+\b/g) || [];

  // Filter out stopwords
  const filteredWords = removeStopwords(words);

  for (const word of filteredWords) {
    if (word.length > 2) {
      freqMap[word] = (freqMap[word] || 0) + 1;
    }
  }

  return Object.entries(freqMap).map(([text, size]) => ({ text, size }));
}

/**
 * Renders a word cloud inside a given target selector.
 * @param {{ text: string, size: number }[]} freqMap - Word frequency data.
 * @param {string} targetSel - CSS selector of the element to render into.
 */
export function renderWordCloud(freqMap, targetSel) {
  const width = 600, height = 400;

  // Clear any existing SVG
  d3.select(targetSel).html('<svg width="600" height="400"></svg>');

  d3.layout.cloud()
    .size([width, height])
    .words(freqMap)
    .padding(5)
    .rotate(() => ~~(Math.random() * 2) * 90)
    .font("Impact")
    .fontSize(d => 10 + d.size) // Size scaling
    .on("end", draw)
    .start();

  function draw(words) {
    d3.select(`${targetSel} svg`)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`)
      .selectAll("text")
      .data(words)
      .enter().append("text")
      .style("font-size", d => d.size + "px")
      .style("fill", "#69b3a2")
      .attr("text-anchor", "middle")
      .attr("transform", d =>
        `translate(${d.x},${d.y}) rotate(${d.rotate})`
      )
      .text(d => d.text);
  }
}
