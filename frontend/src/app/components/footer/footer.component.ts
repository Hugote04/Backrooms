import { Component } from '@angular/core';

interface FooterLink  { label: string; href: string; }
interface FooterColumn { title: string; links: FooterLink[]; }

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="border-t border-[#d4c87a]/10 bg-[#050500] py-16">
      <div class="container mx-auto px-4">

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          <!-- Marca -->
          <div>
            <div class="text-base font-bold tracking-[0.2em] text-[#d4c87a] mb-1 flicker-slow"
                 style="font-family: 'Space Mono', monospace;">
              BACKROOMS
            </div>
            <div class="text-[#5a5828] text-xs tracking-[0.3em] mb-4 font-mono">LURKING IN THE SHADOWS</div>
            <p class="text-[#5a5828] font-mono text-xs leading-relaxed mb-4">
              La experiencia definitiva de horror liminal. Explora las habitaciones infinitas,
              sobrevive a lo desconocido.
            </p>
            <!-- Emojis decorativos -->
            <p class="text-lg mb-5 tracking-wider select-none" title="Terror · Misterio · Supervivencia">
              👁️&nbsp;🌀&nbsp;🚪
            </p>
            <!-- Social links -->
            <div class="flex gap-3">
              @for (social of socials; track social.label) {
                <a
                  [href]="social.href"
                  [attr.aria-label]="social.label"
                  target="_blank" rel="noopener"
                  class="w-9 h-9 border border-[#d4c87a]/15 text-[#5a5828]
                         hover:border-[#d4c87a]/40 hover:text-[#d4c87a]
                         flex items-center justify-center text-base
                         transition-all duration-200"
                  [title]="social.label"
                >{{ social.emoji }}</a>
              }
            </div>
          </div>

          @for (col of columns; track col.title) {
            <div>
              <h4 class="text-[#8b7a2e] font-mono text-xs tracking-widest uppercase mb-4">{{ col.title }}</h4>
              <ul class="space-y-2.5">
                @for (link of col.links; track link.label) {
                  <li>
                    <a [href]="link.href"
                       class="text-[#5a5828] hover:text-[#d4c87a] font-mono text-xs transition-colors duration-200">
                      {{ link.label }}
                    </a>
                  </li>
                }
              </ul>
            </div>
          }

        </div>

        <div class="border-t border-[#d4c87a]/10 pt-8 flex flex-col sm:flex-row
                    items-center justify-between gap-4">
          <span class="text-[#3a3620] font-mono text-xs">
            &copy; {{ year }} Backrooms: Lurking In The Shadows. Todos los derechos reservados.
          </span>
          <span class="text-[#3a3620] font-mono text-xs flicker">Hecho con miedo y café ☕</span>
        </div>

      </div>
    </footer>
  `,
})
export class FooterComponent {
  year = new Date().getFullYear();

  socials = [
    { label: 'Discord',    href: '#', emoji: '💬' },
    { label: 'X/Twitter',  href: '#', emoji: '𝕏'  },
    { label: 'YouTube',    href: '#', emoji: '▶'  },
  ];

  columns: FooterColumn[] = [
    {
      title: 'Enlaces Rápidos',
      links: [
        { label: 'Características', href: '#features' },
        { label: 'Descargar',       href: '#descarga'  },
        { label: 'Reseñas',         href: '#resenas'   },
        { label: 'Changelog',       href: '#'          },
      ],
    },
    {
      title: 'Soporte',
      links: [
        { label: 'FAQ',                  href: '#faq'     },
        { label: 'Contacto',             href: '#contact' },
        { label: 'Reportar un bug',      href: '#'        },
        { label: 'Wiki de la comunidad', href: '#'        },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Política de Privacidad', href: '#' },
        { label: 'Términos de Servicio',   href: '#' },
        { label: 'Política de Cookies',    href: '#' },
        { label: 'EULA',                   href: '#' },
      ],
    },
  ];
}
