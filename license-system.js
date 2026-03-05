// ============================================
// BUDGETWISE 2.0 - FREEMIUM LICENSE SYSTEM
// ============================================

// === ENV / CANALI (DEV vs BETA) ===
// Obiettivo:
// - DEV: libera per te (niente blocchi / premium sempre attivo)
// - BETA: destinata ai tester (può essere protetta con licenza)
//
// NOTA: non usiamo solo il dominio (gitlab.io) perché sia DEV che BETA possono starci sopra.
// Identifichiamo i canali tramite hostname/path del progetto.
const BW_HOST = (location.hostname || '').toLowerCase();
const BW_PATH = (location.pathname || '').toLowerCase();

const BW_IS_LOCAL = (location.protocol === 'file:' || BW_HOST === 'localhost' || BW_HOST === '127.0.0.1');
const BW_IS_DEV_REPO = (
  BW_PATH.includes('/budgetwise-v2-under-update') ||
  BW_HOST.includes('budgetwise-v2-under-update')
);
const BW_IS_BETA_REPO = (
  BW_PATH.includes('/budgetwise-beta') ||
  BW_HOST.includes('budgetwise-beta')
);

// === DEV BYPASS ===
// Attivo sulla tua copia DEV (anche su GitLab Pages) e in locale.
const BW_DEV_BYPASS = (
  BW_IS_LOCAL ||
  ((BW_HOST.includes('github.io') || BW_HOST.includes('gitlab.io')) && BW_IS_DEV_REPO)
);

if (BW_DEV_BYPASS) {
  console.log('🔓 BudgetWise DEV BYPASS attivo: Premium sbloccato su canale DEV');
  try { document.documentElement.classList.add('bw-dev'); } catch(e) {}
} else if (BW_IS_BETA_REPO) {
  console.log('🧪 BudgetWise canale BETA rilevato: applico regole/licenze beta');
}

class BudgetWiseLicense {

    constructor() {
        // ⚠️ Ordine di init importante: trial + secretKey devono esistere prima di checkPremiumStatus()
        // (checkPremiumStatus() può usare trialStart e validateOfflineLicense() usa secretKey)
        this.licenseKey = localStorage.getItem('bw-license-key') || null;
        this.licenseEmail = localStorage.getItem('bw-license-email') || null;
        this.trialUsed = localStorage.getItem('bw-trial-used') === 'true';
        this.trialStart = localStorage.getItem('bw-trial-start') || null;

        // 🔑 CHIAVE SEGRETA PER LA VALIDAZIONE
        this.secretKey = 'BudgetWise-Mia-Frase-Segreta-2026'; // Cambia con la tua!

        this.isPremium = this.checkPremiumStatus();
        if (BW_DEV_BYPASS) this.isPremium = true;

        // 🆓 LIMITAZIONI FREE VS PREMIUM
        this.limits = {
            free: {
                maxTransactions: 30,
                maxFixedExpenses: 5,
                maxSavingsPercent: 15,
                maxGoals: 1,
                customCategories: false,
                csvImport: false,
                aiAssistant: 'basic',
                voiceRecognition: false,
                cloudSync: false,
                colorCustomization: false,
                dateFormatCustom: false,
                calendarExport: false,
                categoryLearning: false,
                advancedFixedFormat: false
            },
            premium: {
                maxTransactions: Infinity,
                maxFixedExpenses: Infinity,
                maxSavingsPercent: 50,
                maxGoals: Infinity,
                customCategories: true,
                csvImport: true,
                aiAssistant: 'advanced',
                voiceRecognition: true,
                cloudSync: true,
                colorCustomization: true,
                dateFormatCustom: true,
                calendarExport: true,
                categoryLearning: true,
                advancedFixedFormat: true
            }
        };

        this.categories = ['Alimentari', 'Trasporti', 'Altro'];
    }

    // Funzione di hash semplice
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16).padStart(8, '0').substring(0, 8).toUpperCase();
    }

    // Metodo di validazione offline
    validateOfflineLicense(licenseKey, email) {
        try {
            if (!licenseKey || !email) return false;

            // Formato accettato: BW-XXXX-YYYYY-YYYYMMDD
            if (!/^BW-[A-Z0-9]{3,6}-[A-Z0-9]{3,6}-\d{8}$/i.test(licenseKey.trim())) return false;

            const parts = licenseKey.trim().split('-');
            const dateStr = parts[parts.length - 1];

            // Controllo scadenza
            const yyyy = parseInt(dateStr.slice(0, 4), 10);
            const mm = parseInt(dateStr.slice(4, 6), 10) - 1;
            const dd = parseInt(dateStr.slice(6, 8), 10);

            const expDate = new Date(yyyy, mm, dd);
            if (isNaN(expDate.getTime())) return false;

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            expDate.setHours(0, 0, 0, 0);

            if (expDate < today) return false;

            // Firma semplice: hash(email|license|secret)
            const payload = `${email.trim().toLowerCase()}|${licenseKey.trim().toUpperCase()}|${this.secretKey}`;
            const sig = this.simpleHash(payload);

            // Il sig deve essere contenuto in una parte del codice (semplice, offline)
            // (Puoi rafforzarlo quando vuoi)
            const keyUpper = licenseKey.trim().toUpperCase();
            return keyUpper.includes(sig.substring(0, 4)) || keyUpper.includes(sig.substring(4, 8));
        } catch (e) {
            console.error('validateOfflineLicense error', e);
            return false;
        }
    }

    checkPremiumStatus() {
        if (BW_DEV_BYPASS) return true;

        // Se hai già una chiave in storage, validala offline (senza cambiare le tue regole)
        if (this.licenseKey && this.licenseEmail) {
            const ok = this.validateOfflineLicense(this.licenseKey, this.licenseEmail);
            if (ok) return true;
        }

        // Trial
        if (this.trialStart) {
            const start = new Date(this.trialStart);
            const now = new Date();
            const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
            if (diffDays < 7) return true;
        }

        return false;
    }

    startTrial() {
        if (BW_DEV_BYPASS) {
            this.isPremium = true;
            return true;
        }

        if (this.trialUsed) return false;
        this.trialUsed = true;
        this.trialStart = new Date().toISOString();
        localStorage.setItem('bw-trial-used', 'true');
        localStorage.setItem('bw-trial-start', this.trialStart);
        this.isPremium = true;
        return true;
    }

    activatePremium(licenseKey, email) {
        if (BW_DEV_BYPASS) {
            this.isPremium = true;
            return { ok: true, message: 'DEV bypass attivo: Premium sbloccato' };
        }

        if (!licenseKey || !email) {
            return { ok: false, message: 'Inserisci licenza ed email.' };
        }

        const ok = this.validateOfflineLicense(licenseKey, email);
        if (!ok) {
            return { ok: false, message: 'Licenza non valida o scaduta.' };
        }

        this.licenseKey = licenseKey.trim().toUpperCase();
        this.licenseEmail = email.trim().toLowerCase();
        localStorage.setItem('bw-license-key', this.licenseKey);
        localStorage.setItem('bw-license-email', this.licenseEmail);

        this.isPremium = true;
        return { ok: true, message: 'Premium attivato.' };
    }

    deactivatePremium() {
        this.licenseKey = null;
        this.licenseEmail = null;
        localStorage.removeItem('bw-license-key');
        localStorage.removeItem('bw-license-email');
        this.isPremium = this.checkPremiumStatus();
    }

   getLimits() {
    return this.isPremium ? this.limits.premium : this.limits.free;
}

// ✅ compatibilità con app.js (alias)
getCurrentLimits() {
    return this.getLimits();
}

// ✅ compatibilità con app.js
hasFullPremiumAccess() {
    return !!this.isPremium || BW_DEV_BYPASS === true;
}

// ✅ compatibilità extra (alcune patch chiamano questo)
isPremiumActive() {
    return this.hasFullPremiumAccess();
}
    getStatus() {
        if (BW_DEV_BYPASS) return 'premium';
        if (this.licenseKey && this.licenseEmail && this.validateOfflineLicense(this.licenseKey, this.licenseEmail)) return 'premium';
        if (this.trialStart && this.isPremium) return 'trial';
        return 'free';
    }

    getRemainingDays() {
        if (BW_DEV_BYPASS) return 9999;

        const status = this.getStatus();

        if (status === 'trial' && this.trialStart) {
            const start = new Date(this.trialStart);
            const now = new Date();
            const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
            return Math.max(0, 7 - diffDays);
        }

        if (status === 'premium' && this.licenseKey) {
            const parts = this.licenseKey.split('-');
            const dateStr = parts[parts.length - 1];
            const yyyy = parseInt(dateStr.slice(0, 4), 10);
            const mm = parseInt(dateStr.slice(4, 6), 10) - 1;
            const dd = parseInt(dateStr.slice(6, 8), 10);
            const expDate = new Date(yyyy, mm, dd);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            expDate.setHours(0, 0, 0, 0);
            const diff = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
            return Math.max(0, diff);
        }

        return 0;
    }

    getPlanInfo() {
        const status = this.getStatus();
        const remainingDays = this.getRemainingDays();

        switch(status) {
            case 'premium':
                return {
                    name: 'Premium',
                    status: 'Attivo',
                    remaining: `${remainingDays} giorni rimanenti`,
                    color: '#10b981'
                };
            case 'trial':
                return {
                    name: 'Trial Premium',
                    status: 'Attivo',
                    remaining: `${remainingDays} giorni rimanenti`,
                    color: '#f59e0b'
                };
            default:
                return {
                    name: 'Free',
                    status: 'Limitato',
                    remaining: `${30 - this.getRemainingTransactions()} transazioni rimaste`,
                    color: '#6b7280'
                };
        }
    }

    getRemainingTransactions() {
        const count = window.app?.calculateMonthlyTransactions?.() || 0;
        return Math.max(0, this.limits.free.maxTransactions - count);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = BudgetWiseLicense;
}

try { globalThis.BudgetWiseLicense = BudgetWiseLicense; } catch(e) {}
try { window.BudgetWiseLicense = BudgetWiseLicense; } catch(e) {}