import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-descarga-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-[#050500] wallpaper-bg flex flex-col items-center justify-center px-4 py-20">

      <!-- Logo -->
      <div class="text-center mb-12">
        <a routerLink="/" class="inline-flex flex-col items-center gap-2">
          <img src="logo.png" alt="Backrooms logo"
               class="h-12 w-12 object-contain"
               style="filter: drop-shadow(0 0 8px rgba(212,200,122,0.4));" />
          <span class="text-2xl font-bold tracking-[0.2em] text-[#d4c87a] flicker-slow"
                style="font-family: 'Space Mono', monospace;">BACKROOMS</span>
        </a>
        <p class="text-[#5a5828] font-mono text-xs tracking-[0.3em] mt-1">LURKING IN THE SHADOWS</p>
      </div>

      <!-- Tarjeta principal -->
      <div class="w-full max-w-2xl bg-[#0e0d04] border border-[#d4c87a]/20 p-8 mb-8">

        <div class="flex items-center gap-3 mb-6">
          <span class="text-3xl">👾</span>
          <div>
            <h1 class="text-[#d4c87a] font-mono font-bold tracking-widest uppercase text-lg">
              Descargar el juego
            </h1>
            <p class="text-[#5a5828] font-mono text-xs">Windows · v1.0 · Build estable</p>
          </div>
        </div>

        <p class="text-[#8b7a2e] font-mono text-xs leading-relaxed mb-8">
          Lurking In The Shadows es un videojuego de terror en primera persona desarrollado en Unity.
          Explora los niveles infinitos de las Backrooms, evita las entidades y encuentra la salida.
          Descarga gratuita, sin instalación necesaria.
        </p>

        <!-- Requisitos -->
        <div class="mb-8">
          <h2 class="text-[#8b7a2e] font-mono text-xs tracking-widest uppercase mb-4">
            Requisitos del sistema
          </h2>
          <div class="grid grid-cols-2 gap-px bg-[#d4c87a]/10">
            @for (row of requirements; track row.label) {
              <div class="bg-[#0e0d04] px-4 py-3">
                <p class="text-[#5a5828] font-mono text-xs uppercase tracking-widest mb-1">{{ row.label }}</p>
                <p class="text-[#b8a84a] font-mono text-xs">{{ row.value }}</p>
              </div>
            }
          </div>
        </div>

        <!-- Botón descarga -->
        <a
          href="https://drive.google.com/uc?export=download&id=1M8HYMarU7bxuWN2x9kFwY0iSO3sbb_wt"
          target="_blank"
          rel="noopener"
          class="flex items-center justify-center gap-3 w-full py-4 font-mono font-bold text-sm
                 tracking-widest uppercase text-[#050500] bg-[#d4c87a]
                 hover:bg-[#f0ecc4] hover:shadow-[0_0_32px_rgba(212,200,122,0.35)]
                 transition-all duration-200"
        >
          <span>⬇</span>
          <span>Descargar para Windows</span>
          <span class="text-[#8b7a2e] font-normal text-xs">~408 MB</span>
        </a>

        <p class="text-center text-[#3a3620] font-mono text-xs mt-4">
          Solo disponible para Windows 10/11 x64
        </p>
      </div>

      <!-- Aviso -->
      <div class="w-full max-w-2xl border border-[#d4c87a]/10 p-4 text-center">
        <p class="text-[#3a3620] font-mono text-xs leading-relaxed">
          ⚠ Si Windows SmartScreen bloquea el ejecutable, haz clic en
          <span class="text-[#5a5828]">"Más información" → "Ejecutar de todas formas"</span>.
          El juego no contiene malware.
        </p>
      </div>

      <p class="mt-8">
        <a routerLink="/" class="text-[#3a3620] hover:text-[#8b7a2e] font-mono text-xs tracking-widest uppercase transition-colors">
          ← Volver al inicio
        </a>
      </p>

    </div>
  `,
})
export class DescargaPageComponent {
  requirements = [
    { label: 'SO',        value: 'Windows 10 / 11 (64 bits)' },
    { label: 'CPU',       value: 'Intel i5 / AMD Ryzen 5 o superior' },
    { label: 'RAM',       value: '8 GB' },
    { label: 'GPU',       value: 'NVIDIA GTX 1060 / AMD RX 580' },
    { label: 'DirectX',   value: 'Versión 12' },
    { label: 'Almacen.',  value: '1 GB libres' },
  ];
}
