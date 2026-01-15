(function() {
    const API_URL = 'https://api.sharkeyes.dev';
    
    async function solvePoW(challengeData, difficulty, path) {
        return new Promise((resolve) => {
            const workerCode = `
                self.onmessage = async (e) => {
                    const { data, difficulty, path } = e.data;
                    const prefix = "0".repeat(difficulty);
                    let nonce = 0;
                    const encoder = new TextEncoder();
                    while (true) {
                        const msg = encoder.encode(data + ':' + path + ':' + nonce);
                        const hashBuffer = await crypto.subtle.digest('SHA-256', msg);
                        const hashArray = Array.from(new Uint8Array(hashBuffer));
                        const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                        if (hash.startsWith(prefix)) break;
                        nonce++;
                    }
                    self.postMessage(nonce);
                };
            `;
            const blob = new Blob([workerCode], { type: 'application/javascript' });
            const worker = new Worker(URL.createObjectURL(blob));
            worker.postMessage({ data: challengeData, difficulty, path });
            worker.onmessage = (e) => {
                resolve(e.data);
                worker.terminate();
            };
        });
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.querySelector('form[data-pow-protected]');
        if (!form) {
            console.log('Форма с data-pow-protected не найдена');
            return;
        }
        
        console.log('PoW защита инициализирована');
        
        const showError = (msg) => {
            let el = form.querySelector(".pow-error");
            if (!el) {
                el = document.createElement("div");
                el.className = "pow-error";
                el.style.color = "red";
                el.style.marginTop = "5px";
                form.appendChild(el);
            }
            el.textContent = msg;
        };
        
        form.addEventListener("submit", async (e) => {
            console.log('Submit событие, pow статус:', form.dataset.pow);
            
            if (form.dataset.pow === "1") return;
            
            e.preventDefault();
            
            const btn = form.querySelector('[type="submit"]');
            if (btn) btn.disabled = true;
            
            try {
                console.log('Получение PoW challenge...');
                const r = await fetch(`${API_URL}/api/v1/get-pow`);
                
                if (!r.ok) {
                    throw new Error(`HTTP error! status: ${r.status}`);
                }
                
                const c = await r.json();
                console.log('Challenge получен:', c);
                
                console.log('Решение PoW...');
                const nonce = await solvePoW(
                    c.data, 
                    c.difficulty,     
                    form.action ? new URL(form.action).pathname : location.pathname
                );
                console.log('PoW решён, nonce:', nonce);
                
                const h = (n, v) => {
                    let i = form.querySelector(`input[name="${n}"]`);
                    if (!i) {
                        i = document.createElement("input");
                        i.type = "hidden";
                        i.name = n;
                        form.appendChild(i);
                    }
                    i.value = v;
                };
                
                h("pow_id", c.challenge_id);
                h("pow_nonce", nonce);
                
                console.log("Отправка формы с PoW данными");
                
                form.dataset.pow = "1";
                form.requestSubmit();
            } catch (err) {
                if (btn) btn.disabled = false;
                console.error('Ошибка PoW:', err);
                showError("Не удалось пройти проверку безопасности. Попробуйте ещё раз.");
            }
        });
    });
})();