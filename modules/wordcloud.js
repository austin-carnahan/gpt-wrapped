// import stopWords from 'https://cdn.jsdelivr.net/npm/stopword/+esm';

export function makeFreqTable(messages) {
  const text = messages.map(msg => msg.content || msg).join(' ');
  const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
  const filteredWords = stopWords.removeStopwords(words);

  const freqMap = {};
  filteredWords.forEach(word => {
    if (!freqMap[word]) freqMap[word] = 0;
    freqMap[word]++;
  });

  return freqMap;
}
// import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
// import cloud from 'https://cdn.jsdelivr.net/npm/d3-cloud/build/d3.layout.cloud.min.js';

export function renderWordCloud(freqMap, targetSel) {
  const words = Object.entries(freqMap).map(([text, size]) => ({ text, size }));

  const width = 500;
  const height = 400;

  d3.select(targetSel).selectAll('*').remove(); // clear previous SVG

  const svg = d3.select(targetSel)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  cloud()
    .size([width, height])
    .words(words)
    .padding(5)
    .rotate(() => ~~(Math.random() * 2) * 90)
    .font('Impact')
    .fontSize(d => 10 + d.size)
    .on('end', draw)
    .start();

  function draw(words) {
    svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`)
      .selectAll('text')
      .data(words)
      .enter()
      .append('text')
      .style('font-family', 'Impact')
      .style('font-size', d => d.size + 'px')
      .style('fill', () => d3.schemeCategory10[Math.floor(Math.random() * 10)])
      .attr('text-anchor', 'middle')
      .attr('transform', d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
      .text(d => d.text);
  }
}
