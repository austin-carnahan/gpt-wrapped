/* timeline.js
   -----------
   Builds an hourly usage histogram with Chart.js and tags the user
   with a fun “time‑of‑day” badge (Early Bird, Night Owl, etc.).
*/

import { Chart } from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.9/auto/+esm';
import dayjs      from 'https://cdn.jsdelivr.net/npm/dayjs@1/+esm';

export function renderHourHistogram(messages, targetSel) {
  if (!messages?.length) return;

  /* --- 1. aggregate counts per hour --- */
  const hours = Array(24).fill(0);
  messages.forEach(m => {
    const ts = m.timestamp || m.create_time;
    if (!ts) return;
    const hour = dayjs(ts * 1000 || ts).hour(); // accepts epoch or ISO
    hours[hour] += 1;
  });

  /* --- 2. prep the section / cleanup old chart --- */
  const section = document.querySelector(targetSel);
  if (!section) return;

  section.querySelector('[data-placeholder]')?.remove();

  const oldWrapper = section.querySelector('.timeline-card');
  if (oldWrapper) {
    oldWrapper.__chart?.destroy?.();
    oldWrapper.remove();
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'timeline-card';

  /* badge text */
  const { badge, desc } = usageBadge(hours);
  if (badge) {
    const p1 = document.createElement('p');
    p1.style.marginBottom = '1rem';
    p1.style.fontWeight = '600';
    p1.textContent = badge;
    wrapper.appendChild(p1);

    const p2 = document.createElement('p');
    p2.style.marginTop = '-0.25rem';
    p2.textContent = desc;
    wrapper.appendChild(p2);
  }

  /* --- 3. canvas + chart --- */
  const canvas = document.createElement('canvas');
  canvas.height = 260;
  canvas.style.marginTop = '1.5rem'; 
  wrapper.appendChild(canvas);
  section.appendChild(wrapper);

  const chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: [...Array(24).keys()].map(h => `${h}:00`),
      datasets: [{ data: hours, backgroundColor: 'rgba(99,102,241,0.6)' }]
    },
    options: {
      plugins: { legend: { display: false }, title: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, ticks: { precision: 0 } }
      }
    }
  });

  wrapper.__chart = chart;  // stash for later destroy
}

/* -------------------------------------------
   Derive a simple “usage badge” from hours[]
------------------------------------------- */
function usageBadge(hoursArr) {
  const total = hoursArr.reduce((a, b) => a + b, 0);
  if (!total) return { badge: null, desc: '' };

  const pctBlock = (start, end) =>
    hoursArr.slice(start, end).reduce((a, b) => a + b, 0) / total;

  const earlyPct = pctBlock(5, 10);                             // 05‑09
  const nightPct = (pctBlock(20, 24) + pctBlock(0, 2));         // 20‑01

  // max pct in any 4‑hour window (flatness test)
  const flatMax = Math.max(...[0, 4, 8, 12, 16, 20].map(s => pctBlock(s, s + 4)));

  if (nightPct > 0.4)
    return { badge: 'Night Owl 🌙', desc: 'When others log off, you log ideas.' };
  if (earlyPct > 0.4)
    return { badge: 'Early Bird 🌅', desc: 'You’re keyboard‑ready before the world has coffee.' };
  if (flatMax < 0.25)
    return { badge: 'Always‑On ⚡', desc: 'You squeeze questions into every spare moment.' };

  return {
    badge: 'Office‑Hours Operator 🖥️',
    desc: 'ChatGPT sits on your desk like a cubicle mate.'
  };
}
