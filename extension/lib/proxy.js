// Wraps chrome.proxy.settings.set/clear and chrome.webRequest.onAuthRequired.
// Listener registration is at the top level so it survives service-worker
// sleep — see spec §17.

import { loadState } from './storage.js';
import { buildPacScript } from './pac.js';

// In-memory cache so onAuthRequired can respond without hitting storage.
let cachedProxy = null;

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.state) {
    cachedProxy = changes.state.newValue?.proxy ?? null;
  }
});

/**
 * Apply the current state to chrome.proxy. Pushes a generated PAC script when
 * one is producible, otherwise clears proxy settings entirely.
 */
export async function applyProxy(state) {
  cachedProxy = state?.proxy ?? null;
  const pac = buildPacScript(state);
  if (pac === null) {
    await chrome.proxy.settings.clear({ scope: 'regular' });
    return { applied: false };
  }
  await chrome.proxy.settings.set({
    value: { mode: 'pac_script', pacScript: { data: pac, mandatory: true } },
    scope: 'regular',
  });
  return { applied: true };
}

/**
 * Top-level registration of the proxy auth listener. Runs every time the
 * service worker starts (on install, on browser launch, on wake from sleep).
 * Uses cachedProxy for instant response; cache is warmed on boot via applyProxy.
 */
export function registerAuthListener() {
  chrome.webRequest.onAuthRequired.addListener(
    (details, callback) => {
      if (!details.isProxy) { callback({}); return; }
      const proxy = cachedProxy;
      if (!proxy?.user) { callback({}); return; }
      callback({ authCredentials: { username: proxy.user, password: proxy.pass || '' } });
    },
    { urls: ['<all_urls>'] },
    ['asyncBlocking']
  );
}
