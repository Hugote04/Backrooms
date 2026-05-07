import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CookieBannerComponent } from '../../components/cookie-banner/cookie-banner.component';

@Component({
  selector: 'app-cookies',
  standalone: true,
  imports: [RouterLink],
  // CookieBannerComponent se usa solo para llamar al método estático resetConsent()
  template: `
    <div class="min-h-screen bg-[#050500] wallpaper-bg px-4 py-16">
      <div class="max-w-3xl mx-auto">

        <div class="text-center mb-12">
          <a routerLink="/" class="inline-block mb-6">
            <span class="text-xl font-bold tracking-[0.2em] text-[#d4c87a] flicker-slow"
                  style="font-family: 'Space Mono', monospace;">BACKROOMS</span>
          </a>
          <h1 class="text-[#d4c87a] font-mono font-bold tracking-widest uppercase text-2xl mb-2">
            Política de Cookies
          </h1>
          <p class="text-[#5a5828] font-mono text-xs">Última actualización: mayo de 2026</p>
        </div>

        <div class="bg-[#0e0d04] border border-[#d4c87a]/15 p-8 space-y-8 font-mono text-xs leading-relaxed text-[#8b7a2e]">

          @for (section of sections; track section.title) {
            <div>
              <h2 class="text-[#b8a84a] font-bold uppercase tracking-widest mb-3">{{ section.title }}</h2>
              <p class="whitespace-pre-line">{{ section.content }}</p>
            </div>
          }

          <!-- Tabla de cookies -->
          <div>
            <h2 class="text-[#b8a84a] font-bold uppercase tracking-widest mb-3">4. Cookies utilizadas</h2>
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-[#d4c87a]/15">
                    <th class="py-2 pr-4 text-[#d4c87a] uppercase tracking-widest text-xs">Nombre</th>
                    <th class="py-2 pr-4 text-[#d4c87a] uppercase tracking-widest text-xs">Tipo</th>
                    <th class="py-2 pr-4 text-[#d4c87a] uppercase tracking-widest text-xs">Duración</th>
                    <th class="py-2 text-[#d4c87a] uppercase tracking-widest text-xs">Finalidad</th>
                  </tr>
                </thead>
                <tbody>
                  @for (cookie of cookies; track cookie.name) {
                    <tr class="border-b border-[#d4c87a]/08">
                      <td class="py-2 pr-4 text-[#b8a84a]">{{ cookie.name }}</td>
                      <td class="py-2 pr-4">{{ cookie.type }}</td>
                      <td class="py-2 pr-4">{{ cookie.duration }}</td>
                      <td class="py-2">{{ cookie.purpose }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 class="text-[#b8a84a] font-bold uppercase tracking-widest mb-3">5. Gestión de cookies</h2>
            <p class="mb-4">Puedes bloquear o eliminar las cookies desde la configuración de tu navegador. Ten en cuenta que bloquear las cookies técnicas puede impedir el correcto funcionamiento de la sesión de usuario.</p>
            <p class="mb-4">También puedes cambiar tu preferencia de cookies en cualquier momento desde aquí:</p>
            <div class="flex items-center gap-3 flex-wrap">
              <span class="text-[#5a5828]">
                Estado actual:
                <span class="text-[#b8a84a] ml-1">{{ consentLabel() }}</span>
              </span>
              <button
                type="button"
                (click)="resetConsent()"
                class="px-4 py-1.5 font-mono text-xs tracking-widest uppercase
                       text-[#8b7a2e] border border-[#8b7a2e]/40
                       hover:text-[#d4c87a] hover:border-[#d4c87a]/40 transition-all"
              >
                Cambiar preferencia
              </button>
            </div>
            @if (resetDone()) {
              <p class="text-[#d4c87a] text-xs mt-3">
                ✓ Preferencia eliminada. El banner de cookies aparecerá de nuevo al recargar la página.
              </p>
            }
          </div>

        </div>

        <p class="text-center mt-8">
          <a routerLink="/" class="text-[#3a3620] hover:text-[#8b7a2e] font-mono text-xs tracking-widest uppercase transition-colors">
            ← Volver al inicio
          </a>
        </p>
      </div>
    </div>
  `,
})
export class CookiesComponent {
  resetDone = signal(false);

  consentLabel(): string {
    const v = localStorage.getItem('backrooms_cookies_consent');
    if (v === 'all')       return 'Todas aceptadas';
    if (v === 'necessary') return 'Solo necesarias';
    return 'Sin respuesta todavía';
  }

  resetConsent() {
    CookieBannerComponent.resetConsent();
    this.resetDone.set(true);
  }

  sections = [
    {
      title: '1. ¿Qué son las cookies?',
      content: `Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Se utilizan para recordar tus preferencias, mantener tu sesión activa y mejorar la experiencia de uso.`,
    },
    {
      title: '2. Tipos de cookies',
      content: `· Cookies técnicas o necesarias: imprescindibles para el funcionamiento básico de la aplicación. Sin ellas no podrías iniciar sesión ni mantener tu sesión activa.\n\n· Cookies de sesión: se eliminan automáticamente al cerrar el navegador.\n\n· Cookies persistentes: permanecen almacenadas durante un período determinado.`,
    },
    {
      title: '3. Cookies de terceros',
      content: `Esta aplicación utiliza Supabase como proveedor de autenticación. Supabase puede establecer cookies propias para gestionar la sesión. Consulta la política de privacidad de Supabase en https://supabase.com/privacy para más información.`,
    },
  ];

  cookies = [
    { name: 'sb-access-token',  type: 'Técnica',    duration: 'Sesión',    purpose: 'Token JWT de sesión de Supabase' },
    { name: 'sb-refresh-token', type: 'Técnica',    duration: '60 días',   purpose: 'Renovación automática de sesión' },
    { name: 'sb-auth-token',    type: 'Técnica',    duration: 'Sesión',    purpose: 'Estado de autenticación' },
  ];
}
