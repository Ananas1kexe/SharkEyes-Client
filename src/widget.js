// === SHARKEYES ANTI-BOT PROTECTION ===
// We care about your privacy and security.
// All data is collected ONLY for bot detection and:
// - Is never shared with third parties
// - Is not used for tracking or analytics
// - Is processed anonymously, without any personal information
// - Is deleted immediately after verification
// Our goal is to make the web safer without compromising your privacy.
// Learn more about our privacy policy: https://sharkeyes.dev/trust/privacy
// Explore the client-side code here: https://github.com/Ananas1kexe/SharkEyes-Client



// --- вверху widget.js, глобально
const API_URL = "https://api.sharkeyes.dev/api/v1/verify";
const TOKEN_URL = "https://api.sharkeyes.dev/api/v1/token";

async function fetchWithTimeout(url, options = {}, timeout = 8000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const res = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        return res;
    } finally {
        clearTimeout(id);
    }
}

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
    const res = await fetch(TOKEN_URL); 
    if (!res.ok) return null;
    const data = await res.json()
    return data.token;
  } catch (err) {
    return null;
  }
}

async function collectClientFingerprints() {
  const nav = navigator || {};
  

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
      // Temporary localStorage availability check.
      // Used to detect restricted or sandboxed environments (e.g. private mode, bots).
      // No user data is stored and the key is removed immediately.

      const key = "sharkeyes_temp_storage_test";

      localStorage.setItem(key, "1");
      storageTest = localStorage.getItem(key) === "1";
      localStorage.removeItem(key);
    } catch(e) {
      storageTest = false;
    }
    const isPlaywrightFlag = (() => {
        try {
            if (window._playwright || window.__playwright || window.__pw) return true;
            if (window.__pw_manual || window.__PW_INSTANCE) return true;
            if (window.__PLAYWRIGHT_EVALUATION__) return true;
            const windowProps = Object.getOwnPropertyNames(window);
            if (windowProps.some(p => /playwright|__pw|__PW/i.test(p))) return true;
            if (navigator.webdriver === true) return true;
            if (typeof navigator.userAgent === 'string' && /playwright/i.test(navigator.userAgent)) return true;
            return false;
        } catch (e) { return true; }
    })();
    const browserType = detectBrowser();

  return {
    userAgent: nav.userAgent,
    webdriver: !!nav.webdriver,
    touch,
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
  const MAX_EVENTS = 150; 
  const events = [];
  let lastMove = 0;
  const isHeadless = navigator.webdriver;
  
  // Interaction counters (no content)
  const interactionStats = {
    mouseMoves: 0,
    clicks: 0,
    keypresses: 0,
    scrolls: 0,
    touches: 0,
    inputs: 0
  };

  // Record ONLY timing and type, NO coordinates or content
  function record(type) {
    if (events.length >= MAX_EVENTS) return;

    const now = performance.now();
    const timeSinceStart = now - startTime;
    
    // Store only timing pattern, not coordinates
    events.push({
      type,
      t: timeSinceStart
      // NO x, y coordinates
      // NO key values
      // NO input content
    });
    
    // Update counters
    if (type === "mousemove") interactionStats.mouseMoves++;
    else if (type === "click") interactionStats.clicks++;
    else if (type === "keydown") interactionStats.keypresses++;
    else if (type === "scroll") interactionStats.scrolls++;
    else if (type.startsWith("touch")) interactionStats.touches++;
    else if (type === "input") interactionStats.inputs++;
  }

  // Mouse movement - NO coordinates stored, just fact of movement
  window.addEventListener("mousemove", () => {
    const now = performance.now();
    if (now - lastMove > 100) { // Throttle to reduce data
      record("mousemove");
      lastMove = now;
    }
  }, {passive:true});

  // Clicks - NO coordinates
  document.addEventListener("click", () => record("click"));
  
  // Keypresses - NO key values or content
  document.addEventListener("keydown", () => record("keydown"));
  
  // Scrolls - NO position
  window.addEventListener("scroll", () => record("scroll"));
  
  // Focus/blur - timing only
  document.addEventListener("focus", () => record("focus"));
  document.addEventListener("blur", () => record("blur"));
  
  // Input - NO content, just fact of input
  document.addEventListener("input", () => record("input"));
  
  // Touch events - NO coordinates
  document.addEventListener("touchstart", () => record("touchstart"));
  document.addEventListener("touchend", () => record("touchend"));
  document.addEventListener("touchmove", () => record("touchmove"));
  
  // Paste - NO content
  document.addEventListener("paste", () => record("paste"));

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
          widget_type: "invisible",
          interaction_stats: interactionStats,
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
          body: JSON.stringify(body)
        });

        if (res.ok) {
          form.submit();
        } else {
          const data = await res.json().catch(() => ({}));
          const skyId = (data.detail?.sky_id ?? data.sky_id) ?? "?";
          const score = (data.detail?.score ?? data.score) ?? "?";
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
      <p>Sky ID: <b id="shk-id-val"></b></p>
      <p>Score: <b id="shk-score-val"></b></p>
      ${link ? `<p><a href="#" id="shk-link" target="_blank">SharkEyes Security</a></p>` : ""}
      <button id="shk-close">Close</button>
    `;

    alertBox.querySelector("#shk-id-val").textContent = skyId;
    alertBox.querySelector("#shk-score-val").textContent = score;
    
    if (link) {
      const linkEl = alertBox.querySelector("#shk-link");
      linkEl.href = link;
    }

    alertBox.querySelector("#shk-close").onclick = () => alertBox.remove();
    document.body.appendChild(alertBox);
  }

})();