// wordcloud.js
// Builds the word-frequency table and renders a d3-cloud word cloud

import { removeStopwords } from 'https://cdn.jsdelivr.net/npm/stopword/+esm';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import cloud from 'https://cdn.jsdelivr.net/npm/d3-cloud/build/d3.layout.cloud.min.js';

/** helper → { word: count } */
export function makeFreqTable(messages) {
  const text = messages.map(m => m.message || '').join(' ').toLowerCase();
  const words = text.match(/\b[a-z]{3,}\b/g) || [];  // filter: 3+ letter words only
  const filtered = removeStopwords(words);

  const freqMap = {};
  for (const word of filtered) {
    freqMap[word] = (freqMap[word] || 0) + 1;
  }
  return freqMap;
}

/** draws the cloud inside the element matched by targetSel */
export function renderWordCloud(freqMap, targetSel) {
  const width = 800;
  const height = 400;

  const data = Object.entries(freqMap).map(([word, count]) => ({
    text: word,
    size: 10 + Math.sqrt(count) * 8 // scale size up with frequency
  }));

  // clear previous cloud
  d3.select(targetSel).html('');

  cloud()
    .size([width, height])
    .words(data)
    .padding(5)
    .rotate(() => (Math.random() > 0.5 ? 90 : 0))
    .fontSize(d => d.size)
    .on('end', draw)
    .start();

  function draw(words) {
    d3.select(targetSel)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`)
      .selectAll('text')
      .data(words)
      .enter()
      .append('text')
      .style('font-size', d => `${d.size}px`)
      .style('fill', () => d3.schemeCategory10[Math.floor(Math.random() * 10)])
      .attr('text-anchor', 'middle')
      .attr('transform', d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
      .text(d => d.text);
  }
}
