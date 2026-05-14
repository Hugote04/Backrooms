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
          <img src="logo.png" alt="logo" class="w-8 h-8 opacity-80"
               style="filter: drop-shadow(0 0 6px rgba(212,200,122,0.4));" />
          <div>
            <h1 class="text-[#d4c87a] font-mono font-bold tracking-widest uppercase text-lg">
              Descargar el juego
            </h1>
            <p class="text-[#5a5828] font-mono text-xs">v1.0 · Gratuito · Windows · macOS · Android</p>
          </div>
        </div>

        <p class="text-[#8b7a2e] font-mono text-xs leading-relaxed mb-8">
          Lurking In The Shadows es un videojuego de terror en primera persona desarrollado en Unity.
          Explora los niveles infinitos de las Backrooms, evita las entidades y encuentra la salida.
          Descarga gratuita, sin instalación necesaria.
        </p>

        <!-- Plataformas -->
        <div class="space-y-3 mb-8">
          @for (p of platforms; track p.os) {
            <a [href]="p.url" target="_blank" rel="noopener"
               [class]="p.primary
                 ? 'flex items-center justify-between w-full px-5 py-4 font-mono font-bold text-sm tracking-widest uppercase text-[#050500] bg-[#d4c87a] hover:bg-[#f0ecc4] hover:shadow-[0_0_32px_rgba(212,200,122,0.35)] transition-all duration-200'
                 : 'flex items-center justify-between w-full px-5 py-4 font-mono text-sm tracking-widest uppercase border border-[#d4c87a]/30 text-[#d4c87a] hover:bg-[#d4c87a]/10 hover:border-[#d4c87a]/60 transition-all duration-200'">
              <div class="flex items-center gap-3">
                <span class="text-lg">{{ p.icon }}</span>
                <div class="text-left">
                  <span class="block">{{ p.label }}</span>
                  <span class="block font-normal text-xs opacity-60">{{ p.sub }}</span>
                </div>
              </div>
              <div class="flex items-center gap-2 text-xs font-normal opacity-70">
                <span>{{ p.size }}</span>
                <span>⬇</span>
              </div>
            </a>
          }
        </div>

        <!-- Requisitos -->
        <div>
          <h2 class="text-[#8b7a2e] font-mono text-xs tracking-widest uppercase mb-4">
            Requisitos del sistema (PC)
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
      </div>

      <!-- Avisos -->
      <div class="w-full max-w-2xl space-y-3">
        <div class="border border-[#d4c87a]/10 p-4">
          <p class="text-[#3a3620] font-mono text-xs leading-relaxed">
            ⚠ <span class="text-[#5a5828]">Windows:</span>
            Si SmartScreen bloquea el ejecutable, clic en
            <span class="text-[#5a5828]">"Más información" → "Ejecutar de todas formas"</span>.
            El juego no contiene malware.
          </p>
        </div>
        <div class="border border-[#d4c87a]/10 p-4">
          <p class="text-[#3a3620] font-mono text-xs leading-relaxed">
            ⚠ <span class="text-[#5a5828]">Android:</span>
            Activa <span class="text-[#5a5828]">"Instalar apps de fuentes desconocidas"</span>
            en Ajustes → Seguridad antes de instalar el APK.
          </p>
        </div>
        <div class="border border-[#d4c87a]/10 p-4 flex items-center justify-between">
          <p class="text-[#3a3620] font-mono text-xs">
            ¿Prefieres jugar en el navegador?
          </p>
          <a routerLink="/demo"
             class="text-[#5a5828] hover:text-[#d4c87a] font-mono text-xs tracking-widest uppercase transition-colors">
            Demo web →
          </a>
        </div>
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

  platforms = [
    {
      os:      'windows',
      icon:    '🖥',
      label:   'Descargar para Windows',
      sub:     'Windows 10 / 11 · 64 bits · .zip',
      size:    '~167 MB',
      url:     'https://drive.google.com/uc?export=download&id=1bQuzMtg5Ek3hoCdZkdl17Hr_J5IA1UKl',
      primary: true,
    },
    {
      os:      'mac',
      icon:    '🍎',
      label:   'Descargar para macOS',
      sub:     'macOS 12+ · .zip con .app',
      size:    '~175 MB',
      url:     'https://drive.google.com/uc?export=download&id=1wnSchu5eDIduTfzVCy3Tb6Pbk5Ut7cgV',
      primary: false,
    },
    {
      os:      'android',
      icon:    '📱',
      label:   'Descargar para Android',
      sub:     'Android 8.0+ · APK',
      size:    '~233 MB',
      url:     'https://drive.google.com/uc?export=download&id=15AqNDihyCZ4Rj-Q3rkZ-y0tbk8NnjDRJ',
      primary: false,
    },
  ];

  requirements = [
    { label: 'SO',        value: 'Windows 10 / 11 (64 bits)' },
    { label: 'CPU',       value: 'Intel i5 / AMD Ryzen 5 o superior' },
    { label: 'RAM',       value: '8 GB' },
    { label: 'GPU',       value: 'NVIDIA GTX 1060 / AMD RX 580' },
    { label: 'DirectX',   value: 'Versión 12' },
    { label: 'Almacen.',  value: '1 GB libres' },
  ];
}
