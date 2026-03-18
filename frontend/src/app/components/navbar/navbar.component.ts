import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface NavLink {
  label: string;
  anchor: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      [class]="navClass()"
    >
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">

          <!-- Logo -->
          <a href="#" class="flex items-center gap-2 group">
            <span class="text-xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              BACKROOMS
            </span>
            <span class="text-orange-500/60 text-xs font-light tracking-widest hidden sm:block">
              LURKING IN THE SHADOWS
            </span>
          </a>

          <!-- Desktop links -->
          <ul class="hidden md:flex items-center gap-8">
            @for (link of links; track link.anchor) {
              <li>
                <a
                  [href]="'#' + link.anchor"
                  class="text-orange-100/70 hover:text-orange-300 text-sm font-medium transition-colors duration-200"
                >
                  {{ link.label }}
                </a>
              </li>
            }
          </ul>

          <!-- CTA + mobile toggle -->
          <div class="flex items-center gap-3">
            <a
              href="#download"
              class="hidden sm:inline-flex items-center px-5 py-2 text-sm font-semibold rounded-full
                     bg-gradient-to-r from-orange-500 to-yellow-500
                     hover:from-orange-600 hover:to-yellow-600
                     text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-orange-500/20"
            >
              Download
            </a>

            <!-- Hamburger -->
            <button
              type="button"
              class="md:hidden p-2 text-orange-300 hover:text-orange-100 transition-colors"
              (click)="toggleMenu()"
              aria-label="Toggle menu"
            >
              @if (menuOpen()) {
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              } @else {
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              }
            </button>
          </div>

        </div>

        <!-- Mobile menu -->
        @if (menuOpen()) {
          <div class="md:hidden border-t border-orange-500/20 py-4 animate-fade-in-down">
            <ul class="flex flex-col gap-4">
              @for (link of links; track link.anchor) {
                <li>
                  <a
                    [href]="'#' + link.anchor"
                    class="block text-orange-100/70 hover:text-orange-300 text-sm font-medium transition-colors duration-200 py-1"
                    (click)="menuOpen.set(false)"
                  >
                    {{ link.label }}
                  </a>
                </li>
              }
              <li>
                <a
                  href="#download"
                  class="inline-flex px-5 py-2 text-sm font-semibold rounded-full
                         bg-gradient-to-r from-orange-500 to-yellow-500 text-white"
                  (click)="menuOpen.set(false)"
                >
                  Download
                </a>
              </li>
            </ul>
          </div>
        }
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  menuOpen = signal(false);
  scrolled = signal(false);

  links: NavLink[] = [
    { label: 'Features',  anchor: 'features'  },
    { label: 'Pricing',   anchor: 'pricing'   },
    { label: 'FAQ',       anchor: 'faq'       },
    { label: 'Contact',   anchor: 'contact'   },
  ];

  navClass() {
    return this.scrolled()
      ? 'bg-black/60 backdrop-blur-md border-b border-orange-500/20'
      : 'bg-black/30 backdrop-blur-md border-b border-orange-500/20';
  }

  toggleMenu() {
    this.menuOpen.update(v => !v);
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 20);
  }
}
