# Установка и тестирование расширения (локально)

Proximate направляет выбранные рабочие сервисы через настроенный прокси-профиль. Остальной трафик идёт напрямую.

---

## 1. Установка в Chrome

1. Открыть `chrome://extensions`
2. Вверху справа включить **Developer mode** (**Режим разработчика**)
3. Нажать **Load unpacked** (**Загрузить распакованное**)
4. В диалоге — `⌘⇧G` → вставить путь:
   ```
   /path/to/proximate/browser-extension/extension
   ```
5. **Выбрать**
6. Закрепить иконку: клик на пазл в toolbar → булавка возле «Proximate»

Проверить: на карточке расширения нет блока **Errors**.

---

## 2. Прокси через Happ (macOS)

Happ при запущенной VLESS-конфигурации открывает локальные inbound-прокси:

| Протокол | Адрес | Порт |
|---|---|---|
| SOCKS5 | `127.0.0.1` | `10808` |
| HTTP   | `127.0.0.1` | `10809` |

**Проверить что Happ слушает и роутит через сервер:**
```bash
curl -s --max-time 10 --socks5-hostname 127.0.0.1:10808 https://ipinfo.io/json \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(f\"IP={d.get('ip')} country={d.get('country')} org={d.get('org')}\")"
```
Должен показать IP вашего прокси и страну выхода, например `203.0.113.10 country=DE`.

---

## 3. Настройка расширения

1. Клик по иконке → шестерёнка **⚙ (Open settings)**
2. Заполнить:
   - **Protocol**: `SOCKS5`
   - **Host**: `127.0.0.1`
   - **Port**: `10808`
   - **Username / Password**: пусто
3. **Test proxy** — ожидается `✓ Proxy reachable · IP 203.0.113.10 · Country DE · ~500 ms`
4. **Back** (стрелка влево)
5. Включить **master toggle** (верхний тумблер)
6. Включить карточку нужного сервиса (Gemini / ChatGPT / Claude / …)

---

## 4. Проверка работы

### Что должно работать
- Иконка расширения зелёная («routed») на странице активного preset-а
- Иконка серая/синяя («direct») на остальных сайтах
- `https://gemini.google.com` открывается без геоблока
- Клик по иконке показывает host + country + latency

### Чистый тест split-routing
Важно: **выключить системный туннельный режим в Happ** (TUN / system-wide). Должен остаться только inbound-proxy на 10808.

- Открыть `https://ipinfo.io` — должен быть **твой реальный IP** (не DE)
- Открыть `https://gemini.google.com/app` → расширение маршрутизирует через прокси → Google видит DE IP и пускает
- Проверить одновременно: на gemini работает, на обычных сайтах — твой локальный IP

Если в Happ стоит TUN-mode — весь трафик уйдёт через системный туннель вне зависимости от расширения, и тест не покажет split.

---

## 5. Отладка

### Лог service worker
`chrome://extensions` → карточка Proximate → **Inspect views: service worker** → DevTools Console.

### Ошибки расширения
`chrome://extensions` → если есть блок **Errors** — открыть, посмотреть стектрейс.

### Проверка что прокси вообще отвечает
```bash
# SOCKS5 через Happ
curl -s --max-time 5 --socks5-hostname 127.0.0.1:10808 https://ipinfo.io/json

# HTTP через Happ
curl -s --max-time 5 -x http://127.0.0.1:10809 https://ipinfo.io/json
```

### Перезагрузка расширения после правки кода
`chrome://extensions` → на карточке кнопка ⟳ (reload).

---

## Состав проекта

```
browser-extension/
├── extension/            # то, что грузится в Chrome
│   ├── manifest.json
│   ├── background.js     # service worker
│   ├── lib/              # pac.js, proxy.js, storage.js, domain.js, presets.js, icon.js
│   ├── popup/            # UI (html/css/js)
│   └── icons/
├── tests/                # node --test (npm test)
├── docs/                 # пользовательская документация
├── package.json
├── README.md
└── INSTALL.md            # этот файл
```

## Пресеты по умолчанию
Gemini, AI Studio, NotebookLM, Google Labs, ChatGPT, Claude, Perplexity, Grok, ElevenLabs. Google Auth (accounts.google.com) подключается автоматически при включении любого Google-AI сервиса.
