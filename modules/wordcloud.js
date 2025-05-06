/* Builds the word‑frequency table and renders a d3‑cloud word cloud */

import stopWords from 'https://cdn.jsdelivr.net/npm/stopword/+esm';
// wordcloud.js
import cloud from 'https://esm.sh/d3-cloud@1';

/** helper → { word: count }  */
export function makeFreqTable(messages) {
  // TODO: tokenise, drop stop‑words, build counts
  return {};
}

/** draws the cloud inside the element matched by `targetSel` */
export function renderWordCloud(freqMap, targetSel) {
  // TODO: use d3‑cloud, draw onto <canvas> or SVG
}