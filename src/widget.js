const API_URL = "https://api.sharkeyes.dev/api/v1/verify";
const TOKEN_URL = "https://api.sharkeyes.dev/api/v1/token";



function detectBrowser() {
    let engine = "unknown";
    let brand = "unknown";

    // ---------- ENGINE ----------
    // Gecko (Firefox)
    if (typeof InstallTrigger !== "undefined") {
        engine = "gecko";
        brand = "firefox";
    }

    // WebKit (Safari)
    else if (
        typeof safari !== "undefined" &&
        safari.pushNotification &&
        safari.pushNotification.toString() === "[object SafariRemoteNotification]"
    ) {
        engine = "webkit";
        brand = "safari";
    }

    // Chromium family
    else if (
        window.chrome &&
        typeof window.chrome === "object"
    ) {
        engine = "chromium";

        // ---------- BRAND (Chromium) ----------

        // Brave
        if (
            navigator.brave &&
            typeof navigator.brave.isBrave === "function"
        ) {
            brand = "brave";
        }

        // Opera
        else if (
            window.opr &&
            window.opr.addons
        ) {
            brand = "opera";
        }

        // Edge (Chromium)
        else if (
            window.StyleMedia
        ) {
            brand = "edge";
        }

        // Chrome
        else if (
            window.chrome.loadTimes ||
            window.chrome.runtime
        ) {
            brand = "chrome";
        }

        // Чистый Chromium / Playwright / кастом
        else {
            brand = "chromium";
        }
    }

    // ---------- EXTRA FLAGS (полезно для антибота) ----------
    const automation = {
        webdriver: navigator.webdriver === true,
        permissionsAnomaly:
            navigator.permissions &&
            navigator.permissions.query
                ? false
                : true,
        pluginsEmpty:
            navigator.plugins && navigator.plugins.length === 0,
    };

    return {
        engine,      // chromium | gecko | webkit | unknown
        brand,       // chrome | edge | opera | brave | chromium | firefox | safari
        automation   // сигналы (НЕ вердикт)
    };
}

// ============================================
// === ОСТАЛЬНЫЕ ФУНКЦИИ ===
// ============================================

async function getServerToken() {
  // запросит токен у сервера; сервер при этом может выставить cookie (HttpOnly) в ответе
  try {
    const res = await fetch(TOKEN_URL, { credentials: 'include' }); // include чтобы получить cookie
    if (!res.ok) return null;
    const data = await res.json()
    return data.token;
  } catch (err) {
    return null;
  }
}

async function collectClientFingerprints() {
  const nav = navigator || {};
  const perm = {};
  
  try {
    const p = navigator.permissions;
    if (p) {
      const perms = ['camera','microphone','geolocation','notifications'];
      for (const name of perms) {
        try {
          const q = await p.query({name});
          perm[name] = q.state;
        } catch { perm[name] = 'unknown'; }
      }
    }
  } catch (e) {}

  // touch + pointer info
  const touch = ('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
  let webglInfo = null;
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const dbgInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (dbgInfo) {
          webglInfo = {
            vendor: gl.getParameter(dbgInfo.UNMASKED_VENDOR_WEBGL),
            renderer: gl.getParameter(dbgInfo.UNMASKED_RENDERER_WEBGL)
          };
        } else {
          webglInfo = {
            vendor: gl.getParameter(gl.VENDOR),
            renderer: gl.getParameter(gl.RENDERER)
          };
        }
      }
    } catch (e) {
      webglInfo = { error: e.message };
    }

    let storageTest = false;
    try {
      localStorage.setItem("__shk_test", "1");
      storageTest = localStorage.getItem("__shk_test") === "1";
      localStorage.removeItem("__shk_test");
    } catch(e) {
      storageTest = false;
    }
    const isPlaywrightFlag = (() => {
      try {
        // 1. Явные глобальные объекты/имена, которые оставляет Playwright
        if (window._playwright) return true;
        if (window.__playwright) return true;
        if (window.__pw) return true;
        if (window.__pw_manual) return true;
        if (window.__PW_INSTANCE) return true;
        if (window.__PLAYWRIGHT_EVALUATION__) return true;

        // 2. Проверка через Object.getOwnPropertyNames - Playwright может добавлять скрытые свойства
        const windowProps = Object.getOwnPropertyNames(window);
        if (windowProps.some(p => /playwright|__pw|__PW/i.test(p))) return true;

        // 3. Проверка на наличие DevTools Protocol в window
        if (window.chrome && window.chrome.runtime && window.chrome.runtime.onConnect) {
          try {
            const runtimeId = window.chrome.runtime.id;
            if (!runtimeId || runtimeId.length < 10) {
              if (!window.chrome.runtime.getManifest) return true;
            }
          } catch(e) {}
        }

        // 4. Проверка на патчи в Function.prototype
        const funcString = Function.prototype.toString.toString();
        if (funcString.indexOf('[native code]') === -1 && funcString.length < 100) {
          return true;
        }

        // 5. Проверка на отсутствие типичных браузерных свойств
        if (!window.Notification) return true;

        // 6. Проверка на типичные артефакты DevTools Protocol
        try {
          if (window.navigator && !window.navigator.webdriver && navigator.webdriver) return true;
        } catch(e) {}

        // 7. Проверка на типичные свойства navigator
        if (navigator.__proto__ && Object.keys(navigator.__proto__).length < 10) return true;

        // 8. Проверка на отсутствие window.chrome
        if (!window.chrome && !window.safari && navigator.userAgent.includes('Chrome')) {
          if (!window.chrome && navigator.vendor === 'Google Inc.') return true;
        }

        // 9. Проверка Permission API
        try {
          const perms = navigator.permissions;
          if (perms) {
            const query = perms.query.toString();
            if (query.indexOf('[native code]') === -1) return true;
          }
        } catch(e) {}

        // 10. Проверка Object.getOwnPropertyDescriptor
        try {
          const desc = Object.getOwnPropertyDescriptor;
          const descString = desc.toString();
          if (descString.indexOf('[native code]') === -1) return true;
        } catch(e) {}

        // 11. Проверка на "Playwright" в UA
        if (typeof navigator.userAgent === 'string' && /playwright/i.test(navigator.userAgent)) return true;

        // 12. Проверка webdriver флага
        if (navigator.webdriver === true) return true;

        // 13. Проверка document
        try {
          if (document.documentElement && document.documentElement.getAttribute('webdriver')) return true;
        } catch(e) {}

        // 14. Проверка типичных браузерных методов
        if (typeof window.Blob === 'undefined') return true;
        if (typeof window.FileReader === 'undefined') return true;

        // 15. Проверка performance API
        try {
          const perfEntries = performance.getEntriesByType('navigation');
          if (perfEntries.length === 0 && document.readyState === 'complete') {
            return true;
          }
        } catch(e) {}

        return false;
      } catch (e) {
        return true;
      }
    })();

  const browserType = detectBrowser();

  return {
    userAgent: nav.userAgent,
    platform: nav.platform,
    languages: nav.languages,
    hwConcurrency: nav.hardwareConcurrency,
    deviceMemory: nav.deviceMemory || null,
    cookieEnabled: nav.cookieEnabled,
    pluginsLength: (navigator.plugins && navigator.plugins.length) || 0,
    webdriver: !!nav.webdriver,
    vendor: nav.vendor || null,
    touch,
    permissions: perm,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    hasWindowChrome: !!window.chrome,
    webgl: webglInfo,
    storageTest,
    isPlaywright: isPlaywrightFlag,
    browserType
  };
}

// ============================================
// === ОБРАБОТЧИК СОБЫТИЙ ===
// ============================================

(function(){
  const startTime = performance.now();
  const events = [];
  let lastMove = 0;
  const isHeadless = navigator.webdriver;

  function record(type, e) {
    events.push({
      type,
      t: performance.now() - startTime,
      x: e?.clientX || null,
      y: e?.clientY || null
    });
  }

  window.addEventListener("mousemove", e => {
    const now = performance.now();
    if (now - lastMove > 30) {
      record("mousemove", e);
      lastMove = now;
    }
  }, {passive:true});

  document.addEventListener("click", e => record("click", e));
  document.addEventListener("keydown", e => record("keydown", {}));
  window.addEventListener("scroll", e => record("scroll", {}));
  document.addEventListener("focus", e => record("focus", {}));
  document.addEventListener("blur", e => record("blur", {}));
  document.addEventListener("input", e => record("input", {}));
  document.addEventListener("touchstart", e => record("touchstart", e));
  document.addEventListener("touchend", e => record("touchend", e));
  document.addEventListener("touchmove", e => record("touchmove", e));
  document.addEventListener("paste", e => record("paste", {}));

  // === ОБРАБОТЧИК ОТПРАВКИ ФОРМЫ ===
  document.addEventListener("submit", async function(e){
    const form = e.target;
    if (!form.hasAttribute("data-sharkeyes")) return;

    e.preventDefault();

    // Показываем индикатор загрузки
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
        submitBtn.disabled = true;
    }

    try {
        // 1) запрос токена от сервера
        const token = await getServerToken();

        // 2) соберём расширенную мета-информацию
        const clientInfo = await collectClientFingerprints();

        const meta = {
          time_on_page_ms: Math.round(performance.now() - startTime),
          screen_w: window.screen.width,
          screen_h: window.screen.height,
          pixel_ratio: window.devicePixelRatio || 1,
          inputs_count: form.querySelectorAll("input,textarea,select").length,
          headless: isHeadless,
          screen_vs_window: {
            screenW: window.screen.width,
            screenH: window.screen.height,
            innerW: window.innerWidth,
            innerH: window.innerHeight
          },
          clientInfo
        };


        
        const body = { 
            events, 
            meta, 
            token,
        };

        const res = await fetch(API_URL, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          credentials: 'include',
          body: JSON.stringify(body)
        });

        if (res.ok) {
          form.submit();
        } else {
          const data = await res.json().catch(() => ({}));
          const skyId = data.detail?.sky_id ?? "?";
          const score = data.detail?.score ?? "?";
          showSharkAlert(skyId, score, "https://sharkeyes.dev/");
        }
    } catch (err) {
      console.error("Verification error:", err);
      alert("Verification error. Please try again later.");
    } finally {
        // Восстанавливаем кнопку
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
  });

  // === КАСТОМНЫЙ ALERT ===
  function injectStyles() {
    if (document.getElementById("sharkeyes-alert-style")) return;
    const style = document.createElement("style");
    style.id = "sharkeyes-alert-style";
    style.textContent = `
      .shk-alert {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 0 25px rgba(0,0,0,0.25);
        padding: 20px 25px;
        z-index: 99999;
        font-family: system-ui, sans-serif;
        text-align: center;
        width: 320px;
        animation: fadeIn .3s ease;
      }

      .shk-alert h3 {
        margin: 0 0 10px;
        color: #e53935;
      }

      .shk-alert a {
        color: #1976d2;
        text-decoration: none;
        font-weight: 500;
      }

      .shk-alert a:hover {
        text-decoration: underline;
      }

      .shk-alert button {
        margin-top: 12px;
        background: #1976d2;
        border: none;
        color: white;
        padding: 8px 14px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
      }

      .shk-alert button:hover {
        background: #1565c0;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translate(-50%, -40%); }
        to { opacity: 1; transform: translate(-50%, -50%); }
      }
    `;
    document.head.appendChild(style);
  }

  function showSharkAlert(skyId, score, link) {
    injectStyles();

    const old = document.getElementById("sharkeyes-alert");
    if (old) old.remove();

    const alertBox = document.createElement("div");
    alertBox.id = "sharkeyes-alert";
    alertBox.className = "shk-alert";
    alertBox.innerHTML = `
      <h3>❌ Test Failed</h3>
      <p>Sky ID: <b>${skyId}</b></p>
      <p>Score: <b>${score}</b></p>
      ${link ? `<p><a href="${link}" target="_blank">SharkEyes Security</a></p>` : ""}
      <button>Close</button>
    `;
    alertBox.querySelector("button").onclick = () => alertBox.remove();
    document.body.appendChild(alertBox);
  }

})();