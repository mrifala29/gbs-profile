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
const COLORS = ['#FFBD59','#7C5CFC','#00E580','#00D4FF'];

/* ── Data ─────────────────────────────────── */
const DATA = {
  categories : {
    labels : ['Tablet','Handphone/HP','Aksesoris','Laptop'],
    units  : [41,18,17,9],
  },

  // Sebaran lokasi pelanggan (beli + jual) per region — total 281
  regions : {
    labels : ['Jawa Timur','DI Yogyakarta','Jawa Tengah','Jabodetabek','Bali','Sulawesi Tenggara','NTT','Luar Negeri'],
    units  : [234,30,5,4,3,3,1,1],
  },

  // Best seller per kategori
  bestSeller : {
    labels : ['Laptop','Handphone','Handphone','Tablet','Tablet','Mouse / Pen','Smartwatch'],
    products: [
      'HP ProBook 440 G8 i5 Gen 11',
      'iPhone 13 Mini',
      'iPhone 11',
      'iPad 11',
      'iPad Air 5',
      'Apple Pencil Gen 2',
      'Samsung Galaxy Fit 3',
    ],
    units  : [9, 10, 8, 22, 19, 5, 7],
  },
};

/* ── Helpers ──────────────────────────────── */
function mkLinearGradient(ctx, w, h, c1, c2) {
  const g = ctx.createLinearGradient(0, 0, w, 0);
  g.addColorStop(0, c1); g.addColorStop(1, c2); return g;
}
function fmt(n) { return n.toLocaleString('id-ID'); }

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

/* ── 3. Location Horizontal Bar ──────────── */
function initLocationChart() {
  const canvas = document.getElementById('locationChart');
  if (!canvas) return;
  const total = DATA.regions.units.reduce((a,b)=>a+b,0);

  new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels  : DATA.regions.labels,
      datasets: [{
        label           : 'Pelanggan',
        data            : DATA.regions.units,
        backgroundColor : COLORS.map(c => c + '99'),
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
        tooltip: {
          ...TOOLTIP_DEFAULTS,
          callbacks: {
            label: c => {
              const pct = ((c.parsed.x / total) * 100).toFixed(1);
              return `  ${fmt(c.parsed.x)} pelanggan (${pct}%)`;
            }
          }
        },
      },
      scales: {
        x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#999999' } },
        y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#737373', font: { size: 12 } } },
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

/* ── 5. Best Seller (horizontal bar) ─────── */
function initBestSellerChart() {
  const canvas = document.getElementById('originChart');
  if (!canvas) return;

  const labels = DATA.bestSeller.products;
  const cats   = DATA.bestSeller.labels;
  const catColors = {
    'Laptop'    : '#FFBD59',
    'Handphone' : '#7C5CFC',
    'Tablet'    : '#00E580',
    'Mouse / Pen': '#00D4FF',
    'Smartwatch': '#FF6B6B',
  };

  new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels  : labels,
      datasets: [{
        label           : 'Unit Terjual',
        data            : DATA.bestSeller.units,
        backgroundColor : cats.map(c => (catColors[c] || '#FFBD59') + '99'),
        borderColor     : cats.map(c => catColors[c] || '#FFBD59'),
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
        tooltip: {
          ...TOOLTIP_DEFAULTS,
          callbacks: {
            title : items => items[0].label,
            label : c => `  ${DATA.bestSeller.labels[c.dataIndex]} · ${fmt(c.parsed.x)} unit`,
          },
        },
      },
      scales: {
        x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#999999', stepSize: 5 } },
        y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#737373', font: { size: 11 } } },
      },
      animation: { duration: 1000, easing: 'easeOutQuart' },
    },
  });
}

/* ── Init all charts when DOM ready ───────── */
document.addEventListener('DOMContentLoaded', () => {
  initCategoryChart();
  initLocationChart();
  initTopProductsChart();
  initBestSellerChart();
});
