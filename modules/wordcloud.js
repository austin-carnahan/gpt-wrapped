/* Builds the word‑frequency table and renders a d3‑cloud word cloud */

//import stopWords from 'https://cdn.jsdelivr.net/npm/stopword/+esm';
// wordcloud.js
// import d3Cloud from the appropriate CDN URL

// /** helper → { word: count }  */
// export function makeFreqTable(messages) {
//   // TODO: tokenise, drop stop‑words, build counts
//   return {};
// }

// /** draws the cloud inside the element matched by targetSel */
// export function renderWordCloud(freqMap, targetSel) {
//   // TODO: use d3‑cloud, draw onto <canvas> or SVG
// }

// wordcloud.js

//import stopWords from 'https://cdn.jsdelivr.net/npm/stopword/+esm';
import { removeStopwords } from 'https://cdn.jsdelivr.net/npm/stopword/+esm';

/** Builds frequency map: { word: count } */
export function makeFreqTable(messages) {
  const freqMap = {};

  const words = messages
    .map(msg => msg.message)
    .join(' ')
    .toLowerCase()
    .match(/\b\w+\b/g);

  if (!words) return freqMap;

  const filtered = removeStopwords(words);

  filtered.forEach(word => {
    freqMap[word] = (freqMap[word] || 0) + 1;
  });

  return freqMap;
}

/** Render randomized word cloud with 100+ words */
export function renderWordCloud(freqMap, targetSel) {
  const container = document.querySelector("#cloudContainer");
  if (!container) return;

  container.innerHTML = "";

  const width = 500;
  const height = 300;

  // Get top 100 words
  const words = Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 100)
    .map(([text, count]) => ({
      text,
      size: 12 + Math.sqrt(count) * 8
    }));

  // Your curated color palette
  const colors = [
    '#19747E', '#D1E8E2', '#A9D6E5', '#E2E2E2',
    '#FF9F1C', '#CB997E', '#FFE8D6',
    '#023E8A', '#0077B6', '#CAF0F8'
  ];

  const layout = d3.layout.cloud()
    .size([width, height])
    .words(words)
    .padding(5)
    .rotate(() => (Math.random() > 0.1 ? 0 : 90)) // Random 0° or 90°
    .font("Segoe UI")
    .fontSize(d => d.size)
    .on("end", draw);

  layout.start();

  function draw(words) {
    d3.select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`)
      .selectAll("text")
      .data(words)
      .enter().append("text")
      .style("font-family", "Segoe UI, sans-serif")
      .style("font-size", d => `${d.size}px`)
      .style("fill", () => colors[Math.floor(Math.random() * colors.length)])
      .attr("text-anchor", "middle")
      .attr("transform", d => `translate(${d.x}, ${d.y}) rotate(${d.rotate})`)
      .text(d => d.text);
  }
}

