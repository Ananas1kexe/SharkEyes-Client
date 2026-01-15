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



// ============================================
// === SHARKEYES VISIBLE CAPTCHA WIDGET ===
// ============================================

const API_URL = "https://api.sharkeyes.dev/api/v1/verify";
const TOKEN_URL = "https://api.sharkeyes.dev/api/v1/token";

// ============================================
// === КОНФИГУРАЦИЯ И УТИЛИТЫ ===
// ============================================

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

    if (typeof InstallTrigger !== "undefined") {
        engine = "gecko";
        brand = "firefox";
    } else if (
        typeof safari !== "undefined" &&
        safari.pushNotification &&
        safari.pushNotification.toString() === "[object SafariRemoteNotification]"
    ) {
        engine = "webkit";
        brand = "safari";
    } else if (window.chrome && typeof window.chrome === "object") {
        engine = "chromium";

        if (navigator.brave && typeof navigator.brave.isBrave === "function") {
            brand = "brave";
        } else if (window.opr && window.opr.addons) {
            brand = "opera";
        } else if (window.StyleMedia) {
            brand = "edge";
        } else if (window.chrome.loadTimes || window.chrome.runtime) {
            brand = "chrome";
        } else {
            brand = "chromium";
        }
    }

    const automation = {
        webdriver: navigator.webdriver === true,
        permissionsAnomaly: navigator.permissions && navigator.permissions.query ? false : true,
        pluginsEmpty: navigator.plugins && navigator.plugins.length === 0,
    };

    return { engine, brand, automation };
}

async function getServerToken() {
    try {
        const res = await fetch(TOKEN_URL);
        if (!res.ok) return null;
        const data = await res.json();
        return data.token;
    } catch (err) {
        return null;
    }
}

async function collectClientFingerprints() {
    const nav = navigator || {};

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
// === СИСТЕМА СОБЫТИЙ ===
// ============================================
const EventTracker = {
    startTime: performance.now(),
    events: [],
    lastMove: 0,
    isHeadless: navigator.webdriver,
    
    // Interaction counters (no content)
    interactionStats: {
        mouseMoves: 0,
        clicks: 0,
        keypresses: 0,
        scrolls: 0,
        touches: 0,
        inputs: 0
    },

    // Record ONLY timing and type, NO coordinates or content
    record(type) {
        const now = performance.now();
        const timeSinceStart = now - this.startTime;
        
        // Store only timing pattern, not coordinates
        this.events.push({
            type,
            t: timeSinceStart
            // NO x, y coordinates
            // NO key values
            // NO input content
        });
        
        // Update counters
        if (type === "mousemove") this.interactionStats.mouseMoves++;
        else if (type === "click") this.interactionStats.clicks++;
        else if (type === "keydown") this.interactionStats.keypresses++;
        else if (type === "scroll") this.interactionStats.scrolls++;
        else if (type.startsWith("touch")) this.interactionStats.touches++;
        else if (type === "input") this.interactionStats.inputs++;
    },

    init() {
        // Mouse movement - NO coordinates stored, just fact of movement
        window.addEventListener("mousemove", () => {
            const now = performance.now();
            if (now - this.lastMove > 100) { // Throttle to reduce data
                this.record("mousemove");
                this.lastMove = now;
            }
        }, { passive: true });

        // Clicks - NO coordinates
        document.addEventListener("click", () => this.record("click"));
        
        // Keypresses - NO key values or content
        document.addEventListener("keydown", () => this.record("keydown"));
        
        // Scrolls - NO position
        window.addEventListener("scroll", () => this.record("scroll"), { passive: true });
        
        // Focus/blur - timing only
        document.addEventListener("focus", () => this.record("focus"));
        document.addEventListener("blur", () => this.record("blur"));
        
        // Input - NO content, just fact of input
        document.addEventListener("input", () => this.record("input"));
        
        // Touch events - NO coordinates
        document.addEventListener("touchstart", () => this.record("touchstart"));
        document.addEventListener("touchend", () => this.record("touchend"));
        document.addEventListener("touchmove", () => this.record("touchmove"));
        
        // Paste - NO content
        document.addEventListener("paste", () => this.record("paste"));
    },

    getMeta() {
        return {
            time_on_page_ms: Math.round(performance.now() - this.startTime),
            screen_w: window.screen.width,
            screen_h: window.screen.height,
            pixel_ratio: window.devicePixelRatio || 1,
            headless: this.isHeadless,
            widget_type: "visible",
            interaction_stats: this.interactionStats
        };
    }
};


// ============================================
// === VISIBLE CAPTCHA WIDGET CLASS ===
// ============================================

class SharkEyesCaptcha {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            theme: options.theme || 'auto',
            size: options.size || 'normal',
            onSuccess: options.onSuccess || null,
            onError: options.onError || null,
            autoVerify: options.autoVerify !== false,
            language: options.language || 'en'
        };
        
        this.verified = false;
        this.verifying = false;
        this.failed = false; 
        this.token = null;
        
        this.texts = {
            en: {
                initial: "I'm not a robot",
                checking: "Checking your browser",
                verifying: "Verifying",
                success: "Verified",
                error: "Verification failed",
                retry: "Try again"
            },
            ru: {
                initial: "Я не робот",
                checking: "Проверка браузера",
                verifying: "Проверка",
                success: "Проверено",
                error: "Ошибка проверки",
                retry: "Попробовать снова"
            },
            he: {
                initial: "אני לא רובוט",
                checking: "בדיקת דפדפן",
                verifying: "בדיקה",
                success: "מאומת",
                error: "שגיאת אימות",
                retry: "נסה שוב"
            },
            de: {
                initial: "Ich bin kein Roboter",
                checking: "Überprüfung Ihres Browsers",
                verifying: "Überprüfung läuft",
                success: "Bestätigt",
                error: "Überprüfung fehlgeschlagen",
                retry: "Versuchen Sie es erneut"
            },

        };
        
        this.init();
    }

    init() {
        this.injectStyles();
        this.render();
        this.attachEvents();
        
        if (this.options.autoVerify) {
            setTimeout(() => this.verify(), 500);
        }
    }

    // Управление кнопкой формы
    getSubmitButton() {
        const form = this.container.closest('form');
        if (!form) return null;
        return form.querySelector('button[type="submit"], input[type="submit"]');
    }

    toggleButton(disabled) {
        const btn = this.getSubmitButton();
        if (btn) btn.disabled = disabled;
    }

    getTheme() {
        if (this.options.theme === 'auto') {
            return this.options.theme;
            // return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        const supportMatchaMedia = typeof window !== 'undefined' && window.matchMedia;
        const isDark = supportMatchaMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

        return isDark ? "dark": "light";
    }

    injectStyles() {
        if (document.getElementById('sharkeyes-captcha-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'sharkeyes-captcha-styles';
        style.textContent = `
            .sh-captcha {
                background: var(--sh-bg);
                border: 1px solid var(--sh-border);
                border-radius: 12px;
                padding: 16px;
                display: inline-flex;
                align-items: center;
                gap: 14px;
                color: var(--sh-text);
                box-shadow: 0 8px 24px rgba(0,0,0,.12);
                transition: all 0.3s;
                font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
                user-select: none;
            }
            .sh-captcha.sh-compact { padding: 12px; gap: 10px; }
            .sh-captcha.sh-light {
                --sh-bg: #ffffff; --sh-border: #d1d5db; --sh-text: #000000;
                --sh-checkbox-border: #000000; --sh-primary: #7c3aed; --sh-link: #6b7280;
            }
            .sh-captcha.sh-dark {
                --sh-bg: #1f2937; --sh-border: #374151; --sh-text: #f9fafb;
                --sh-checkbox-border: #9ca3af; --sh-primary: #8b5cf6; --sh-link: #9ca3af;
            }
            .sh-captcha.active { border-color: var(--sh-primary); }
            .sh-checkbox {
                width: 22px; height: 22px; min-width: 22px;
                border: 2px solid var(--sh-checkbox-border);
                border-radius: 4px; cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                transition: all 0.3s;
            }
            .sh-checkbox.loading { border-color: var(--sh-primary); }
            .sh-spinner {
                width: 14px; height: 14px; border: 2px solid var(--sh-primary);
                border-top-color: transparent; border-radius: 50%;
                animation: sh-spin 1s linear infinite;
            }
            .sh-checkbox.success { border-color: var(--sh-primary); color: var(--sh-primary); font-size: 14px; }
            .sh-checkbox.error { border-color: #ef4444; color: #ef4444; font-size: 14px; }
            .sh-center { flex: 1; }
            .sh-text { font-size: 14px; font-weight: 500; transition: opacity 0.2s; }
            .sh-text.fade { opacity: 0; }
            .sh-right { text-align: right; font-size: 10px; line-height: 1.3; }
            .sh-brand { font-size: 12px; font-weight: 600; color: var(--sh-primary); text-decoration: none; }
            .sh-links { margin-top: 4px; }
            .sh-links a { color: var(--sh-link); text-decoration: none; }
            @keyframes sh-spin { to { transform: rotate(360deg); } }
            @keyframes sh-checkmark {
                0% { transform: scale(0) rotate(45deg); }
                100% { transform: scale(1) rotate(45deg); }
            }
            .sh-checkmark { animation: sh-checkmark 0.3s ease; }
        `;
        document.head.appendChild(style);
    }

    render() {
        const theme = this.getTheme();
        const sizeClass = this.options.size === 'compact' ? 'sh-compact' : '';
        const lang = this.texts[this.options.language] || this.texts.en;
        
        this.container.innerHTML = `
            <div class="sh-captcha sh-${theme} ${sizeClass}">
                <div class="sh-checkbox" data-sh-cb></div>
                <div class="sh-center">
                    <div class="sh-text" data-sh-t>${lang.initial}</div>
                </div>
                <div class="sh-right">
                    <a href="https://sharkeyes.dev" target="_blank" class="sh-brand">SharkEyes</a>
                    <div class="sh-links">
                        <a href="https://sharkeyes.dev/privacy" target="_blank">Privacy</a> · 
                        <a href="https://sharkeyes.dev/terms" target="_blank">Terms</a>
                    </div>
                </div>
            </div>
        `;
        
        this.elements = {
            captcha: this.container.querySelector('.sh-captcha'),
            cb: this.container.querySelector('[data-sh-cb]'),
            t: this.container.querySelector('[data-sh-t]')
        };
    }

    attachEvents() {
        this.elements.cb.addEventListener('click', () => {
            if (!this.verified && !this.verifying) {
                if (this.failed) this.reset();
                this.verify();
            }
        });
    }

    async verify() {
        if (this.verifying || this.verified) return;

        this.toggleButton(true);
        this.verifying = true;
        this.failed = false;

        const lang = this.texts[this.options.language] || this.texts.en;

        this.elements.captcha.classList.add('active');
        this.elements.cb.innerHTML = `<div class="sh-spinner"></div>`;
        this.elements.t.textContent = lang.checking;

        try {
            // 1. Получаем токен
            this.token = await getServerToken();
            if (!this.token) {
                throw new Error("Token fetch failed");
            }

            // 2. Собираем fingerprint
            const clientInfo = await collectClientFingerprints();
            const meta = EventTracker.getMeta();
            meta.clientInfo = clientInfo;

            // 3. Проверка с таймаутом
            const res = await fetchWithTimeout(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    events: EventTracker.events,
                    meta,
                    token: this.token
                })
            }, 8000);

            // 4. Жёсткая проверка ответа
            if (!res || !res.ok) {
                throw new Error(`Verification failed: ${res?.status || "no response"}`);
            }

            // 5. Успех
            this.onSuccess();

        } catch (err) {
            console.warn("[SharkEyes] verify error:", err);
            this.onError();
        }
    }

    onSuccess() {
        this.verified = true;
        this.verifying = false;
        this.toggleButton(false); // Разблокируем кнопку при успехе
        const lang = this.texts[this.options.language] || this.texts.en;
        this.elements.cb.className = "sh-checkbox success";
        this.elements.cb.innerHTML = `<span class="sh-checkmark">✓</span>`;
        this.elements.t.textContent = lang.success;
        if (this.options.onSuccess) this.options.onSuccess(this.token);
    }

    onError() {
        this.verifying = false;
        this.failed = true;
        this.toggleButton(true); // Оставляем кнопку выключенной при ошибке
        const lang = this.texts[this.options.language] || this.texts.en;
        this.elements.cb.className = "sh-checkbox error";
        this.elements.cb.innerHTML = `<span>✗</span>`;
        this.elements.t.textContent = lang.error;
    }

    reset() {
        this.verified = false;
        this.verifying = false;
        this.failed = false;
        this.toggleButton(false);
        const lang = this.texts[this.options.language] || this.texts.en;
        this.elements.cb.className = "sh-checkbox";
        this.elements.cb.innerHTML = "";
        this.elements.t.textContent = lang.initial;
    }

    isVerified() { return this.verified; }
}

// ============================================
// === ИНИЦИАЛИЗАЦИЯ ===
// ============================================

function initSharkEyes() {
    EventTracker.init();
    const containers = document.querySelectorAll('[data-sharkeyes-captcha]');
    
    containers.forEach(container => {
        const instance = new SharkEyesCaptcha(container, {
            theme: container.getAttribute('data-theme'),
            size: container.getAttribute('data-size'),
            language: container.getAttribute('data-lang'),
            autoVerify: container.getAttribute('data-auto') !== 'false'
        });
        container.__sharkeyesInstance = instance;

        // Жесткая блокировка кнопки при загрузке страницы
        const form = container.closest('form');
        if (form && form.hasAttribute('data-sharkeyes')) {
            const btn = form.querySelector('button[type="submit"], input[type="submit"]');
            if (btn) btn.disabled = true;
        }
    });

    // Глобальный перехват сабмита
    document.addEventListener('submit', function(e) {
        const form = e.target;
        if (!form.hasAttribute('data-sharkeyes')) return;
        const container = form.querySelector('[data-sharkeyes-captcha]');
        const widget = container?.__sharkeyesInstance;

        if (widget && (!widget.isVerified() || widget.failed)) {
            e.preventDefault();
            e.stopImmediatePropagation();
            alert(widget.failed ? 'Verification failed.' : 'Please verify you are human.');
            return false;
        }
    }, true);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initSharkEyes);
else initSharkEyes();

window.SharkEyes = { init: initSharkEyes };