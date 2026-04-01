import { Component } from '@angular/core';

interface FooterLink  { label: string; href: string; }
interface FooterColumn { title: string; links: FooterLink[]; }

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="border-t border-orange-500/20 bg-black py-16">
      <div class="container mx-auto px-4">

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          <!-- Marca -->
          <div>
            <div class="text-xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-1">
              BACKROOMS
            </div>
            <div class="text-orange-500/60 text-xs tracking-widest mb-4">LURKING IN THE SHADOWS</div>
            <p class="text-orange-100/50 text-sm leading-relaxed">
              La experiencia definitiva de horror liminal. Explora las habitaciones infinitas,
              sobrevive a lo desconocido.
            </p>
            <div class="flex gap-3 mt-5">
              @for (social of socials; track social.label) {
                <a
                  [href]="social.href"
                  [attr.aria-label]="social.label"
                  target="_blank" rel="noopener"
                  class="p-2 rounded-md border border-orange-500/20 text-orange-400/60
                         hover:border-orange-500/50 hover:text-orange-300 transition-all duration-200"
                  [innerHTML]="social.svg"
                ></a>
              }
            </div>
          </div>

          @for (col of columns; track col.title) {
            <div>
              <h4 class="text-orange-100 font-semibold mb-4 text-sm uppercase tracking-wider">{{ col.title }}</h4>
              <ul class="space-y-2.5">
                @for (link of col.links; track link.label) {
                  <li>
                    <a [href]="link.href" class="text-orange-100/50 hover:text-orange-300 text-sm transition-colors duration-200">
                      {{ link.label }}
                    </a>
                  </li>
                }
              </ul>
            </div>
          }

        </div>

        <div class="border-t border-orange-500/10 pt-8 flex flex-col sm:flex-row
                    items-center justify-between gap-4 text-orange-100/30 text-sm">
          <span>&copy; {{ year }} Backrooms: Lurking In The Shadows. Todos los derechos reservados.</span>
          <span class="text-orange-500/30 text-xs">Hecho con miedo y café.</span>
        </div>

      </div>
    </footer>
  `,
})
export class FooterComponent {
  year = new Date().getFullYear();

  socials = [
    {
      label: 'Discord', href: '#',
      svg: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>`,
    },
    {
      label: 'X / Twitter', href: '#',
      svg: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    },
    {
      label: 'YouTube', href: '#',
      svg: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
    },
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
        { label: 'FAQ',                href: '#faq'     },
        { label: 'Contacto',           href: '#contact' },
        { label: 'Reportar un bug',    href: '#'        },
        { label: 'Wiki de la comunidad', href: '#'      },
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
