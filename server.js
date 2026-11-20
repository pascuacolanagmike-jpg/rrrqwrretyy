// ============================================================
//  RICE MILLER REGISTRY — Green Marketplace UI Edition
//  + Non-palay image detection
//  Run: node server.js  →  http://localhost:3000
// ============================================================

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const ESP32_STREAM_URL = process.env.ESP32_STREAM_URL || 'http://192.168.50.87/stream';

app.use(express.json({ limit: '25mb' }));

const ROBOFLOW_URL = 'https://serverless.roboflow.com/rice-grain-quality/1';
const ROBOFLOW_KEY = process.env.ROBOFLOW_KEY || 'tytdJy91mpGDBEiW4mTi';

const MILLERS = [
  { name: 'San Pedro Rice Mill',     type: 'large', lat: 14.5995, lng: 120.9842, address: 'San Pedro, Laguna',   contact: '0917-111-1111', priceDry: 22.50, nfa: true  },
  { name: 'Great Harvest Rice Mill', type: 'large', lat: 14.6120, lng: 121.0100, address: 'Muntinlupa City',    contact: '0918-222-2222', priceDry: 21.00, nfa: true  },
  { name: 'Golden Grain Miller',     type: 'large', lat: 14.5500, lng: 121.0500, address: 'Taguig City',        contact: '0919-333-3333', priceDry: 20.50, nfa: false },
  { name: 'Bayanihan Rice Mill',     type: 'large', lat: 14.6500, lng: 120.9500, address: 'Paranaque City',     contact: '0920-444-4444', priceDry: 23.00, nfa: true  },
  { name: 'Sunrise Agri Miller',     type: 'large', lat: 14.7000, lng: 121.1000, address: 'Marikina City',      contact: '0921-555-5555', priceDry: 19.50, nfa: false },
  { name: 'Harvest King Miller',     type: 'large', lat: 14.7500, lng: 120.9800, address: 'Valenzuela City',    contact: '0923-777-7777', priceDry: 21.50, nfa: true  },
  { name: 'Green Field Rice Mill',   type: 'small', lat: 14.4800, lng: 120.9000, address: 'Bacoor, Cavite',     contact: '0922-666-6666', priceDry: 20.00, nfa: false },
  { name: 'Pagsasaka Rice Mill',     type: 'small', lat: 14.5200, lng: 121.0000, address: 'Pateros',            contact: '0924-888-8888', priceDry: 19.00, nfa: false },
  { name: 'Barangay Milling Co.',    type: 'small', lat: 14.5800, lng: 120.9200, address: 'Las Piñas City',     contact: '0925-999-9999', priceDry: 20.50, nfa: false },
  { name: 'Local Farmers Mill',      type: 'small', lat: 14.6300, lng: 121.0300, address: 'Pasig City',         contact: '0926-000-0000', priceDry: 18.50, nfa: false },
  { name: 'Coop Rice Miller',        type: 'small', lat: 14.6700, lng: 120.9900, address: 'Caloocan City',      contact: '0927-121-2121', priceDry: 21.00, nfa: true, acceptsWet: true },
  { name: 'Cabanatuan Central Mill', type: 'large', lat: 15.4869, lng: 120.9679, address: 'Cabanatuan, Nueva Ecija', contact: '0918-301-1001', priceDry: 23.20, nfa: true  },
  { name: 'Muñoz Grain Traders',     type: 'large', lat: 15.7142, lng: 120.9036, address: 'Science City of Muñoz',   contact: '0918-301-1002', priceDry: 22.80, nfa: true  },
  { name: 'San Jose Rice Center',    type: 'small', lat: 15.7939, lng: 120.9881, address: 'San Jose, Nueva Ecija',   contact: '0918-301-1003', priceDry: 22.00, nfa: true  },
  { name: 'Ilagan Rice Mill',        type: 'large', lat: 17.1485, lng: 121.8892, address: 'Ilagan, Isabela',    contact: '0918-302-2001', priceDry: 22.40, nfa: true  },
  { name: 'Santiago Grain Mill',     type: 'large', lat: 16.6912, lng: 121.5534, address: 'Santiago, Isabela',  contact: '0918-302-2002', priceDry: 21.80, nfa: true  },
  { name: 'Cauayan Agri Miller',     type: 'small', lat: 16.9333, lng: 121.7833, address: 'Cauayan, Isabela',   contact: '0918-302-2003', priceDry: 20.50, nfa: false },
  { name: 'Tuguegarao Rice Mill',    type: 'large', lat: 17.6132, lng: 121.7270, address: 'Tuguegarao, Cagayan', contact: '0918-303-3001', priceDry: 22.10, nfa: true  },
  { name: 'Urdaneta Grain Co.',      type: 'large', lat: 15.9761, lng: 120.5711, address: 'Urdaneta, Pangasinan', contact: '0918-304-4001', priceDry: 22.30, nfa: true  },
  { name: 'Dagupan Rice Mill',       type: 'small', lat: 16.0433, lng: 120.3333, address: 'Dagupan, Pangasinan',  contact: '0918-304-4002', priceDry: 20.80, nfa: false },
  { name: 'San Carlos Miller',       type: 'small', lat: 15.9278, lng: 120.3486, address: 'San Carlos, Pangasinan', contact: '0918-304-4003', priceDry: 21.20, nfa: true  },
  { name: 'Malolos Rice Center',     type: 'large', lat: 14.8443, lng: 120.8115, address: 'Malolos, Bulacan',    contact: '0918-305-5001', priceDry: 21.90, nfa: true  },
  { name: 'Baliuag Grain Mill',      type: 'small', lat: 14.9547, lng: 120.8968, address: 'Baliuag, Bulacan',    contact: '0918-305-5002', priceDry: 20.30, nfa: false },
  { name: 'San Fernando Rice Mill',  type: 'large', lat: 15.0286, lng: 120.6897, address: 'San Fernando, Pampanga', contact: '0918-305-5003', priceDry: 21.60, nfa: true  },
  { name: 'Guagua Miller Co.',       type: 'small', lat: 14.9667, lng: 120.6333, address: 'Guagua, Pampanga',    contact: '0918-305-5004', priceDry: 20.10, nfa: false },
  { name: 'Iloilo Rice Mill',        type: 'large', lat: 10.7202, lng: 122.5621, address: 'Iloilo City',        contact: '0918-306-6001', priceDry: 22.60, nfa: true  },
  { name: 'Passi Grain Miller',      type: 'small', lat: 11.1074, lng: 122.6408, address: 'Passi, Iloilo',       contact: '0918-306-6002', priceDry: 21.00, nfa: true  },
  { name: 'Bacolod Rice Mill',       type: 'large', lat: 10.6765, lng: 122.9509, address: 'Bacolod City',       contact: '0918-307-7001', priceDry: 22.00, nfa: true  },
  { name: 'Victorias Grain Co.',     type: 'small', lat: 10.9000, lng: 123.0667, address: 'Victorias, Negros Occ.', contact: '0918-307-7002', priceDry: 20.50, nfa: false },
  { name: 'Tacloban Rice Mill',      type: 'large', lat: 11.2404, lng: 125.0036, address: 'Tacloban City',      contact: '0918-308-8001', priceDry: 21.80, nfa: true  },
  { name: 'Ormoc Miller Co.',        type: 'small', lat: 11.0064, lng: 124.6075, address: 'Ormoc City',         contact: '0918-308-8002', priceDry: 20.40, nfa: false },
  { name: 'Cebu Rice Center',        type: 'large', lat: 10.3157, lng: 123.8854, address: 'Cebu City',          contact: '0918-309-9001', priceDry: 21.50, nfa: true  },
  { name: 'Davao Grain Mill',        type: 'large', lat: 7.1907,  lng: 125.4553, address: 'Davao City',         contact: '0918-310-0001', priceDry: 22.20, nfa: true  },
  { name: 'Kidapawan Rice Mill',     type: 'large', lat: 7.0083,  lng: 125.0894, address: 'Kidapawan City',     contact: '0918-311-1001', priceDry: 22.50, nfa: true  },
  { name: 'Midsayap Grain Traders',  type: 'small', lat: 7.1833,  lng: 124.5333, address: 'Midsayap, Cotabato', contact: '0918-311-1002', priceDry: 20.80, nfa: false },
  { name: 'Butuan Rice Mill',        type: 'small', lat: 8.9475,  lng: 125.5406, address: 'Butuan City',        contact: '0918-312-2001', priceDry: 20.60, nfa: false }
];
MILLERS.forEach((m) => { if (m.acceptsWet === undefined) m.acceptsWet = (m.type === 'large'); });

// ------------------------------------------------------------
//  ROBOFLOW PROXY
// ------------------------------------------------------------
app.post('/api/analyze', async (req, res) => {
  const { image } = req.body || {};
  if (!image || typeof image !== 'string') {
    return res.status(400).json({ error: 'No image provided' });
  }
  const base64 = image.replace(/^data:image\/[a-zA-Z0-9]+;base64,/, '');

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    const response = await fetch(ROBOFLOW_URL, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + ROBOFLOW_KEY,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: base64,
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      return res.status(response.status).json({ error: 'Roboflow error (' + response.status + ')', detail: text.slice(0, 400) });
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Analyze error:', err.message);
    res.status(500).json({ error: err.message || 'Analysis failed' });
  }
});

// ------------------------------------------------------------
//  HTML PAGE — Green Marketplace UI
// ------------------------------------------------------------
const HTML_PAGE = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<title>Rice Marketplace</title>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

<style>
  :root {
    --primary:       #2d6a4f;
    --primary-dark:  #1b4332;
    --primary-light: #d8f3dc;
    --primary-hover: #245a43;

    --bg:         #f5faf6;
    --surface:    #ffffff;
    --surface-2:  #eef7f0;
    --border:     #e0ece3;
    --border-strong: #c8dccf;
    --text:       #14291d;
    --text-muted: #5b7168;
    --text-faint: #8da398;

    --warning:      #d97706;
    --warning-soft: #fef3c7;
    --danger:       #dc2626;
    --danger-soft:  #fee2e2;

    --radius:    20px;
    --radius-sm: 14px;

    --shadow-sm: 0 1px 2px rgba(20,41,29,0.05);
    --shadow:    0 2px 8px rgba(20,41,29,0.06);
    --shadow-md: 0 6px 20px rgba(20,41,29,0.08);
  }
  [data-theme="dark"] {
    --bg:         #0a1410;
    --surface:    #13221a;
    --surface-2:  #1a2e23;
    --border:     #1f3629;
    --border-strong: #2b4a38;
    --text:       #e8f5ec;
    --text-muted: #9db8a8;
    --text-faint: #6b8478;
    --primary:       #4ade80;
    --primary-dark:  #22c55e;
    --primary-light: #143d26;
    --primary-hover: #86efac;
    --warning:      #fbbf24;
    --warning-soft: #422006;
    --danger:       #f87171;
    --danger-soft:  #450a0a;
  }

  *, *::before, *::after { box-sizing: border-box; }
  html { -webkit-text-size-adjust: 100%; }
  body {
    margin: 0; background: var(--bg); color: var(--text);
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    font-size: 15px; line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    transition: background 0.2s, color 0.2s;
  }
  button { font-family: inherit; }
  [hidden] { display: none !important; }
  ::selection { background: var(--primary); color: white; }

  .app {
    max-width: 480px; margin: 0 auto; min-height: 100vh;
    display: flex; flex-direction: column;
    padding-bottom: 88px; position: relative;
  }

  .app-header {
    position: sticky; top: 0; z-index: 100;
    background: color-mix(in srgb, var(--bg) 88%, transparent);
    backdrop-filter: saturate(180%) blur(14px);
    -webkit-backdrop-filter: saturate(180%) blur(14px);
    border-bottom: 1px solid var(--border);
  }
  .app-header-inner {
    display: flex; align-items: center; justify-content: space-between;
    gap: 14px; padding: 16px 20px;
  }
  .brand h1 {
    margin: 0; font-size: 19px; font-weight: 800;
    letter-spacing: -0.03em; color: var(--text);
  }
  .brand p { margin: 2px 0 0; font-size: 12.5px; color: var(--text-muted); }
  .icon-btn {
    width: 40px; height: 40px;
    display: inline-flex; align-items: center; justify-content: center;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; font-size: 17px; cursor: pointer; color: var(--text);
    transition: background 0.15s, border-color 0.15s; box-shadow: var(--shadow-sm);
    flex-shrink: 0;
  }
  .icon-btn:hover { background: var(--surface-2); border-color: var(--border-strong); }

  .screen-container { flex: 1; }
  .screen { display: none; padding: 16px 16px 8px; animation: fadeUp 0.22s ease; }
  .screen.active { display: block; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .section { margin-top: 22px; }
  .section:first-child { margin-top: 0; }
  .section-head {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 12px; padding: 0 2px;
  }
  .section-head h2 {
    margin: 0; font-size: 15px; font-weight: 700;
    letter-spacing: -0.015em; color: var(--text);
  }
  .section-head .link {
    font-size: 12.5px; font-weight: 600; color: var(--primary);
    cursor: pointer; background: none; border: none; padding: 0;
  }

  .card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 16px; box-shadow: var(--shadow-sm);
  }
  .card + .card { margin-top: 12px; }

  .stats-row {
    display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
  }
  .stat-card {
    border-radius: var(--radius); padding: 16px;
    display: flex; flex-direction: column; gap: 4px;
    border: 1px solid var(--border); background: var(--surface);
    box-shadow: var(--shadow-sm); position: relative; overflow: hidden;
  }
  .stat-card.primary {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    border-color: transparent; color: #fff;
  }
  .stat-card.primary .stat-label { color: rgba(255,255,255,0.82); }
  .stat-card.primary .stat-note { color: rgba(255,255,255,0.7); }
  .stat-label {
    font-size: 11px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.06em; color: var(--text-muted);
  }
  .stat-value {
    font-size: 22px; font-weight: 800; letter-spacing: -0.03em;
    line-height: 1.15; font-variant-numeric: tabular-nums;
  }
  .stat-value .unit { font-size: 12px; font-weight: 500; opacity: 0.7; margin-left: 2px; }
  .stat-card.primary .stat-value { color: #fff; }
  .stat-note { font-size: 11.5px; color: var(--text-faint); font-weight: 500; margin-top: 2px; }
  .stat-card.quality-good .stat-value { color: var(--primary); }
  .stat-card.quality-warn .stat-value { color: var(--warning); }
  .stat-card.quality-err .stat-value  { color: var(--danger); }

  .btn-primary, .btn-secondary {
    width: 100%; padding: 15px 18px; font-size: 14.5px; font-weight: 600;
    letter-spacing: -0.01em; border-radius: var(--radius-sm); cursor: pointer;
    transition: background 0.15s, border-color 0.15s, transform 0.05s, box-shadow 0.15s;
    border: 1px solid transparent; display: flex; align-items: center;
    justify-content: center; gap: 8px;
  }
  .btn-primary {
    background: var(--primary); color: #fff;
    box-shadow: 0 2px 8px rgba(45,106,79,0.25);
  }
  .btn-primary:hover:not(:disabled) { background: var(--primary-hover); }
  .btn-primary:active:not(:disabled) { transform: translateY(1px); }
  .btn-primary:disabled {
    background: var(--surface-2); color: var(--text-faint);
    box-shadow: none; cursor: not-allowed;
  }
  .btn-secondary {
    background: var(--surface); color: var(--text);
    border-color: var(--border-strong); margin-top: 10px;
  }
  .btn-secondary:hover:not(:disabled) { background: var(--surface-2); }
  .btn-secondary:disabled { color: var(--text-faint); cursor: not-allowed; }
  .action-stack { margin-top: 16px; }

  .market-list { display: flex; flex-direction: column; gap: 8px; }
  .market-item {
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; padding: 14px 16px; background: var(--surface);
    border: 1px solid var(--border); border-radius: var(--radius-sm);
    box-shadow: var(--shadow-sm);
  }
  .market-item-left { display: flex; align-items: center; gap: 12px; min-width: 0; }
  .market-dot {
    width: 36px; height: 36px; border-radius: 11px;
    background: var(--primary-light); color: var(--primary);
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; font-weight: 700; flex-shrink: 0;
  }
  .market-name {
    font-size: 14px; font-weight: 600; color: var(--text);
    line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .market-sub { font-size: 11.5px; color: var(--text-faint); margin-top: 1px; }
  .market-price {
    font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 700;
    color: var(--text); font-variant-numeric: tabular-nums; white-space: nowrap;
  }
  .market-price .u { font-size: 10px; color: var(--text-faint); font-weight: 500; margin-left: 2px; }

  .trade-list { display: flex; flex-direction: column; gap: 10px; }
  .trade-item {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 16px; box-shadow: var(--shadow-sm);
    transition: border-color 0.15s, box-shadow 0.15s; cursor: pointer;
  }
  .trade-item:hover { border-color: var(--border-strong); box-shadow: var(--shadow-md); }
  .trade-top {
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 10px; margin-bottom: 8px;
  }
  .trade-tag {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 10.5px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.06em; padding: 3px 9px; border-radius: 999px;
    background: var(--primary-light); color: var(--primary);
  }
  .trade-tag.warn { background: var(--warning-soft); color: var(--warning); }
  .trade-tag::before {
    content: ''; width: 5px; height: 5px; border-radius: 50%; background: currentColor;
  }
  .trade-name {
    font-size: 15px; font-weight: 700; letter-spacing: -0.015em;
    color: var(--text); line-height: 1.3; flex: 1; margin: 0;
  }
  .trade-meta { font-size: 12.5px; color: var(--text-muted); line-height: 1.5; margin-top: 2px; }
  .trade-meta .dot { color: var(--text-faint); margin: 0 5px; }
  .trade-bottom {
    display: flex; align-items: center; justify-content: space-between;
    gap: 10px; margin-top: 12px; padding-top: 12px;
    border-top: 1px solid var(--border); flex-wrap: wrap;
  }
  .trade-price {
    font-family: 'JetBrains Mono', monospace; font-size: 19px; font-weight: 800;
    color: var(--primary); font-variant-numeric: tabular-nums;
  }
  .trade-price .c { font-size: 14px; opacity: 0.7; margin-right: 1px; }
  .trade-price .u { font-size: 10.5px; color: var(--text-faint); font-weight: 500; margin-left: 2px; }
  .trade-action {
    padding: 8px 14px; font-size: 12.5px; font-weight: 600;
    border-radius: 10px; background: var(--primary-light); color: var(--primary);
    border: none; cursor: pointer; transition: background 0.15s;
  }
  .trade-action:hover { background: var(--primary); color: #fff; }
  .nfa-badge {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.05em; padding: 4px 9px; border-radius: 8px;
    background: var(--warning-soft); color: var(--warning); white-space: nowrap;
  }
  .nfa-badge::before { content: '★'; font-size: 9px; }

  .camera-mode-tabs {
    display: flex; gap: 4px; background: var(--surface-2);
    padding: 4px; border-radius: 12px; margin-bottom: 14px;
  }
  .cam-tab {
    flex: 1; padding: 10px 12px; font-size: 12.5px; font-weight: 600;
    color: var(--text-muted); background: transparent; border: none;
    border-radius: 9px; cursor: pointer;
    transition: background 0.15s, color 0.15s, box-shadow 0.15s;
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  }
  .cam-tab.active {
    background: var(--surface); color: var(--text); box-shadow: var(--shadow-sm);
  }
  .cam-tab:hover:not(.active) { color: var(--text); }

  .camera-frame {
    border-radius: var(--radius); overflow: hidden; background: #0a1410;
    aspect-ratio: 4 / 3; margin-bottom: 14px; position: relative;
    border: 1px solid var(--border);
  }
  #video, #photoPreview, #esp32Stream {
    width: 100%; height: 100%; object-fit: cover; display: block;
  }
  #photoPreview { display: none; }
  #esp32Stream { display: none; }
  #video { display: none; }

  .camera-placeholder {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    flex-direction: column; gap: 8px; color: rgba(255,255,255,0.7);
    background: linear-gradient(135deg, #0d1f15 0%, #1a2e23 100%);
    text-align: center; padding: 24px; pointer-events: none;
  }
  .camera-placeholder.hidden { display: none; }
  .camera-placeholder svg { opacity: 0.5; }
  .camera-placeholder .ph-title { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.85); }
  .camera-placeholder .ph-sub { font-size: 11.5px; color: rgba(255,255,255,0.5); max-width: 240px; line-height: 1.5; }

  .stream-overlay {
    position: absolute; inset: 0; display: none;
    align-items: center; justify-content: center;
    flex-direction: column; gap: 10px;
    background: rgba(10,20,16,0.9); color: #fff; padding: 24px; text-align: center;
  }
  .stream-overlay.visible { display: flex; }
  .stream-overlay .title { font-size: 14px; font-weight: 600; }
  .stream-overlay .msg { font-size: 12px; opacity: 0.85; max-width: 320px; line-height: 1.55; }
  .stream-overlay .msg code {
    font-family: 'JetBrains Mono', monospace;
    background: rgba(255,255,255,0.12); padding: 1px 5px;
    border-radius: 4px; font-size: 11px; word-break: break-all;
  }
  .stream-overlay .retry-btn {
    margin-top: 6px; padding: 9px 18px; background: #fff; color: #14291d;
    border: none; border-radius: 9px; font-size: 12px; font-weight: 600; cursor: pointer;
  }
  .stream-overlay .retry-btn:hover { background: #e5e7eb; }

  .stream-url-row {
    margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border);
    font-size: 12px; color: var(--text-muted);
    display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  }
  .stream-url-row code {
    font-family: 'JetBrains Mono', monospace; background: var(--surface-2);
    color: var(--text); padding: 3px 8px; border-radius: 6px;
    font-size: 11px; word-break: break-all; max-width: 100%;
  }
  .link-btn {
    background: none; border: none; color: var(--primary);
    font-size: 12px; font-weight: 600; cursor: pointer; padding: 0;
    text-decoration: underline; margin-left: auto;
  }

  .check-list { display: flex; flex-direction: column; gap: 8px; }
  .check-item {
    display: flex; align-items: center; gap: 12px;
    padding: 13px 16px; background: var(--surface);
    border: 1px solid var(--border); border-radius: var(--radius-sm);
    box-shadow: var(--shadow-sm);
  }
  .check-icon {
    width: 34px; height: 34px; border-radius: 10px;
    background: var(--primary-light); color: var(--primary);
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; flex-shrink: 0;
  }
  .check-text { flex: 1; min-width: 0; }
  .check-title { font-size: 13.5px; font-weight: 600; color: var(--text); line-height: 1.3; }
  .check-sub { font-size: 11.5px; color: var(--text-faint); margin-top: 1px; }

  .match-hero {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    border-radius: var(--radius); padding: 24px 20px; color: #fff;
    text-align: center; position: relative; overflow: hidden;
    box-shadow: var(--shadow-md);
  }
  .match-hero::before {
    content: ''; position: absolute; top: -40px; right: -40px;
    width: 140px; height: 140px; border-radius: 50%;
    background: rgba(255,255,255,0.08);
  }
  .match-hero::after {
    content: ''; position: absolute; bottom: -60px; left: -30px;
    width: 120px; height: 120px; border-radius: 50%;
    background: rgba(255,255,255,0.06);
  }
  .match-hero-label {
    font-size: 11px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.1em; opacity: 0.8; position: relative;
  }
  .match-hero-value {
    font-size: 30px; font-weight: 800; letter-spacing: -0.03em;
    margin: 4px 0 2px; position: relative; line-height: 1.1;
  }
  .match-hero-sub {
    font-size: 12.5px; opacity: 0.85; position: relative; margin-top: 4px;
  }
  .match-badge {
    display: inline-block; margin-top: 12px; padding: 5px 14px;
    border-radius: 999px; background: rgba(255,255,255,0.18);
    font-size: 11px; font-weight: 600; letter-spacing: 0.02em; position: relative;
  }

  .analysis-grid {
    display: grid; grid-template-columns: repeat(2, 1fr);
    gap: 10px; margin-top: 12px;
  }
  .analysis-cell {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 14px; box-shadow: var(--shadow-sm);
  }
  .analysis-key {
    font-size: 10.5px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.07em; color: var(--text-muted); margin-bottom: 5px;
  }
  .analysis-val {
    font-size: 15px; font-weight: 700; letter-spacing: -0.01em;
    color: var(--text); line-height: 1.25;
  }
  .analysis-val.mono {
    font-family: 'JetBrains Mono', monospace;
    font-variant-numeric: tabular-nums; font-size: 14px;
  }
  .analysis-val.warn { color: var(--warning); }
  .analysis-val.err  { color: var(--danger); }

  .analysis-note {
    margin-top: 14px; padding: 14px 16px; border-radius: var(--radius-sm);
    background: var(--primary-light); color: var(--text); font-size: 13px;
    line-height: 1.55;
    border: 1px solid color-mix(in srgb, var(--primary) 20%, transparent);
  }

  .analysis-loading {
    padding: 40px 16px; text-align: center;
    font-size: 13px; font-weight: 500; color: var(--text-muted);
    display: flex; align-items: center; justify-content: center; gap: 10px;
  }
  .spinner {
    width: 18px; height: 18px;
    border: 2.5px solid var(--border-strong);
    border-top-color: var(--primary); border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .analysis-error {
    padding: 16px; border-radius: var(--radius-sm);
    background: var(--danger-soft);
    border: 1px solid color-mix(in srgb, var(--danger) 25%, transparent);
    margin-top: 12px;
  }
  .analysis-error .label {
    font-size: 11px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.07em; color: var(--danger); margin-bottom: 6px;
  }
  .analysis-error .msg { font-size: 13px; color: var(--text); line-height: 1.5; }
  .error-actions { margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap; }
  .btn-sm {
    padding: 9px 15px; font-size: 12.5px; font-weight: 600;
    border-radius: 10px; background: var(--surface); color: var(--text);
    border: 1px solid var(--border-strong); cursor: pointer;
    transition: background 0.15s;
  }
  .btn-sm:hover { background: var(--surface-2); }

  .tabs {
    display: flex; gap: 4px; background: var(--surface-2);
    padding: 4px; border-radius: 12px; margin-bottom: 14px;
  }
  .tab {
    flex: 1; padding: 9px 12px; font-size: 12.5px; font-weight: 600;
    color: var(--text-muted); background: transparent; border: none;
    border-radius: 9px; cursor: pointer;
    transition: background 0.15s, color 0.15s, box-shadow 0.15s;
  }
  .tab.active { background: var(--surface); color: var(--text); box-shadow: var(--shadow-sm); }
  .tab:hover:not(.active) { color: var(--text); }

  .miller-list { display: flex; flex-direction: column; gap: 10px; }
  .miller-item {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 16px; box-shadow: var(--shadow-sm);
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .miller-item:hover { border-color: var(--border-strong); box-shadow: var(--shadow-md); }
  .miller-top {
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 10px; margin-bottom: 6px;
  }
  .miller-name {
    font-size: 15px; font-weight: 700; letter-spacing: -0.015em;
    color: var(--text); line-height: 1.3; flex: 1;
  }
  .type-tag {
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.06em; padding: 3px 8px; border-radius: 7px;
    background: var(--surface-2); color: var(--text-muted); flex-shrink: 0;
  }
  .type-tag.large { background: var(--primary-light); color: var(--primary); }
  .miller-info {
    font-size: 12.5px; color: var(--text-muted); line-height: 1.55; margin-bottom: 12px;
  }
  .miller-info .dot { color: var(--text-faint); margin: 0 5px; }
  .miller-info .dist {
    font-family: 'JetBrains Mono', monospace; font-size: 12px;
    font-weight: 600; color: var(--text-muted);
  }
  .miller-bottom {
    display: flex; align-items: center; justify-content: space-between;
    gap: 10px; padding-top: 12px; border-top: 1px solid var(--border);
    flex-wrap: wrap;
  }
  .price-block { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }

  .empty-state {
    padding: 36px 16px; text-align: center;
    font-size: 13px; color: var(--text-muted); line-height: 1.6;
  }
  .empty-state .es-icon {
    width: 52px; height: 52px; border-radius: 50%;
    background: var(--primary-light); color: var(--primary);
    display: inline-flex; align-items: center; justify-content: center;
    margin-bottom: 10px; font-size: 22px;
  }

  .note-banner {
    display: none; margin-bottom: 12px; padding: 13px 16px;
    border-radius: var(--radius-sm); background: var(--warning-soft);
    border: 1px solid color-mix(in srgb, var(--warning) 25%, transparent);
    color: var(--text); font-size: 12.5px; line-height: 1.55;
  }
  .note-banner.visible { display: block; }

  #map {
    height: 300px; border-radius: var(--radius);
    border: 1px solid var(--border); background: var(--surface-2);
    z-index: 1; overflow: hidden; box-shadow: var(--shadow-sm);
  }
  [data-theme="dark"] .leaflet-tile-pane {
    filter: invert(1) hue-rotate(180deg) brightness(0.85) contrast(0.9) saturate(0.6);
  }
  .leaflet-container { background: var(--surface-2); font-family: 'Inter', sans-serif; }
  .leaflet-popup-content-wrapper, .leaflet-popup-tip {
    background: var(--surface); color: var(--text);
    border: 1px solid var(--border); border-radius: 12px; box-shadow: var(--shadow-md);
  }
  .leaflet-popup-content { margin: 12px 14px; font-size: 13px; line-height: 1.5; }
  .leaflet-popup-close-button { color: var(--text-muted) !important; }
  .leaflet-control-zoom {
    border: none !important; box-shadow: var(--shadow-md) !important;
    border-radius: 10px !important; overflow: hidden;
  }
  .leaflet-control-zoom a {
    background: var(--surface) !important; color: var(--text) !important;
    border-color: var(--border) !important; font-size: 18px !important;
    line-height: 28px !important;
  }
  .leaflet-control-zoom a:hover { background: var(--surface-2) !important; }

  .radius-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 16px; box-shadow: var(--shadow-sm);
    margin-top: 14px;
  }
  .radius-row { display: flex; align-items: center; gap: 16px; }
  .radius-slider-wrap { flex: 1; position: relative; }
  input[type="range"] {
    -webkit-appearance: none; appearance: none; width: 100%; height: 6px;
    background: var(--surface-2); border-radius: 999px; outline: none; cursor: pointer;
  }
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none; appearance: none; width: 22px; height: 22px;
    background: var(--primary); border: 2.5px solid var(--surface);
    border-radius: 50%; cursor: pointer;
    box-shadow: 0 2px 6px rgba(45,106,79,0.35); transition: transform 0.1s;
  }
  input[type="range"]::-webkit-slider-thumb:active { transform: scale(1.12); }
  input[type="range"]::-moz-range-thumb {
    width: 22px; height: 22px; background: var(--primary);
    border: 2.5px solid var(--surface); border-radius: 50%; cursor: pointer;
    box-shadow: 0 2px 6px rgba(45,106,79,0.35);
  }
  input[type="range"]::-moz-range-track {
    height: 6px; background: var(--surface-2); border-radius: 999px;
  }
  .radius-value {
    font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 700;
    letter-spacing: -0.02em; color: var(--primary);
    font-variant-numeric: tabular-nums; min-width: 86px; text-align: right;
  }
  .radius-value .u {
    font-size: 11px; font-weight: 500; color: var(--text-muted);
    margin-left: 3px; letter-spacing: 0.05em;
  }

  .area-summary {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    border-radius: var(--radius); padding: 20px; color: #fff;
    box-shadow: var(--shadow-md); margin-top: 14px;
  }
  .area-summary-label {
    font-size: 11px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.1em; opacity: 0.8;
  }
  .area-summary-range {
    font-size: 28px; font-weight: 800; letter-spacing: -0.03em;
    margin: 4px 0 2px; font-variant-numeric: tabular-nums;
  }
  .area-summary-sub { font-size: 12.5px; opacity: 0.85; margin-top: 2px; }

  .area-list { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
  .area-item {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 14px 16px; box-shadow: var(--shadow-sm);
  }
  .area-item-top {
    display: flex; align-items: center; justify-content: space-between;
    gap: 10px; margin-bottom: 4px;
  }
  .area-item-name { font-size: 13.5px; font-weight: 600; color: var(--text); }
  .area-item-count { font-size: 11px; color: var(--text-faint); font-weight: 500; }
  .area-item-prices { display: flex; gap: 16px; margin-top: 6px; }
  .area-price-cell { display: flex; flex-direction: column; gap: 1px; }
  .area-price-label {
    font-size: 10px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.05em; color: var(--text-faint);
  }
  .area-price-val {
    font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700;
    color: var(--text); font-variant-numeric: tabular-nums;
  }

  .bottom-nav {
    position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 100%; max-width: 480px; z-index: 100;
    background: color-mix(in srgb, var(--surface) 92%, transparent);
    backdrop-filter: saturate(180%) blur(16px);
    -webkit-backdrop-filter: saturate(180%) blur(16px);
    border-top: 1px solid var(--border); display: flex;
    padding: 8px 6px calc(8px + env(safe-area-inset-bottom, 0px));
    box-shadow: 0 -2px 12px rgba(20,41,29,0.06);
  }
  .nav-btn {
    flex: 1; display: flex; flex-direction: column; align-items: center;
    gap: 3px; padding: 6px 4px; background: none; border: none;
    cursor: pointer; color: var(--text-faint); font-size: 10px;
    font-weight: 600; letter-spacing: 0.01em; border-radius: 10px;
    transition: color 0.15s, background 0.15s; position: relative;
  }
  .nav-btn svg { width: 21px; height: 21px; }
  .nav-btn:hover { color: var(--text-muted); }
  .nav-btn.active { color: var(--primary); }
  .nav-btn.active::after {
    content: ''; position: absolute; bottom: 0; left: 50%;
    transform: translateX(-50%); width: 18px; height: 3px;
    border-radius: 999px; background: var(--primary);
  }

  .footer-note {
    margin: 24px 4px 0; padding: 16px; background: var(--surface-2);
    border-radius: var(--radius-sm); font-size: 11.5px;
    color: var(--text-muted); line-height: 1.6; border: 1px solid var(--border);
  }
  .footer-note h4 {
    margin: 0 0 6px; font-size: 10.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.07em; color: var(--text-muted);
  }
  .footer-note p { margin: 0 0 8px; }
  .footer-note p:last-child { margin-bottom: 0; }
  .footer-note strong { color: var(--text); font-weight: 700; }

  @media (min-width: 481px) {
    .app { border-left: 1px solid var(--border); border-right: 1px solid var(--border); }
  }
  @media (max-width: 380px) {
    .stat-value { font-size: 19px; }
    .match-hero-value { font-size: 26px; }
    .brand h1 { font-size: 17px; }
  }
</style>
</head>
<body>

<div class="app">

  <header class="app-header">
    <div class="app-header-inner">
      <div class="brand">
        <h1 id="pageTitle">Rice Marketplace</h1>
        <p id="pageSubtitle">Know your rice trade with clarity</p>
      </div>
      <button class="icon-btn" id="themeToggle" type="button" aria-label="Toggle theme">🌙</button>
    </div>
  </header>

  <main class="screen-container">

    <section class="screen active" id="screen-home">
      <div class="stats-row">
        <div class="stat-card primary">
          <span class="stat-label">Trade price</span>
          <span class="stat-value" id="homePrice">₱47.20<span class="unit">/kg</span></span>
          <span class="stat-note">Average today</span>
        </div>
        <div class="stat-card quality-good" id="homeQualityCard">
          <span class="stat-label">Quality</span>
          <span class="stat-value" id="homeQuality">Acceptable</span>
          <span class="stat-note" id="homeQualityNote">Based on last scan</span>
        </div>
      </div>

      <div class="action-stack">
        <button class="btn-primary" id="homeSellBtn" type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          Sell your rice sample
        </button>
        <button class="btn-secondary" id="homeScanBtn" type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          Scan a rice sample
        </button>
      </div>

      <div class="section">
        <div class="section-head">
          <h2>Today's market pulse</h2>
          <button class="link" data-goto="listings">View all</button>
        </div>
        <div class="market-list" id="marketPulseList"></div>
      </div>

      <div class="section">
        <div class="section-head">
          <h2>Trade rice near you</h2>
          <button class="link" data-goto="area">Map</button>
        </div>
        <div class="trade-list" id="nearbyTrades"></div>
      </div>

      <div class="footer-note">
        <h4>Pricing notes</h4>
        <p>NFA procures clean, dry palay at <strong>₱23.00–₱24.00/kg</strong>. Millers marked <strong>NFA-Competitive</strong> pay at or above benchmark.</p>
        <p>Moisture adjustment: dry ×1.00, borderline ×0.85, wet ×0.65. Estimates only.</p>
      </div>
    </section>

    <section class="screen" id="screen-scan">
      <div class="section-head" style="margin-bottom:14px;">
        <h2>Scan rice sample</h2>
      </div>

      <div class="camera-mode-tabs" id="cameraModeTabs">
        <button class="cam-tab active" data-mode="esp32" type="button">ESP32-CAM</button>
        <button class="cam-tab" data-mode="device" type="button">Device Camera</button>
      </div>

      <div class="camera-frame">
        <img id="esp32Stream" crossorigin="anonymous" alt="ESP32-CAM live stream" />
        <video id="video" autoplay playsinline muted></video>
        <img id="photoPreview" alt="Captured palay" />
        <div class="camera-placeholder" id="cameraPlaceholder">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          <div class="ph-title">Place grain analysis here</div>
          <div class="ph-sub">Point the camera at a sample of palay</div>
        </div>
        <div class="stream-overlay" id="streamOverlay">
          <div class="title" id="streamOverlayTitle">ESP32-CAM unreachable</div>
          <div class="msg" id="streamOverlayMsg">Loading <code id="overlayUrl">...</code></div>
          <button class="retry-btn" id="retryStreamBtn" type="button">Reconnect</button>
        </div>
        <canvas id="canvas" style="display:none;"></canvas>
      </div>

      <button id="shutterBtn" class="btn-primary" type="button" disabled>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
        Start sample scan
      </button>
      <button id="uploadBtn" class="btn-secondary" type="button">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
        Choose from gallery
      </button>
      <input type="file" id="fileInput" accept="image/*" style="display:none" />

      <div class="stream-url-row" id="streamUrlRow">
        <span>ESP32 stream:</span>
        <code id="streamUrlDisplay"></code>
        <button class="link-btn" id="editStreamUrlBtn" type="button">Change</button>
      </div>

      <div class="section">
        <div class="section-head"><h2>What we check</h2></div>
        <div class="check-list">
          <div class="check-item">
            <div class="check-icon">💧</div>
            <div class="check-text">
              <div class="check-title">Moisture</div>
              <div class="check-sub">Dry, borderline, or wet grain</div>
            </div>
          </div>
          <div class="check-item">
            <div class="check-icon">🌾</div>
            <div class="check-text">
              <div class="check-title">Variety</div>
              <div class="check-sub">Classification from your sample</div>
            </div>
          </div>
          <div class="check-item">
            <div class="check-icon">✨</div>
            <div class="check-text">
              <div class="check-title">Quality</div>
              <div class="check-sub">Grade and confidence score</div>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-head">
          <h2>Browser matching preview</h2>
          <button class="link" data-goto="listings">See all</button>
        </div>
        <div class="trade-list" id="scanPreviewList">
          <div class="empty-state">Scan a sample to preview matching buyers.</div>
        </div>
      </div>
    </section>

    <section class="screen" id="screen-match">
      <div class="section-head" style="margin-bottom:14px;">
        <h2>Grain match</h2>
      </div>

      <div id="matchEmpty" class="empty-state">
        <div class="es-icon">🌾</div>
        <div>No sample analyzed yet.</div>
        <div style="margin-top:8px;font-size:12px;">Scan a rice sample to see your grain match.</div>
        <button class="btn-primary" style="margin-top:16px;max-width:220px;margin-left:auto;margin-right:auto;" data-goto="scan" type="button">Scan now</button>
      </div>

      <div id="analysisSection" hidden>
        <div class="match-hero" id="matchHero">
          <div class="match-hero-label">Classification</div>
          <div class="match-hero-value" id="matchClassValue">—</div>
          <div class="match-hero-sub" id="matchConfidenceValue">—</div>
          <div class="match-badge" id="matchBadge">—</div>
        </div>

        <div class="analysis-grid">
          <div class="analysis-cell">
            <div class="analysis-key">Confidence</div>
            <div class="analysis-val mono" id="analysisConfidence">—</div>
          </div>
          <div class="analysis-cell">
            <div class="analysis-key">Moisture</div>
            <div class="analysis-val" id="analysisMoisture">—</div>
          </div>
          <div class="analysis-cell">
            <div class="analysis-key">Price Factor</div>
            <div class="analysis-val mono" id="analysisFactor">—</div>
          </div>
          <div class="analysis-cell">
            <div class="analysis-key">Match Score</div>
            <div class="analysis-val mono" id="analysisScore">—</div>
          </div>
        </div>

        <div class="analysis-note" id="analysisNote"></div>

        <div class="section">
          <div class="section-head">
            <h2>Recommended millers</h2>
            <button class="link" data-goto="listings">View all</button>
          </div>
          <div class="trade-list" id="recommendedList"></div>
        </div>
      </div>

      <div id="analysisLoading" class="analysis-loading" hidden>
        <span class="spinner"></span>
        <span>Analyzing photograph</span>
      </div>

      <div id="analysisError" class="analysis-error" hidden>
        <div class="label" id="analysisErrorLabel">Analysis Unavailable</div>
        <div class="msg" id="analysisErrorMsg">The model could not analyze this image.</div>
        <div class="error-actions">
          <button class="btn-sm" id="retryAnalysisBtn" type="button">Retry Analysis</button>
          <button class="btn-sm" id="skipAnalysisBtn" type="button">Continue as Dry</button>
        </div>
      </div>
    </section>

    <section class="screen" id="screen-listings">
      <div class="section-head" style="margin-bottom:14px;">
        <h2>Rice listings</h2>
        <span class="link" id="listingCount" style="pointer-events:none;">—</span>
      </div>

      <div class="tabs" id="filterTabs" style="display:none;">
        <button class="tab active" data-mode="nearby" type="button">Nearby</button>
        <button class="tab" data-mode="all" type="button">All</button>
      </div>

      <div class="note-banner" id="millerNote"></div>

      <div class="miller-list" id="millerList">
        <div class="empty-state">
          <div class="es-icon">📋</div>
          <div>No listings yet.</div>
          <div style="margin-top:8px;font-size:12px;">Scan or upload a sample to unlock buyer matches.</div>
        </div>
      </div>
    </section>

    <section class="screen" id="screen-area">
      <div class="section-head" style="margin-bottom:14px;">
        <h2>Area prices</h2>
        <span class="link" id="areaStatus" style="pointer-events:none;">Locating…</span>
      </div>

      <div id="map"></div>

      <div class="radius-card">
        <div class="radius-row">
          <div class="radius-slider-wrap">
            <input type="range" id="radiusSlider" min="1" max="500" value="25" step="1" />
          </div>
          <div class="radius-value"><span id="radiusValue">25</span><span class="u">KM</span></div>
        </div>
        <div style="margin-top:10px;font-size:12px;color:var(--text-muted);">Expand or narrow the search area.</div>
      </div>

      <div class="area-summary">
        <div class="area-summary-label">Price range in radius</div>
        <div class="area-summary-range" id="areaRange">—</div>
        <div class="area-summary-sub" id="areaSub">—</div>
      </div>

      <div class="section">
        <div class="section-head"><h2>By market area</h2></div>
        <div class="area-list" id="areaList">
          <div class="empty-state">Adjust the radius to see market prices.</div>
        </div>
      </div>
    </section>

  </main>

  <nav class="bottom-nav">
    <button class="nav-btn active" data-tab="home" type="button">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      <span>Home</span>
    </button>
    <button class="nav-btn" data-tab="scan" type="button">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
      <span>Scan</span>
    </button>
    <button class="nav-btn" data-tab="match" type="button">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      <span>Match</span>
    </button>
    <button class="nav-btn" data-tab="listings" type="button">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
      <span>Listings</span>
    </button>
    <button class="nav-btn" data-tab="area" type="button">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      <span>Area</span>
    </button>
  </nav>

</div>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
const MILLERS = ${JSON.stringify(MILLERS)};
const DEFAULT_ESP32_STREAM_URL = ${JSON.stringify(ESP32_STREAM_URL)};
const MOISTURE_MULTIPLIER = { dry: 1.00, moderate: 0.85, wet: 0.65, unknown: 1.00 };
const PALAY_MIN_CONFIDENCE = 0.35;

let map = null, mapInitialized = false;
let userLat = null, userLng = null;
let radiusCircle = null, markersLayer = null, userMarker = null;
let gpsWarning = null;

let deviceCameraStarted = false;
let filterMode = 'nearby';
let activeMoisture = null;
let activeFactor = 1.00;
let analysisResult = null;
let lastImageDataUrl = null;
let millersUnlocked = false;
let lastErrorType = null;

let cameraMode = 'esp32';
let esp32StreamUrl = localStorage.getItem('rmr-esp32-url') || DEFAULT_ESP32_STREAM_URL;

const $ = (id) => document.getElementById(id);

/* SCREEN NAV */
const SCREEN_META = {
  home:     { title: 'Rice Marketplace', subtitle: 'Know your rice trade with clarity' },
  scan:     { title: 'Scan rice sample',  subtitle: 'Capture or upload your palay' },
  match:    { title: 'Grain match',      subtitle: 'Analysis results and recommended millers' },
  listings: { title: 'Rice listings',    subtitle: 'Buyers matched to your grain' },
  area:     { title: 'Area prices',      subtitle: 'Market rates near your location' }
};

function showScreen(name) {
  document.querySelectorAll('.screen').forEach((s) => {
    s.classList.toggle('active', s.id === 'screen-' + name);
  });
  document.querySelectorAll('.nav-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.tab === name);
  });

  const meta = SCREEN_META[name] || SCREEN_META.home;
  $('pageTitle').textContent = meta.title;
  $('pageSubtitle').textContent = meta.subtitle;

  if (name === 'area' && !mapInitialized && userLat !== null) {
    initMap(userLat, userLng);
  }
  if (name === 'area' && map) {
    setTimeout(() => map.invalidateSize(), 180);
  }
  if (name === 'home') {
    renderHomeStats();
    renderMarketPulse();
    renderNearbyTrades();
  }
}

document.querySelectorAll('.nav-btn').forEach((btn) => {
  btn.addEventListener('click', () => showScreen(btn.dataset.tab));
});
document.querySelectorAll('[data-goto]').forEach((el) => {
  el.addEventListener('click', () => showScreen(el.dataset.goto));
});

/* THEME */
const themeToggle = $('themeToggle');
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('rmr-theme', theme);
  if (map) setTimeout(redrawMapStyle, 0);
}
(function initTheme() {
  const saved = localStorage.getItem('rmr-theme');
  const sys = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(saved || sys);
})();
themeToggle.addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme');
  applyTheme(cur === 'dark' ? 'light' : 'dark');
});

/* HAVERSINE */
function haversineKm(a1, o1, a2, o2) {
  const R = 6371, r = (d) => d * Math.PI / 180;
  const dA = r(a2 - a1), dO = r(o2 - o1);
  const x = Math.sin(dA / 2) ** 2 + Math.cos(r(a1)) * Math.cos(r(a2)) * Math.sin(dO / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}
function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/* MAP / GPS */
function initMap(lat, lng) {
  userLat = lat; userLng = lng;
  if (map) {
    map.setView([lat, lng], 11);
    if (userMarker) map.removeLayer(userMarker);
  } else {
    map = L.map('map', { zoomControl: true }).setView([lat, lng], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'OpenStreetMap', maxZoom: 19
    }).addTo(map);
    markersLayer = L.layerGroup().addTo(map);
  }
  userMarker = L.circleMarker([lat, lng], {
    radius: 8, color: cssVar('--primary'), fillColor: cssVar('--primary'),
    fillOpacity: 1, weight: 3, opacity: 1
  }).addTo(map).bindPopup('<strong>Your location</strong>');
  updateRadiusCircle(parseFloat($('radiusSlider').value));
  mapInitialized = true;
  setTimeout(() => map.invalidateSize(), 200);
}

function requestGPS() {
  if (!navigator.geolocation) {
    gpsWarning = 'GPS unsupported — using Manila as default.';
    userLat = 14.5995; userLng = 120.9842;
    $('areaStatus').textContent = 'Fallback';
    renderHomeStats(); renderMarketPulse(); renderNearbyTrades();
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      userLat = pos.coords.latitude;
      userLng = pos.coords.longitude;
      $('areaStatus').textContent = 'GPS active';
      if (document.getElementById('screen-area').classList.contains('active')) {
        initMap(userLat, userLng);
      }
      renderHomeStats(); renderMarketPulse(); renderNearbyTrades();
      if (mapInitialized) filterAndShowMillers(parseFloat($('radiusSlider').value));
    },
    (err) => {
      console.warn('Geolocation error:', err.message);
      gpsWarning = 'GPS unavailable — showing Manila as default center.';
      userLat = 14.5995; userLng = 120.9842;
      $('areaStatus').textContent = 'Fallback';
      renderHomeStats(); renderMarketPulse(); renderNearbyTrades();
    },
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
  );
}

/* RADIUS */
function updateRadiusCircle(km) {
  $('radiusValue').textContent = km;
  if (!map) return;
  const meters = km * 1000;
  if (radiusCircle) {
    radiusCircle.setRadius(meters);
  } else {
    radiusCircle = L.circle([userLat, userLng], {
      radius: meters, color: cssVar('--primary'), fillColor: cssVar('--primary'),
      fillOpacity: 0.08, weight: 1, dashArray: '4 4'
    }).addTo(map);
  }
  if (millersUnlocked) filterAndShowMillers(km);
  renderAreaSummary(km);
  renderAreaList(km);
}

$('radiusSlider').addEventListener('input', (e) => {
  const km = parseFloat(e.target.value);
  $('radiusValue').textContent = km;
  if (map) {
    if (radiusCircle) radiusCircle.setRadius(km * 1000);
    if (millersUnlocked) filterAndShowMillers(km);
  }
  renderAreaSummary(km);
  renderAreaList(km);
});

/* HOME RENDERING */
function avgTradePrice() {
  const avg = MILLERS.reduce((s, m) => s + m.priceDry, 0) / MILLERS.length;
  return avg.toFixed(2);
}

function renderHomeStats() {
  $('homePrice').innerHTML = '₱' + avgTradePrice() + '<span class="unit">/kg</span>';
  const card = $('homeQualityCard');
  const q = $('homeQuality');
  const note = $('homeQualityNote');
  card.classList.remove('quality-good', 'quality-warn', 'quality-err');

  if (!analysisResult) {
    q.textContent = 'Awaiting scan';
    note.textContent = 'Scan a sample to assess';
    card.classList.add('quality-good');
  } else if (analysisResult.moisture === 'dry') {
    q.textContent = 'Acceptable';
    note.textContent = 'Dry grain detected';
    card.classList.add('quality-good');
  } else if (analysisResult.moisture === 'moderate') {
    q.textContent = 'Borderline';
    note.textContent = 'Slight moisture';
    card.classList.add('quality-warn');
  } else {
    q.textContent = 'Moisture';
    note.textContent = 'Drying recommended';
    card.classList.add('quality-err');
  }
}

function renderMarketPulse() {
  const el = $('marketPulseList');
  const sorted = [...MILLERS].sort((a, b) => b.priceDry - a.priceDry).slice(0, 3);
  el.innerHTML = sorted.map((m, i) => {
    const icon = ['🌾', '🌱', '🍚'][i] || '🌾';
    return '<div class="market-item">' +
      '<div class="market-item-left">' +
        '<div class="market-dot">' + icon + '</div>' +
        '<div>' +
          '<div class="market-name">' + m.name + '</div>' +
          '<div class="market-sub">' + m.address + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="market-price">₱' + m.priceDry.toFixed(2) + '<span class="u">/kg</span></div>' +
    '</div>';
  }).join('');
}

function renderNearbyTrades() {
  const el = $('nearbyTrades');
  if (userLat === null) {
    el.innerHTML = '<div class="empty-state">Waiting for location…</div>';
    return;
  }
  const nearest = MILLERS
    .map((m) => ({ ...m, distance: haversineKm(userLat, userLng, m.lat, m.lng) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3);

  el.innerHTML = nearest.map((m) => {
    const isNfa = m.priceDry >= 23;
    return '<div class="trade-item">' +
      '<div class="trade-top">' +
        '<span class="trade-tag">' + (m.type === 'large' ? 'Large mill' : 'Small mill') + '</span>' +
        (isNfa ? '<span class="nfa-badge">NFA-Competitive</span>' : '') +
      '</div>' +
      '<h3 class="trade-name">' + m.name + '</h3>' +
      '<div class="trade-meta">' + m.address +
        '<span class="dot">·</span>' + m.contact +
        '<span class="dot">·</span><span style="font-family:JetBrains Mono,monospace;font-size:12px;font-weight:600;">' + m.distance.toFixed(1) + ' km</span>' +
      '</div>' +
      '<div class="trade-bottom">' +
        '<div class="trade-price"><span class="c">₱</span>' + m.priceDry.toFixed(2) + '<span class="u">/KG</span></div>' +
        '<button class="trade-action" type="button">View offer</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

/* CAMERA MODE */
const esp32Stream = $('esp32Stream');
const video = $('video');
const photoPreview = $('photoPreview');
const cameraPlaceholder = $('cameraPlaceholder');
const streamOverlay = $('streamOverlay');
const streamOverlayTitle = $('streamOverlayTitle');
const streamOverlayMsg = $('streamOverlayMsg');
const overlayUrl = $('overlayUrl');
const retryStreamBtn = $('retryStreamBtn');
const streamUrlDisplay = $('streamUrlDisplay');
const editStreamUrlBtn = $('editStreamUrlBtn');
const streamUrlRow = $('streamUrlRow');
const shutterBtn = $('shutterBtn');
const uploadBtn = $('uploadBtn');
const fileInput = $('fileInput');
const canvas = $('canvas');

function resetCaptureUI() {
  photoPreview.style.display = 'none';
  photoPreview.src = '';
  shutterBtn.dataset.state = 'ready';
  shutterBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> Start sample scan';
  $('analysisSection').hidden = true;
  $('matchEmpty').hidden = false;
  $('analysisError').hidden = true;
  lastErrorType = null;
  streamOverlay.classList.remove('visible');
  cameraPlaceholder.classList.remove('hidden');
}

function setCameraMode(mode) {
  cameraMode = mode;
  document.querySelectorAll('.cam-tab').forEach((t) => {
    t.classList.toggle('active', t.dataset.mode === mode);
  });
  resetCaptureUI();

  if (mode === 'esp32') {
    video.style.display = 'none';
    esp32Stream.style.display = 'block';
    streamUrlRow.style.display = 'flex';
    streamUrlDisplay.textContent = esp32StreamUrl;
    connectEsp32Stream();
  } else {
    esp32Stream.style.display = 'none';
    streamUrlRow.style.display = 'none';
    video.style.display = 'block';
    startDeviceCamera();
  }
}

document.querySelectorAll('.cam-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    if (tab.dataset.mode === cameraMode) return;
    setCameraMode(tab.dataset.mode);
  });
});

function connectEsp32Stream() {
  shutterBtn.disabled = true;
  streamOverlay.classList.remove('visible');
  cameraPlaceholder.classList.add('hidden');
  esp32Stream.src = esp32StreamUrl + (esp32StreamUrl.includes('?') ? '&' : '?') + '_=' + Date.now();
}

esp32Stream.addEventListener('load', () => {
  if (cameraMode !== 'esp32') return;
  shutterBtn.disabled = false;
  streamOverlay.classList.remove('visible');
  cameraPlaceholder.classList.add('hidden');
});

esp32Stream.addEventListener('error', () => {
  if (cameraMode !== 'esp32') return;
  shutterBtn.disabled = true;
  overlayUrl.textContent = esp32StreamUrl;
  streamOverlayMsg.innerHTML =
    'Could not load <code>' + esp32StreamUrl + '</code>. Check that:<br><br>' +
    '1. The ESP32-CAM is powered on and on the same Wi-Fi<br>' +
    '2. The URL is correct<br>' +
    '3. Your sketch sends <code>Access-Control-Allow-Origin: *</code>';
  streamOverlayTitle.textContent = 'ESP32-CAM unreachable';
  streamOverlay.classList.add('visible');
  cameraPlaceholder.classList.add('hidden');
});

retryStreamBtn.addEventListener('click', () => {
  if (cameraMode === 'esp32') connectEsp32Stream();
});

editStreamUrlBtn.addEventListener('click', () => {
  const next = prompt('ESP32-CAM stream URL', esp32StreamUrl);
  if (!next) return;
  const trimmed = next.trim();
  if (!/^https?:\\/\\//.test(trimmed)) { alert('URL must start with http:// or https://'); return; }
  esp32StreamUrl = trimmed;
  localStorage.setItem('rmr-esp32-url', trimmed);
  streamUrlDisplay.textContent = trimmed;
  if (cameraMode === 'esp32') connectEsp32Stream();
});

async function startDeviceCamera() {
  if (deviceCameraStarted) return;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }, audio: false
    });
    video.srcObject = stream;
    deviceCameraStarted = true;
    cameraPlaceholder.classList.add('hidden');
    if (cameraMode === 'device' && shutterBtn.dataset.state !== 'captured') {
      shutterBtn.disabled = false;
    }
  } catch (err) {
    console.error('Camera error:', err);
    if (cameraMode === 'device') {
      shutterBtn.disabled = true;
      shutterBtn.textContent = 'Camera Unavailable';
      cameraPlaceholder.classList.remove('hidden');
    }
  }
}

/* ANALYSIS PARSER */
function parseRoboflowResult(data) {
  const preds = data && data.predictions;
  if (!Array.isArray(preds) || preds.length === 0) {
    return { moisture: 'unknown', classLabel: 'Unclassified', confidence: 0 };
  }
  const top = preds.reduce((a, b) => ((b.confidence || 0) > (a.confidence || 0) ? b : a), preds[0]);
  const rawClass = String(top.class || 'unknown');
  const lower = rawClass.toLowerCase();
  const confidence = Number(top.confidence) || 0;
  let moisture = 'dry';
  if (/(wet|moist|damp|high[\\s_-]?moist)/.test(lower)) moisture = 'wet';
  else if (/(slight|moderat|mid[\\s_-]?moist|borderline)/.test(lower)) moisture = 'moderate';
  else if (/(dry|low[\\s_-]?moist)/.test(lower)) moisture = 'dry';
  else if (/(good|premium|excellent|grade[\\s_-]?a|pass)/.test(lower)) moisture = 'dry';
  else if (/(poor|bad|reject|defect|damaged|fail)/.test(lower)) moisture = 'wet';
  return { moisture, classLabel: rawClass, confidence, raw: preds };
}

function validatePalayImage(data) {
  if (!data || typeof data !== 'object') {
    return { valid: false, reason: 'bad-response' };
  }
  if (!('predictions' in data)) {
    if (typeof data.top === 'string' && typeof data.confidence === 'number') {
      if (data.confidence < PALAY_MIN_CONFIDENCE) return { valid: false, reason: 'low-confidence' };
      return { valid: true };
    }
    return { valid: false, reason: 'bad-response' };
  }
  const preds = data.predictions;
  if (!Array.isArray(preds)) {
    return { valid: false, reason: 'bad-response' };
  }
  if (preds.length === 0) {
    return { valid: false, reason: 'no-predictions' };
  }
  const isDetection = preds.some(function(p) {
    return typeof p.x === 'number' && typeof p.y === 'number';
  });
  if (isDetection) {
    const ok = preds.some(function(p) { return (p.confidence || 0) >= PALAY_MIN_CONFIDENCE; });
    return ok ? { valid: true } : { valid: false, reason: 'low-confidence' };
  }
  const top = preds.reduce(function(a, b) {
    return ((b.confidence || 0) > (a.confidence || 0) ? b : a);
  }, preds[0]);
  const confidence = Number(top.confidence) || 0;
  if (confidence < PALAY_MIN_CONFIDENCE) {
    return { valid: false, reason: 'low-confidence' };
  }
  return { valid: true };
}

function scoreFromConfidence(c) {
  return Math.max(0, Math.min(100, Math.round((c || 0) * 100)));
}

/* MATCH RENDERING */
function renderMatchResult(result) {
  $('matchEmpty').hidden = true;
  $('analysisSection').hidden = false;
  $('analysisLoading').hidden = true;
  $('analysisError').hidden = true;

  const score = scoreFromConfidence(result.confidence);
  $('matchClassValue').textContent = result.classLabel || 'Unknown';
  $('matchConfidenceValue').textContent = score + '/100 confidence';
  $('matchBadge').textContent = score >= 80 ? 'High match' : score >= 55 ? 'Moderate match' : 'Low confidence';

  $('analysisConfidence').textContent = ((result.confidence || 0) * 100).toFixed(1) + '%';
  $('analysisScore').textContent = score + '/100';

  const moistLabel = result.moisture === 'dry' ? 'Dry'
    : result.moisture === 'moderate' ? 'Borderline'
    : result.moisture === 'wet' ? 'Moisture' : 'Unknown';
  $('analysisMoisture').textContent = moistLabel;
  $('analysisMoisture').className = 'analysis-val ' + (result.moisture === 'dry' ? '' : 'warn');

  const factor = MOISTURE_MULTIPLIER[result.moisture] || 1.00;
  $('analysisFactor').textContent = '×' + factor.toFixed(2);

  let note;
  if (result.moisture === 'dry') {
    note = 'Your palay appears dry. Prices reflect 100% of each buyer\\'s base rate.';
  } else if (result.moisture === 'moderate') {
    note = 'Slight moisture detected. Prices shown at ×' + factor.toFixed(2) + ' of base rate. Only buyers equipped to handle borderline grain are listed.';
  } else if (result.moisture === 'wet') {
    note = 'Moisture detected. Prices shown at ×' + factor.toFixed(2) + ' of base rate. Only buyers accepting wet palay are listed. Drying further will improve offers.';
  } else {
    note = 'The model could not confidently classify this image. Defaulting to dry pricing.';
  }
  $('analysisNote').textContent = note;
}

function showMatchLoading() {
  $('matchEmpty').hidden = true;
  $('analysisSection').hidden = true;
  $('analysisLoading').hidden = false;
  $('analysisError').hidden = true;
}

function showMatchError(message, title, type) {
  lastErrorType = type || 'generic';
  $('matchEmpty').hidden = true;
  $('analysisLoading').hidden = true;
  $('analysisSection').hidden = true;
  $('analysisError').hidden = false;
  $('analysisErrorLabel').textContent = title || 'Analysis Unavailable';
  $('analysisErrorMsg').textContent = message || 'The model could not analyze this image.';
  if (type === 'not-palay') {
    $('retryAnalysisBtn').textContent = 'Try another photo';
    $('skipAnalysisBtn').textContent = 'Continue anyway';
  } else {
    $('retryAnalysisBtn').textContent = 'Retry Analysis';
    $('skipAnalysisBtn').textContent = 'Continue as Dry';
  }
}

/* IMAGE RESIZE */
function resizeDataUrl(dataUrl, maxDim) {
  maxDim = maxDim || 1024;
  return new Promise(function(resolve, reject) {
    const img = new Image();
    img.onload = function() {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      c.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(c.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = function() { reject(new Error('Could not load image')); };
    img.src = dataUrl;
  });
}

/* ANALYSIS FLOW */
function analyzeImage(dataUrl) {
  lastImageDataUrl = dataUrl;
  showMatchLoading();
  showScreen('match');
  shutterBtn.disabled = true;
  uploadBtn.disabled = true;

  return resizeDataUrl(dataUrl, 1024).then(function(small) {
    const controller = new AbortController();
    const timeout = setTimeout(function() { controller.abort(); }, 25000);
    return fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: small }),
      signal: controller.signal
    }).then(function(resp) {
      clearTimeout(timeout);
      if (!resp.ok) {
        return resp.json().catch(function() { return {}; }).then(function(errBody) {
          throw new Error(errBody.error || ('Analysis failed (' + resp.status + ')'));
        });
      }
      return resp.json();
    });
  }).then(function(data) {
    console.log('Roboflow response:', data);

    const validation = validatePalayImage(data);
    if (!validation.valid) {
      analysisResult = null;
      activeMoisture = null;
      activeFactor = 1.00;

      if (validation.reason === 'bad-response') {
        showMatchError(
          'The analysis service returned an unexpected response. Please try again.',
          'Analysis Unavailable',
          'generic'
        );
      } else if (validation.reason === 'no-predictions') {
        showMatchError(
          'No palay grains were detected in this photo. Make sure the image clearly shows rice/palay grains on a neutral background.',
          'Not a palay sample',
          'not-palay'
        );
      } else {
        showMatchError(
          'This image doesn\\u2019t look like a clear palay sample. Please try a closer, brighter photo that focuses on the grains.',
          'Not a palay sample',
          'not-palay'
        );
      }
      shutterBtn.disabled = false;
      uploadBtn.disabled = false;
      renderHomeStats();
      return;
    }

    const result = parseRoboflowResult(data);
    analysisResult = result;
    activeMoisture = result.moisture;
    activeFactor = MOISTURE_MULTIPLIER[result.moisture] || 1.00;
    renderMatchResult(result);
    unlockMillers();
    renderRecommended();
    renderHomeStats();
  }).catch(function(err) {
    console.error('Analysis error:', err);
    showMatchError(err.message || 'Analysis failed.', 'Analysis Unavailable', 'generic');
    shutterBtn.disabled = false;
    uploadBtn.disabled = false;
  });
}

/* UNLOCK MILLERS */
function unlockMillers() {
  millersUnlocked = true;
  $('filterTabs').style.display = 'flex';
  $('millerList').innerHTML = '<div class="empty-state">Resolving location…</div>';
  shutterBtn.disabled = false;
  uploadBtn.disabled = false;
  filterAndShowMillers(parseFloat($('radiusSlider').value));
  renderScanPreview();
  renderNearbyTrades();
}

/* ELIGIBILITY & PRICE */
function millerEligible(m, moisture) {
  if (!moisture || moisture === 'dry' || moisture === 'unknown') return true;
  return !!m.acceptsWet;
}
function estimatedPrice(m, factor) {
  return Math.round(m.priceDry * factor * 100) / 100;
}

/* RENDER MILLERS */
function filterAndShowMillers(radiusKm) {
  if (!millersUnlocked || userLat === null) return;
  if (!markersLayer) return;
  markersLayer.clearLayers();
  const moisture = activeMoisture || 'dry';
  const factor = activeFactor;
  const moistureLabel = moisture === 'wet' ? 'wet' : moisture === 'moderate' ? 'borderline' : 'dry';

  const allWithDist = MILLERS
    .map((m) => Object.assign({}, m, { distance: haversineKm(userLat, userLng, m.lat, m.lng) }))
    .sort((a, b) => a.distance - b.distance);

  const pool = filterMode === 'all' ? allWithDist : allWithDist.filter((m) => m.distance <= radiusKm);
  const eligible = pool.filter((m) => millerEligible(m, moisture));
  eligible.sort((a, b) => {
    const pa = estimatedPrice(a, factor), pb = estimatedPrice(b, factor);
    if (pb !== pa) return pb - pa;
    return a.distance - b.distance;
  });

  let noteText = null;
  if (filterMode === 'nearby' && pool.length === 0) {
    noteText = (gpsWarning ? gpsWarning + ' ' : '') + 'No millers within ' + radiusKm + ' km. Increase the search radius.';
  } else if (eligible.length === 0) {
    noteText = 'No millers in range accept ' + moistureLabel + ' palay. Dry your grain further or expand the radius.';
  } else if (gpsWarning) {
    noteText = gpsWarning;
  }
  if (noteText) { $('millerNote').textContent = noteText; $('millerNote').classList.add('visible'); }
  else $('millerNote').classList.remove('visible');

  eligible.forEach((m) => {
    L.circleMarker([m.lat, m.lng], {
      radius: 5, color: cssVar('--text'), fillColor: cssVar('--surface'),
      fillOpacity: 1, weight: 1.5
    }).addTo(markersLayer).bindPopup(
      '<strong>' + m.name + '</strong><br>' +
      '<span style="font-size:11px;color:' + cssVar('--text-muted') + ';">' + m.type + ' miller</span><br>' +
      m.address + '<br>' +
      '<span style="font-family:JetBrains Mono,monospace;font-weight:600;">₱' +
        estimatedPrice(m, factor).toFixed(2) + '/kg</span> · ' + m.distance.toFixed(1) + ' km'
    );
  });

  $('listingCount').textContent = eligible.length + ' suitable';
  $('millerList').innerHTML = '';
  if (eligible.length === 0) {
    $('millerList').innerHTML = '<div class="empty-state"><div class="es-icon">📋</div><div>' +
      (pool.length === 0 ? 'No millers within ' + radiusKm + ' km.' : 'No buyers accepting ' + moistureLabel + ' palay here.') +
      '</div></div>';
    return;
  }

  eligible.forEach((m) => {
    const div = document.createElement('div');
    div.className = 'miller-item';
    const typeClass = m.type === 'large' ? 'type-tag large' : 'type-tag';
    const est = estimatedPrice(m, factor);
    const hasDiscount = factor < 0.999;
    const nfaEligible = est >= 23;

    div.innerHTML =
      '<div class="miller-top">' +
        '<span class="miller-name">' + m.name + '</span>' +
        '<span class="' + typeClass + '">' + m.type + '</span>' +
      '</div>' +
      '<div class="miller-info">' +
        m.address +
        '<span class="dot">·</span>' + (m.contact || '—') +
        '<span class="dot">·</span><span class="dist">' + m.distance.toFixed(1) + ' KM</span>' +
      '</div>' +
      '<div class="miller-bottom">' +
        '<div class="price-block">' +
          '<span class="trade-price"><span class="c">₱</span>' + est.toFixed(2) + '<span class="u">/KG EST.</span></span>' +
          (hasDiscount ? '<span style="font-family:JetBrains Mono,monospace;font-size:11px;color:var(--text-faint);text-decoration:line-through;">₱' + m.priceDry.toFixed(2) + '</span>' : '') +
        '</div>' +
        (nfaEligible ? '<span class="nfa-badge">NFA-Competitive</span>' : '') +
      '</div>';
    $('millerList').appendChild(div);
  });
}

function renderRecommended() {
  if (!userLat) return;
  const moisture = activeMoisture || 'dry';
  const factor = activeFactor;
  const recommendations = MILLERS
    .map((m) => Object.assign({}, m, { distance: haversineKm(userLat, userLng, m.lat, m.lng) }))
    .filter((m) => millerEligible(m, moisture))
    .sort((a, b) => estimatedPrice(b, factor) - estimatedPrice(a, factor))
    .slice(0, 3);

  $('recommendedList').innerHTML = recommendations.map((m) => {
    const est = estimatedPrice(m, factor);
    return '<div class="trade-item">' +
      '<div class="trade-top">' +
        '<span class="trade-tag">' + (m.type === 'large' ? 'Large mill' : 'Small mill') + '</span>' +
        (est >= 23 ? '<span class="nfa-badge">NFA-Competitive</span>' : '') +
      '</div>' +
      '<h3 class="trade-name">' + m.name + '</h3>' +
      '<div class="trade-meta">' + m.address +
        '<span class="dot">·</span>' + m.contact +
        '<span class="dot">·</span><span style="font-family:JetBrains Mono,monospace;font-size:12px;font-weight:600;">' + m.distance.toFixed(1) + ' km</span>' +
      '</div>' +
      '<div class="trade-bottom">' +
        '<div class="trade-price"><span class="c">₱</span>' + est.toFixed(2) + '<span class="u">/KG EST.</span></div>' +
        '<button class="trade-action" type="button">View offer</button>' +
      '</div>' +
    '</div>';
  }).join('') || '<div class="empty-state">No recommendations available.</div>';
}

function renderScanPreview() {
  if (!userLat) return;
  const factor = activeFactor;
  const moisture = activeMoisture || 'dry';
  const preview = MILLERS
    .filter((m) => millerEligible(m, moisture))
    .slice(0, 2);
  $('scanPreviewList').innerHTML = preview.map((m) => {
    const est = estimatedPrice(m, factor);
    return '<div class="trade-item">' +
      '<div class="trade-top">' +
        '<span class="trade-tag">' + (m.type === 'large' ? 'Large mill' : 'Small mill') + '</span>' +
        (est >= 23 ? '<span class="nfa-badge">NFA-Competitive</span>' : '') +
      '</div>' +
      '<h3 class="trade-name">' + m.name + '</h3>' +
      '<div class="trade-meta">' + m.address + '</div>' +
      '<div class="trade-bottom">' +
        '<div class="trade-price"><span class="c">₱</span>' + est.toFixed(2) + '<span class="u">/KG EST.</span></div>' +
      '</div>' +
    '</div>';
  }).join('') || '<div class="empty-state">Scan a sample to preview matching buyers.</div>';
}

/* AREA RENDERING */
function renderAreaSummary(km) {
  if (userLat === null) {
    $('areaRange').textContent = '—';
    $('areaSub').textContent = '—';
    return;
  }
  const factor = activeFactor;
  const inRadius = MILLERS
    .map((m) => Object.assign({}, m, { distance: haversineKm(userLat, userLng, m.lat, m.lng) }))
    .filter((m) => m.distance <= km);

  if (inRadius.length === 0) {
    $('areaRange').textContent = '—';
    $('areaSub').textContent = 'No millers within ' + km + ' km';
    return;
  }
  const prices = inRadius.map((m) => estimatedPrice(m, factor));
  const min = Math.min.apply(null, prices);
  const max = Math.max.apply(null, prices);
  $('areaRange').textContent = '₱' + min.toFixed(2) + ' – ₱' + max.toFixed(2);
  $('areaSub').textContent = inRadius.length + ' millers within ' + km + ' km · per kg';
}

function renderAreaList(km) {
  if (userLat === null) return;
  const factor = activeFactor;
  const regions = {};
  MILLERS.forEach((m) => {
    const dist = haversineKm(userLat, userLng, m.lat, m.lng);
    if (dist > km) return;
    const region = m.address.split(',').pop().trim();
    if (!regions[region]) regions[region] = [];
    regions[region].push(estimatedPrice(m, factor));
  });

  const sorted = Object.entries(regions).sort((a, b) => b[1].length - a[1].length).slice(0, 6);
  if (sorted.length === 0) {
    $('areaList').innerHTML = '<div class="empty-state">No market areas within ' + km + ' km.</div>';
    return;
  }
  $('areaList').innerHTML = sorted.map(([region, prices]) => {
    const min = Math.min.apply(null, prices);
    const max = Math.max.apply(null, prices);
    return '<div class="area-item">' +
      '<div class="area-item-top">' +
        '<span class="area-item-name">' + region + '</span>' +
        '<span class="area-item-count">' + prices.length + ' millers</span>' +
      '</div>' +
      '<div class="area-item-prices">' +
        '<div class="area-price-cell"><span class="area-price-label">Low</span><span class="area-price-val">₱' + min.toFixed(2) + '</span></div>' +
        '<div class="area-price-cell"><span class="area-price-label">High</span><span class="area-price-val">₱' + max.toFixed(2) + '</span></div>' +
      '</div>' +
    '</div>';
  }).join('');
}

/* SHUTTER */
shutterBtn.addEventListener('click', () => {
  if (shutterBtn.dataset.state === 'captured') {
    resetCaptureUI();
    setCameraMode(cameraMode);
    return;
  }

  if (cameraMode === 'esp32') {
    if (!esp32Stream.naturalWidth) return;
    try {
      canvas.width = esp32Stream.naturalWidth;
      canvas.height = esp32Stream.naturalHeight;
      canvas.getContext('2d').drawImage(esp32Stream, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      photoPreview.src = dataUrl;
      photoPreview.style.display = 'block';
      esp32Stream.style.display = 'none';
      cameraPlaceholder.classList.add('hidden');
      shutterBtn.dataset.state = 'captured';
      shutterBtn.innerHTML = 'Retake Photograph';
      analyzeImage(dataUrl);
    } catch (err) {
      if (err.name === 'SecurityError') {
        streamOverlayTitle.textContent = 'Cannot capture — CORS missing';
        streamOverlayMsg.innerHTML =
          'Your ESP32 sketch must reply with <code>Access-Control-Allow-Origin: *</code> ' +
          'on the <code>/stream</code> endpoint for the browser to allow canvas capture. ' +
          'Add it to <code>handleStream()</code> and reflash.';
        streamOverlay.classList.add('visible');
        cameraPlaceholder.classList.add('hidden');
      } else {
        console.error('Capture failed:', err);
      }
    }
    return;
  }

  if (!video.srcObject) return;
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
  photoPreview.src = dataUrl;
  photoPreview.style.display = 'block';
  video.style.display = 'none';
  cameraPlaceholder.classList.add('hidden');
  shutterBtn.dataset.state = 'captured';
  shutterBtn.innerHTML = 'Retake Photograph';
  analyzeImage(dataUrl);
});

/* UPLOAD */
uploadBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { alert('Please select an image file.'); return; }
  const reader = new FileReader();
  reader.onload = (ev) => {
    photoPreview.src = ev.target.result;
    photoPreview.style.display = 'block';
    if (cameraMode === 'esp32') esp32Stream.style.display = 'none';
    else video.style.display = 'none';
    cameraPlaceholder.classList.add('hidden');
    shutterBtn.dataset.state = 'captured';
    shutterBtn.innerHTML = 'Retake Photograph';
    analyzeImage(ev.target.result);
  };
  reader.readAsDataURL(file);
  fileInput.value = '';
});

/* ERROR ACTIONS */
$('retryAnalysisBtn').addEventListener('click', () => {
  if (lastErrorType === 'not-palay') {
    resetCaptureUI();
    showScreen('scan');
    if (cameraMode === 'device') startDeviceCamera();
    else connectEsp32Stream();
  } else if (lastImageDataUrl) {
    analyzeImage(lastImageDataUrl);
  }
});
$('skipAnalysisBtn').addEventListener('click', () => {
  activeMoisture = 'dry';
  activeFactor = 1.00;
  analysisResult = { moisture: 'dry', classLabel: 'Assumed dry', confidence: 0 };
  renderMatchResult(analysisResult);
  unlockMillers();
  renderRecommended();
  renderHomeStats();
});

/* FILTER TABS */
document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    filterMode = tab.dataset.mode;
    if (millersUnlocked) filterAndShowMillers(parseFloat($('radiusSlider').value));
  });
});

/* HOME BUTTONS */
$('homeSellBtn').addEventListener('click', () => showScreen('listings'));
$('homeScanBtn').addEventListener('click', () => showScreen('scan'));

/* MAP THEME REDRAW */
function redrawMapStyle() {
  if (!map) return;
  const primary = cssVar('--primary');
  const text = cssVar('--text');
  const surface = cssVar('--surface');
  if (radiusCircle) radiusCircle.setStyle({ color: primary, fillColor: primary });
  if (userMarker) userMarker.setStyle({ color: primary, fillColor: primary });
  if (markersLayer) markersLayer.eachLayer((layer) => layer.setStyle({ color: text, fillColor: surface }));
}

/* BOOT */
setCameraMode('esp32');
requestGPS();
renderHomeStats();
renderMarketPulse();
renderNearbyTrades();
</script>
</body>
</html>
`;

app.get('/', (req, res) => res.type('html').send(HTML_PAGE));
app.get('/api/millers', (req, res) => res.json(MILLERS));
app.get('/health', (req, res) => res.json({ status: 'ok', millers: MILLERS.length, esp32: ESP32_STREAM_URL }));

app.listen(PORT, () => {
  console.log('Rice Miller Registry → http://localhost:' + PORT);
  console.log('  ' + MILLERS.length + ' millers loaded.');
  console.log('  ESP32-CAM stream default: ' + ESP32_STREAM_URL);
  console.log('  Non-palay detection: ON (min confidence ' + 0.35 + ')');
});