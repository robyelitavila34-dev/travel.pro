// src/script/currency.js

const CurrencyAPI = {
  // Valores de respaldo estimados (por 1 unidad de la moneda local)
  _staticFallbacks: {
    COP: { USD: 0.00025, EUR: 0.00023, GBP: 0.00020 },
    MXN: { USD: 0.052, EUR: 0.048, GBP: 0.041 },
    ARS: { USD: 0.0025, EUR: 0.0023, GBP: 0.0020 },
    BRL: { USD: 0.19, EUR: 0.18, GBP: 0.15 },
    PEN: { USD: 0.26, EUR: 0.24, GBP: 0.21 },
  },

  async fetchConversion(targetCurrency) {
    if (!targetCurrency) return null;

    const targets = ['USD', 'EUR', 'GBP'];

    const tryFrankfurter = async () => {
      const url = `https://api.frankfurter.dev/v1/latest?from=${encodeURIComponent(targetCurrency)}&to=${targets.join(',')}`;
      try {
        const response = await fetch(url);
        if (!response.ok) return null;
        const data = await response.json();
        if (data && data.rates && Object.keys(data.rates).length) {
          return { base: data.base || targetCurrency, date: data.date, rates: data.rates };
        }
      } catch (err) {
        console.warn('Frankfurter API falló:', err);
      }
      return null;
    };

    const tryExchangeRateHost = async () => {
      const url = `https://api.exchangerate.host/latest?base=${encodeURIComponent(targetCurrency)}&symbols=${targets.join(',')}`;
      try {
        const response = await fetch(url);
        if (!response.ok) return null;
        const data = await response.json();
        if (data && data.rates && Object.keys(data.rates).length) {
          return { base: data.base || targetCurrency, date: data.date, rates: data.rates };
        }
      } catch (err) {
        console.warn('ExchangeRate.host API falló:', err);
      }
      return null;
    };

    // Intentar Frankfurter primero, luego exchangerate.host como fallback
    const frank = await tryFrankfurter();
    if (frank) return { ...frank, source: 'frankfurter' };
    const host = await tryExchangeRateHost();
    if (host) return { ...host, source: 'exchangerate.host' };

    // Si existen valores de respaldo estáticos, devolverlos como 'fallback'
    const fallback = this._staticFallbacks[targetCurrency];
    if (fallback) return { base: targetCurrency, date: new Date().toISOString().split('T')[0], rates: fallback, source: 'fallback' };

    return null;
  },

  render(exchangeData, targetCurrency) {
    const container = document.getElementById('mod-currency');
    if (!container) return;

    const currencyTargets = ['USD', 'EUR', 'GBP'];

    // Si no nos pasan targetCurrency, intentar leer la base desde la respuesta
    const base = targetCurrency || exchangeData?.base || 'N/A';
    const rates = exchangeData?.rates || {};
    const source = exchangeData?.source || null;

    const rows = currencyTargets.map((code) => {
      const rate = code === base ? 1 : rates[code] ?? null;
      const displayValue = rate !== null ? (100 * rate).toFixed(2) : 'N/A';
      return `
        <div class="info-item">
          <span>100 ${base} equivalen a:</span>
          <span>${displayValue} ${code}</span>
        </div>`;
    });

    if (!exchangeData || Object.keys(rates).length === 0) {
      container.innerHTML = `
        <h2>Conversión Monetaria</h2>
        <div style="background: #fefce8; border: 1px dashed #fbbf24; padding: 15px; border-radius: 8px; color: #92400e; font-size: 0.9rem;">
          No se pudo obtener cotización en tiempo real para <b>${base}</b>. Mostrando equivalencias de respaldo.
        </div>
        ${rows.join('')}
      `;
      return;
    }

    // Si vienen de fallback estático, indicar que son estimadas
    const footer = source === 'fallback' ? `<div style="font-size:0.85rem;color:var(--text-muted);margin-top:10px;">Valores estimados (respaldo local)</div>` : '';

    container.innerHTML = `
      <h2>Conversión Monetaria</h2>
      ${rows.join('')}
      ${footer}
    `;
  },
};

window.CurrencyAPI = CurrencyAPI;