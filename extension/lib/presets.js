// Pure data module. Single source of truth for the preset list.
// When adding a preset: also add it to popup.js render order and to
// docs/screenshots if applicable.

export const PRESET_DEFINITIONS = {
  gemini: {
    label: 'Gemini',
    icon: '✦',
    domains: ['gemini.google.com'],
    isAi: true,
  },
  aiStudio: {
    label: 'AI Studio',
    icon: '◆',
    domains: [
      'aistudio.google.com',
      'alkalimakersuite-pa.clients6.google.com',
    ],
    isAi: true,
  },
  notebookLM: {
    label: 'NotebookLM',
    icon: '❏',
    domains: ['notebooklm.google.com'],
    isAi: true,
  },
  googleLabs: {
    label: 'Google Labs',
    icon: '❖',
    domains: ['labs.google', 'labs.google.com'],
    isAi: true,
  },
  chatgpt: {
    label: 'ChatGPT',
    icon: '◎',
    domains: ['chatgpt.com', 'chat.openai.com'],
    isAi: false,
  },
  claude: {
    label: 'Claude',
    icon: '✱',
    domains: ['claude.ai'],
    isAi: false,
  },
  perplexity: {
    label: 'Perplexity',
    icon: '⬢',
    domains: ['perplexity.ai', 'www.perplexity.ai'],
    isAi: false,
  },
  grok: {
    label: 'Grok',
    icon: '𝕏',
    domains: ['grok.com', 'www.grok.com', 'x.ai'],
    isAi: false,
  },
  elevenlabs: {
    label: 'ElevenLabs',
    icon: '♪',
    domains: ['elevenlabs.io', 'www.elevenlabs.io', 'api.elevenlabs.io'],
    isAi: false,
  },
  youtube: {
    label: 'YouTube',
    icon: '▷',
    domains: ['youtube.com', 'www.youtube.com', 'youtu.be', 'googlevideo.com'],
    isAi: false,
  },
  telegram: {
    label: 'Telegram Web',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.9 4.3 18.6 20q-.37 1.6-1.95.93l-4.4-3.24-2.12 2.04q-.35.35-.72.35l.26-3.66 6.66-6.02q.44-.4-.1-.62l-8.23 5.18-3.55-1.11q-1.55-.48-.03-1.07L20.3 3.13q1.29-.5 1.6 1.17Z"/></svg>',
    domains: ['telegram.org', 'web.telegram.org', 't.me'],
    isAi: false,
  },
  // Hidden preset — auto-routes Google login domains when ANY isAi preset is enabled.
  // Not exposed in UI; managed by pac.js.
  googleAuth: {
    label: 'Google login (auto)',
    icon: '🔐',
    domains: ['accounts.google.com', 'ogs.google.com'],
    isAi: false,
    hidden: true,
  },
};

export const PRESET_ORDER = [
  'gemini',
  'aiStudio',
  'notebookLM',
  'googleLabs',
  'chatgpt',
  'claude',
  'perplexity',
  'grok',
  'elevenlabs',
  'youtube',
  'telegram',
];

export const AI_PRESET_KEYS = Object.entries(PRESET_DEFINITIONS)
  .filter(([_, p]) => p.isAi)
  .map(([k, _]) => k);
