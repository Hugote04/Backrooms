import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

const STORAGE_KEY = 'backrooms_cookies_consent';

export type CookieConsent = 'all' | 'necessary' | null;

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (visible()) {
      <div
        role="dialog"
        aria-label="Aviso de cookies"
        class="fixed bottom-0 left-0 right-0 z-[9999]
               bg-[#0e0d04]/97 backdrop-blur-sm
               border-t border-[#d4c87a]/20
               px-4 py-5 md:py-4"
      >
        <div class="container mx-auto flex flex-col md:flex-row items-start md:items-center
                    justify-between gap-4 max-w-6xl">

          <!-- Texto -->
          <div class="flex items-start gap-3 flex-1 min-w-0">
            <span class="text-xl shrink-0 mt-0.5 select-none">🍪</span>
            <div>
              <p class="text-[#b8a84a] font-mono text-xs leading-relaxed">
                Usamos cookies técnicas necesarias para que la sesión de usuario funcione correctamente.
                No usamos cookies de seguimiento ni publicidad.
              </p>
              <p class="text-[#5a5828] font-mono text-xs mt-1">
                Consulta nuestra
                <a routerLink="/cookies"
                   class="text-[#8b7a2e] hover:text-[#d4c87a] underline underline-offset-2 transition-colors">
                  Política de Cookies
                </a>
                para más información.
              </p>
            </div>
          </div>

          <!-- Botones -->
          <div class="flex items-center gap-3 shrink-0">
            <button
              type="button"
              (click)="accept('necessary')"
              class="px-4 py-2 font-mono text-xs tracking-widest uppercase
                     text-[#5a5828] border border-[#5a5828]/40
                     hover:border-[#8b7a2e]/60 hover:text-[#8b7a2e]
                     transition-all duration-200"
            >
              Solo necesarias
            </button>
            <button
              type="button"
              (click)="accept('all')"
              class="px-5 py-2 font-mono text-xs tracking-widest uppercase
                     text-[#050500] bg-[#d4c87a]
                     hover:bg-[#f0ecc4] hover:shadow-[0_0_16px_rgba(212,200,122,0.3)]
                     transition-all duration-200"
            >
              Aceptar todas
            </button>
          </div>

        </div>
      </div>
    }
  `,
})
export class CookieBannerComponent implements OnInit {
  visible = signal(false);

  ngOnInit() {
    // Mostrar solo si el usuario no ha respondido todavía
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      this.visible.set(true);
    }
  }

  accept(type: 'all' | 'necessary') {
    localStorage.setItem(STORAGE_KEY, type);
    this.visible.set(false);
  }

  /** Utilidad estática para comprobar el consentimiento desde cualquier sitio */
  static getConsent(): CookieConsent {
    return (localStorage.getItem(STORAGE_KEY) as CookieConsent) ?? null;
  }

  /** Resetea el consentimiento (útil para testing o desde la página de cookies) */
  static resetConsent() {
    localStorage.removeItem(STORAGE_KEY);
  }
}
