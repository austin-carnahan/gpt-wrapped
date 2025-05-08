// import stopWords from 'https://cdn.jsdelivr.net/npm/stopword/+esm';
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

  const filtered = removeStopwords(words)
    .filter(w =>
      w.length > 2 &&    // skip tiny tokens
      !/\d/.test(w)      // skip anything with a digit (UUID chunks, years)
    );

  filtered.forEach(word => {
    freqMap[word] = (freqMap[word] || 0) + 1;
  });

  return freqMap;
}

/** Renders full word cloud and top 5 word table */
export function renderWordCloud(freqMap, targetSel) {
  // 1. locate the <section> via targetSel
  const section = document.querySelector(targetSel);
  if (!section) return;

  // 2. remove the placeholder
  section.querySelector('[data-placeholder]')?.remove();

  // 3. find or create a container div inside the section
  let container = section.querySelector('.wordcloud-box');
  if (!container) {
    container = document.createElement('div');
    container.className = 'wordcloud-box';
    section.appendChild(container);
  }
  container.innerHTML = ''; // clear previous SVGs

  const width = 500;
  const height = 400;

  const words = Object.entries(freqMap).map(([text, count]) => ({
    text,
    size: 10 + Math.sqrt(count) * 15 // smoother scaling
  }));

  const colors = [
    '#8B0000', '#D2691E', '#FF8C00', '#A0522D',
    '#CD5C5C', '#8B4513', '#B22222', '#DC143C',
    '#E9967A', '#A52A2A'
  ];

  const layout = d3.layout.cloud()
    .size([width, height])
    .words(words)
    .padding(2)
    .rotate(() => ~~(Math.random() * 2) * 90)
    .font("Impact")
    .fontSize(d => d.size)
    .spiral("archimedean")
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

  // 4. Render Top 5 Words Table
  const top5 = Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const tableHTML = `
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Word</th>
          <th>Frequency</th>
        </tr>
      </thead>
      <tbody>
        ${top5.map(([word, count], i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${word}</td>
            <td>${count}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  const tableContainer = document.getElementById('topWordsTable');
  if (tableContainer) {
    tableContainer.innerHTML = tableHTML;
    const placeholder = tableContainer.previousElementSibling;
    if (placeholder?.classList.contains('placeholder')) {
      placeholder.remove();
    }
  }
}
