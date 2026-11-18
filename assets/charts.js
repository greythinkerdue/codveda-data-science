// Shared Chart.js configuration + helpers for the Codveda portfolio site.
const COLOR = {
  pink: '#e0447f',
  gold: '#b8872e',
  green: '#3e9b68',
  textSecondary: '#a9b0ae',
  textMuted: '#6e7570',
  grid: '#262b31',
};

Chart.defaults.font.family = "'Inter', system-ui, -apple-system, sans-serif";
Chart.defaults.font.size = 12.5;
Chart.defaults.color = COLOR.textSecondary;

function baseTooltip() {
  return {
    backgroundColor: '#232833',
    borderColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    titleColor: '#f5f7f6',
    bodyColor: '#a9b0ae',
    padding: 10,
    cornerRadius: 8,
    titleFont: { weight: '600' },
    displayColors: true,
    boxPadding: 4,
  };
}

function gridOpts() {
  return {
    color: COLOR.grid,
    drawTicks: false,
  };
}

// Single or grouped vertical bar chart. series: [{label, data, color}]
function renderBarChart(canvasId, labels, series, opts = {}) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  const datasets = series.map(s => ({
    label: s.label,
    data: s.data,
    backgroundColor: s.color,
    borderRadius: 4,
    borderSkipped: false,
    maxBarThickness: series.length > 1 ? 26 : 38,
    categoryPercentage: 0.7,
    barPercentage: 0.85,
  }));
  return new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: series.length > 1,
          position: 'top',
          align: 'start',
          labels: { boxWidth: 8, boxHeight: 8, usePointStyle: true, pointStyle: 'rect', padding: 16 },
        },
        tooltip: {
          ...baseTooltip(),
          callbacks: opts.tooltipCallbacks || {},
        },
      },
      scales: {
        x: { grid: { display: false }, border: { color: COLOR.grid } },
        y: {
          beginAtZero: true,
          grid: gridOpts(),
          border: { display: false },
          ticks: { callback: (v) => opts.ySuffix ? v + opts.ySuffix : v },
          max: opts.yMax,
        },
      },
      ...opts.extra,
    },
  });
}

// Line chart for quartile / trend data. series: [{label, data, color}]
function renderLineChart(canvasId, labels, series, opts = {}) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  const datasets = series.map(s => ({
    label: s.label,
    data: s.data,
    borderColor: s.color,
    backgroundColor: s.color,
    borderWidth: 2,
    pointRadius: 4,
    pointHoverRadius: 6,
    pointBackgroundColor: s.color,
    pointBorderColor: '#14171c',
    pointBorderWidth: 2,
    tension: 0.25,
    fill: false,
  }));
  return new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: series.length > 1,
          position: 'top',
          align: 'start',
          labels: { boxWidth: 8, boxHeight: 8, usePointStyle: true, pointStyle: 'circle', padding: 16 },
        },
        tooltip: { ...baseTooltip(), callbacks: opts.tooltipCallbacks || {} },
      },
      scales: {
        x: { grid: { display: false }, border: { color: COLOR.grid } },
        y: {
          beginAtZero: true,
          grid: gridOpts(),
          border: { display: false },
          ticks: { callback: (v) => opts.ySuffix ? v + opts.ySuffix : v },
        },
      },
    },
  });
}

// Horizontal bar for feature importance / ranked magnitude.
function renderHBarChart(canvasId, labels, data, opts = {}) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: opts.colors || COLOR.green,
        borderRadius: 4,
        borderSkipped: false,
        maxBarThickness: 18,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { ...baseTooltip(), callbacks: opts.tooltipCallbacks || {} },
      },
      scales: {
        x: { beginAtZero: true, grid: gridOpts(), border: { display: false } },
        y: { grid: { display: false }, border: { display: false } },
      },
    },
  });
}

// Scatter plot (actual vs predicted).
function renderScatterChart(canvasId, points, opts = {}) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  const max = Math.max(...points.map(p => Math.max(p.x, p.y))) * 1.05;
  return new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Test samples',
          data: points,
          backgroundColor: 'rgba(62, 155, 104, 0.55)',
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: 'Perfect prediction',
          type: 'line',
          data: [{ x: 0, y: 0 }, { x: max, y: max }],
          borderColor: 'rgba(224, 68, 127, 0.55)',
          borderWidth: 2,
          borderDash: [5, 4],
          pointRadius: 0,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true, position: 'top', align: 'start',
          labels: { boxWidth: 8, boxHeight: 8, usePointStyle: true, padding: 16 },
        },
        tooltip: { ...baseTooltip(), callbacks: opts.tooltipCallbacks || {} },
      },
      scales: {
        x: { title: { display: true, text: 'Actual MEDV ($000s)', color: COLOR.textMuted }, grid: gridOpts(), border: { display: false } },
        y: { title: { display: true, text: 'Predicted MEDV ($000s)', color: COLOR.textMuted }, grid: gridOpts(), border: { display: false } },
      },
    },
  });
}

function fmtPct(v) { return v.toFixed(1) + '%'; }
