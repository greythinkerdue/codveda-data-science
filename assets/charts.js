// Shared Chart.js configuration + helpers for the Codveda portfolio site.
const COLOR = {
  pink: '#e0447f',
  gold: '#b8872e',
  green: '#3e9b68',
};

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function themeColors() {
  return {
    text: cssVar('--text-primary'),
    muted: cssVar('--text-muted'),
    grid: cssVar('--gridline'),
    surface: cssVar('--surface-3'),
    border: cssVar('--border-hairline'),
    pointBorder: cssVar('--surface-1'),
  };
}

Chart.defaults.font.family = "'Inter', system-ui, -apple-system, sans-serif";
Chart.defaults.font.size = 12.5;
Chart.defaults.color = themeColors().text;

function baseTooltip() {
  const t = themeColors();
  return {
    backgroundColor: t.surface,
    borderColor: t.border,
    borderWidth: 1,
    titleColor: t.text,
    bodyColor: t.text,
    padding: 10,
    cornerRadius: 8,
    titleFont: { weight: '600' },
    displayColors: true,
    boxPadding: 4,
  };
}

function gridOpts() {
  return {
    color: themeColors().grid,
    drawTicks: false,
  };
}

// Single or grouped vertical bar chart. series: [{label, data, color}]
function renderBarChart(canvasId, labels, series, opts = {}) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  const t = themeColors();
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
  const chart = new Chart(ctx, {
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
          labels: { boxWidth: 8, boxHeight: 8, usePointStyle: true, pointStyle: 'rect', padding: 16, color: t.text },
        },
        tooltip: {
          ...baseTooltip(),
          callbacks: opts.tooltipCallbacks || {},
        },
      },
      scales: {
        x: { grid: { display: false }, border: { color: t.grid }, ticks: { color: t.text } },
        y: {
          beginAtZero: true,
          grid: gridOpts(),
          border: { display: false },
          ticks: { color: t.text, callback: (v) => opts.ySuffix ? v + opts.ySuffix : v },
          max: opts.yMax,
        },
      },
      ...opts.extra,
    },
  });
  registerThemedChart(chart);
  return chart;
}

// Line chart for quartile / trend data. series: [{label, data, color}]
function renderLineChart(canvasId, labels, series, opts = {}) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  const t = themeColors();
  const datasets = series.map(s => ({
    label: s.label,
    data: s.data,
    borderColor: s.color,
    backgroundColor: s.color,
    borderWidth: 2,
    pointRadius: 4,
    pointHoverRadius: 6,
    pointBackgroundColor: s.color,
    pointBorderColor: t.pointBorder,
    pointBorderWidth: 2,
    tension: 0.25,
    fill: false,
  }));
  const chart = new Chart(ctx, {
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
          labels: { boxWidth: 8, boxHeight: 8, usePointStyle: true, pointStyle: 'circle', padding: 16, color: t.text },
        },
        tooltip: { ...baseTooltip(), callbacks: opts.tooltipCallbacks || {} },
      },
      scales: {
        x: { grid: { display: false }, border: { color: t.grid }, ticks: { color: t.text } },
        y: {
          beginAtZero: true,
          grid: gridOpts(),
          border: { display: false },
          ticks: { color: t.text, callback: (v) => opts.ySuffix ? v + opts.ySuffix : v },
        },
      },
    },
  });
  registerThemedChart(chart);
  return chart;
}

// Horizontal bar for feature importance / ranked magnitude.
function renderHBarChart(canvasId, labels, data, opts = {}) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  const t = themeColors();
  const chart = new Chart(ctx, {
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
        x: { beginAtZero: true, grid: gridOpts(), border: { display: false }, ticks: { color: t.text } },
        y: { grid: { display: false }, border: { display: false }, ticks: { color: t.text } },
      },
    },
  });
  registerThemedChart(chart);
  return chart;
}

// Scatter plot (actual vs predicted).
function renderScatterChart(canvasId, points, opts = {}) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  const t = themeColors();
  const max = Math.max(...points.map(p => Math.max(p.x, p.y))) * 1.05;
  const chart = new Chart(ctx, {
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
          labels: { boxWidth: 8, boxHeight: 8, usePointStyle: true, padding: 16, color: t.text },
        },
        tooltip: { ...baseTooltip(), callbacks: opts.tooltipCallbacks || {} },
      },
      scales: {
        x: { title: { display: true, text: 'Actual MEDV ($000s)', color: t.muted }, grid: gridOpts(), border: { display: false }, ticks: { color: t.text } },
        y: { title: { display: true, text: 'Predicted MEDV ($000s)', color: t.muted }, grid: gridOpts(), border: { display: false }, ticks: { color: t.text } },
      },
    },
  });
  registerThemedChart(chart);
  return chart;
}

function fmtPct(v) { return v.toFixed(1) + '%'; }

// --- Live theme updates for already-rendered charts ---
const __themedCharts = [];
function registerThemedChart(chart) {
  __themedCharts.push(chart);
}
function restyleChartsForTheme() {
  const t = themeColors();
  Chart.defaults.color = t.text;
  __themedCharts.forEach(chart => {
    const opts = chart.options;
    if (opts.plugins && opts.plugins.legend && opts.plugins.legend.labels) {
      opts.plugins.legend.labels.color = t.text;
    }
    if (opts.plugins && opts.plugins.tooltip) {
      Object.assign(opts.plugins.tooltip, baseTooltip(), { callbacks: opts.plugins.tooltip.callbacks });
    }
    ['x', 'y'].forEach(axis => {
      const scale = opts.scales && opts.scales[axis];
      if (!scale) return;
      if (scale.ticks) scale.ticks.color = t.text;
      if (scale.grid) scale.grid.color = t.grid;
      if (scale.border && scale.border.color) scale.border.color = t.grid;
      if (scale.title) scale.title.color = t.muted;
    });
    chart.update();
  });
}
document.addEventListener('codveda:themechange', restyleChartsForTheme);
