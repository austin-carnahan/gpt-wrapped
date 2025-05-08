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

/** Renders full word cloud like your sample image */
export function renderWordCloud(freqMap, targetSel) {
  const container = document.querySelector("#cloudContainer");
  if (!container) return;

  container.innerHTML = "";

  const width = 500;
  const height = 400;

  const words = Object.entries(freqMap).map(([text, count]) => ({
    text,
    size: 10 + Math.sqrt(count) * 15 // smoother scaling
  }));

  const colors = [
    '#8B0000', '#D2691E', '#FF8C00', '#A0522D',
    '#CD5C5C', '#8B4513', '#B22222', '#DC143C',
    '#E9967A', '#A52A2A' // strong earthy tones like your image
  ];

  const layout = d3.layout.cloud()
    .size([width, height])
    .words(words)
    .padding(2)
    .rotate(() => ~~(Math.random() * 2) * 90) // 0° or 90°
    .font("Impact")
    .fontSize(d => d.size)
    .spiral("archimedean") // natural elliptical layout
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
      .style("font-family", "Impact, sans-serif")
      .style("font-size", d => `${d.size}px`)
      .style("fill", () => colors[Math.floor(Math.random() * colors.length)])
      .attr("text-anchor", "middle")
      .attr("transform", d => `translate(${d.x}, ${d.y}) rotate(${d.rotate})`)
      .text(d => d.text);
  }
} 




