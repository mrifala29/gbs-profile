/* ============================================
   GBS — Gadget Bekas Sidoarjo
   Sales Report Charts (Chart.js)
   ============================================ */

'use strict';

/* ── Global Chart.js defaults ─────────────── */
Chart.defaults.color          = '#737373';
Chart.defaults.borderColor    = 'rgba(0,0,0,0.08)';
Chart.defaults.font.family    = "'Inter', sans-serif";
Chart.defaults.font.size      = 12;
Chart.defaults.plugins.legend.labels.padding = 16;

const TOOLTIP_DEFAULTS = {
  backgroundColor : 'rgba(255, 255, 255, 0.96)',
  borderColor     : 'rgba(255, 189, 89, 0.35)',
  borderWidth     : 1,
  padding         : 13,
  titleColor      : '#000000',
  bodyColor       : '#737373',
  titleFont       : { family: "'Space Grotesk', sans-serif", weight: '700', size: 13 },
  bodyFont        : { family: "'Inter', sans-serif", size: 12 },
  cornerRadius    : 10,
  displayColors   : true,
  boxPadding      : 4,
};

/* ── Colour Palette ───────────────────────── */
const COLORS = ['#FFBD59','#FFAD31','#27AE60','#E67E22','#E74C3C','#3498DB','#9B59B6'];

/* ── Data ─────────────────────────────────── */
const DATA = {
  months  : ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'],
  units   : [45,52,78,91,68,72,83,89,76,94,106,93],
  revenue : [145,168,245,292,219,228,267,285,241,301,338,295], // juta rupiah

  categories : {
    labels : ['Smartphone/HP','Laptop','Tablet','Monitor','Smartwatch','Keyboard','Mouse'],
    units  : [312,248,98,72,58,33,26],
  },

  locations : {
    labels : ['Sidoarjo','Surabaya','Gresik','Mojokerto','Malang','Pasuruan','Bangkalan','Lainnya'],
    units  : [385,198,87,65,43,38,20,11],
  },

  sellerOrigin : {
    labels : ['Sidoarjo','Surabaya','Gresik','Mojokerto'],
    units  : [520,234,56,37],
  },
};

/* ── Helpers ──────────────────────────────── */
function mkLinearGradient(ctx, w, h, c1, c2) {
  const g = ctx.createLinearGradient(0, 0, w, 0);
  g.addColorStop(0, c1); g.addColorStop(1, c2); return g;
}
function mkVertGradient(ctx, h, c1, c2) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, c1); g.addColorStop(1, c2); return g;
}
function fmt(n)  { return n.toLocaleString('id-ID'); }
function fmtRp(n){ return 'Rp ' + fmt(n) + ' jt'; }

/* ── 1. Monthly Trend (line) ──────────────── */
function initMonthlyChart() {
  const canvas = document.getElementById('monthlyChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const gradUnits   = mkVertGradient(ctx, 260, 'rgba(255,189,89,0.35)', 'rgba(255,189,89,0)');
  const gradRevenue = mkVertGradient(ctx, 260, 'rgba(255,173,49,0.28)',   'rgba(255,173,49,0)');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: DATA.months,
      datasets: [
        {
          label           : 'Unit Terjual',
          data            : DATA.units,
          yAxisID         : 'yUnits',
          borderColor     : '#FFBD59',
          backgroundColor : gradUnits,
          borderWidth     : 2.5,
          pointBackgroundColor : '#FFBD59',
          pointBorderColor    : '#FFFFFF',
          pointBorderWidth    : 2,
          pointRadius     : 4,
          pointHoverRadius: 7,
          fill            : true,
          tension         : 0.42,
        },
        {
          label           : 'Pendapatan',
          data            : DATA.revenue,
          yAxisID         : 'yRevenue',
          borderColor     : '#FFAD31',
          backgroundColor : gradRevenue,
          borderWidth     : 2.5,
          pointBackgroundColor : '#FFAD31',
          pointBorderColor    : '#FFFFFF',
          pointBorderWidth    : 2,
          pointRadius     : 4,
          pointHoverRadius: 7,
          fill            : true,
          tension         : 0.42,
        },
      ],
    },
    options: {
      responsive    : true,
      maintainAspectRatio: false,
      interaction   : { mode: 'index', intersect: false },
      plugins: {
        legend : {
          position : 'top',
          align    : 'end',
          labels   : { usePointStyle: true, pointStyle: 'circle', boxWidth: 10, boxHeight: 10, color: '#999999' },
        },
        tooltip: {
          ...TOOLTIP_DEFAULTS,
          callbacks: {
            label: ctx => ctx.datasetIndex === 0
              ? `  ${fmt(ctx.parsed.y)} unit`
              : `  ${fmtRp(ctx.parsed.y)}`,
          },
        },
      },
      scales: {
        x      : { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#999999' } },
        yUnits : { position: 'left',  grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#999999', callback: v => v+' unit' } },
        yRevenue: { position: 'right', grid: { drawOnChartArea: false }, ticks: { color: '#999999', callback: v => 'Rp'+v+'jt' } },
      },
      animation: { duration: 1200, easing: 'easeOutQuart' },
    },
  });
}

/* ── 2. Category Doughnut ─────────────────── */
function initCategoryChart() {
  const canvas = document.getElementById('categoryChart');
  if (!canvas) return;

  new Chart(canvas.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels  : DATA.categories.labels,
      datasets: [{
        data           : DATA.categories.units,
        backgroundColor: COLORS.map(c => c + 'BB'),
        borderColor    : COLORS,
        borderWidth    : 2,
        hoverOffset    : 10,
      }],
    },
    options: {
      responsive           : true,
      maintainAspectRatio  : false,
      cutout               : '72%',
      plugins: {
        legend : { display: false },
        tooltip: {
          ...TOOLTIP_DEFAULTS,
          callbacks: {
            label: ctx => {
              const total = ctx.dataset.data.reduce((a,b)=>a+b,0);
              const pct   = ((ctx.parsed / total) * 100).toFixed(1);
              return `  ${fmt(ctx.parsed)} unit  (${pct}%)`;
            },
          },
        },
      },
      animation: { animateRotate: true, duration: 1200, easing: 'easeOutQuart' },
    },
  });

  // Build legend
  const legend = document.getElementById('categoryLegend');
  if (!legend) return;
  const total = DATA.categories.units.reduce((a,b)=>a+b,0);
  legend.innerHTML = DATA.categories.labels.map((label, i) => {
    const pct = ((DATA.categories.units[i] / total) * 100).toFixed(1);
    return `
      <div class="legend-row">
        <span class="legend-left">
          <span class="legend-dot" style="background:${COLORS[i]}"></span>
          ${label}
        </span>
        <span class="legend-val" style="color:${COLORS[i]}">${fmt(DATA.categories.units[i])} <span style="color:#999999;font-weight:400">(${pct}%)</span></span>
      </div>`;
  }).join('');
}

/* ── 3. Location Bar Chart ────────────────── */
function initLocationChart() {
  const canvas = document.getElementById('locationChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const grad = mkLinearGradient(ctx, canvas.offsetWidth || 400, 0, '#FFBD59', '#FFAD31');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels  : DATA.locations.labels,
      datasets: [{
        label           : 'Unit Terjual',
        data            : DATA.locations.units,
        backgroundColor : DATA.locations.units.map((_, i) => i === 0 ? grad : 'rgba(255,189,89,0.42)'),
        borderColor     : DATA.locations.units.map((_, i) => i === 0 ? '#FFAD31' : '#FFBD59'),
        borderWidth     : 1,
        borderRadius    : 7,
        borderSkipped   : false,
      }],
    },
    options: {
      responsive  : true,
      maintainAspectRatio: false,
      plugins: {
        legend : { display: false },
        tooltip: { ...TOOLTIP_DEFAULTS, callbacks: { label: c => `  ${fmt(c.parsed.y)} unit` } },
      },
      scales: {
        x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#999999' } },
        y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#999999', stepSize: 50 } },
      },
      animation: { duration: 1000, easing: 'easeOutQuart' },
    },
  });
}

/* ── 4. Top Products (horizontal bar) ────── */
function initTopProductsChart() {
  const canvas = document.getElementById('topProductsChart');
  if (!canvas) return;

  new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels  : DATA.categories.labels,
      datasets: [{
        label           : 'Unit Terjual',
        data            : DATA.categories.units,
        backgroundColor : COLORS.map(c => c + '77'),
        borderColor     : COLORS,
        borderWidth     : 1.5,
        borderRadius    : 7,
        borderSkipped   : false,
      }],
    },
    options: {
      indexAxis   : 'y',
      responsive  : true,
      maintainAspectRatio: false,
      plugins: {
        legend : { display: false },
        tooltip: { ...TOOLTIP_DEFAULTS, callbacks: { label: c => `  ${fmt(c.parsed.x)} unit` } },
      },
      scales: {
        x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#999999' } },
        y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#737373', font: { size: 12 } } },
      },
      animation: { duration: 1000, easing: 'easeOutQuart' },
    },
  });
}

/* ── 5. Seller Origin (pie) ───────────────── */
function initOriginChart() {
  const canvas = document.getElementById('originChart');
  if (!canvas) return;

  const total  = DATA.sellerOrigin.units.reduce((a,b)=>a+b,0);
  const pcts   = DATA.sellerOrigin.units.map(v => ((v/total)*100).toFixed(1));

  new Chart(canvas.getContext('2d'), {
    type: 'pie',
    data: {
      labels  : DATA.sellerOrigin.labels,
      datasets: [{
        data           : DATA.sellerOrigin.units,
        backgroundColor: [
          'rgba(255,189,89,0.75)',
          'rgba(255,173,49,0.6)',
          'rgba(39,174,96,0.6)',
          'rgba(230,126,34,0.6)',
        ],
        borderColor: ['#FFBD59','#FFAD31','#27AE60','#E67E22'],
        borderWidth: 2,
        hoverOffset: 8,
      }],
    },
    options: {
      responsive : true,
      maintainAspectRatio: false,
      plugins: {
        legend : {
          position : 'bottom',
          labels   : { usePointStyle: true, pointStyle: 'circle', padding: 14, color: '#737373', font: { size: 11 } },
        },
        tooltip: {
          ...TOOLTIP_DEFAULTS,
          callbacks: {
            label: ctx => {
              const p = ((ctx.parsed / total)*100).toFixed(1);
              return `  ${fmt(ctx.parsed)} unit  (${p}%)`;
            },
          },
        },
      },
      animation: { animateRotate: true, duration: 1200, easing: 'easeOutQuart' },
    },
  });
}

/* ── Monthly Summary Table data ───────────── */
(function buildMonthlyTable() {
  const tbody = document.getElementById('monthlyTbody');
  if (!tbody) return;

  const monthNames = [
    'Januari','Februari','Maret','April','Mei','Juni',
    'Juli','Agustus','September','Oktober','November','Desember',
  ];

  let html = '';
  DATA.months.forEach((_, i) => {
    const units   = DATA.units[i];
    const rev     = DATA.revenue[i];
    const avg     = Math.round((rev * 1_000_000) / units);
    const prevU   = i > 0 ? DATA.units[i-1] : null;
    const growth  = prevU ? (((units - prevU) / prevU) * 100).toFixed(1) : '—';
    const growthColor = parseFloat(growth) >= 0 ? 'var(--success)' : 'var(--error)';
    const growthSign  = parseFloat(growth) > 0 ? '+' : '';
    const maxPcs  = Math.max(...DATA.units);
    const pct     = Math.round((units / maxPcs) * 100);

    html += `
      <tr>
        <td><span class="rank-badge ${i < 3 ? 'rank-'+(i+1) : 'rank-other'}">${i+1}</span></td>
        <td class="font-bold">${monthNames[i]}</td>
        <td>${fmt(units)}</td>
        <td class="font-bold">Rp ${fmt(rev)} jt</td>
        <td>Rp ${fmt(avg)}</td>
        <td>
          <div class="progress-wrap">
            <div class="progress-bg"><div class="progress-fill" data-width="${pct}" style="width:0%"></div></div>
          </div>
        </td>
        <td style="color:${prevU ? growthColor : 'var(--text-muted)'}">${prevU ? growthSign+growth+'%' : '—'}</td>
      </tr>`;
  });

  // Totals row
  const totalUnits = DATA.units.reduce((a,b)=>a+b,0);
  const totalRev   = DATA.revenue.reduce((a,b)=>a+b,0);
  const avgUnit    = Math.round((totalRev * 1_000_000) / totalUnits);

  html += `
    <tr style="border-top:1px solid rgba(124,92,252,0.25);background:rgba(124,92,252,0.04)">
      <td>—</td>
      <td class="font-bold" style="color:var(--accent-cyan)">TOTAL 2025</td>
      <td class="font-bold" style="color:var(--text-primary)">${fmt(totalUnits)}</td>
      <td class="font-bold" style="color:var(--accent-cyan)">Rp ${fmt(totalRev)} jt</td>
      <td>Rp ${fmt(avgUnit)}</td>
      <td>—</td>
      <td>—</td>
    </tr>`;

  tbody.innerHTML = html;
  // Animate newly-injected progress bars
  if (typeof window.GBS_initProgressBars === 'function') window.GBS_initProgressBars();
})();

/* ── Init all charts when DOM ready ───────── */
document.addEventListener('DOMContentLoaded', () => {
  initCategoryChart();
  initLocationChart();
  initTopProductsChart();
  initOriginChart();
});
