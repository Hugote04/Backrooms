import { Component, computed, signal, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface NavLink { label: string; anchor: string; }

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      [class]="navClass()"
    >
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">

          <!-- Logo -->
          <a href="#" class="flex items-center gap-2">
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
                >{{ link.label }}</a>
              </li>
            }
          </ul>

          <!-- Derecha: auth + descarga + hamburger -->
          <div class="flex items-center gap-3">

            @if (auth.user()) {
              <!-- Sesión activa -->
              <div class="hidden sm:flex items-center gap-2">
                <a
                  routerLink="/perfil"
                  class="flex items-center gap-2 text-orange-100/70 hover:text-orange-200 transition-colors"
                >
                  <div class="w-7 h-7 rounded-full bg-orange-500/25 border border-orange-500/40
                               flex items-center justify-center text-orange-300 text-xs font-bold">
                    {{ initial() }}
                  </div>
                  <span class="text-sm hidden lg:block">{{ auth.getDisplayName() }}</span>
                </a>
                <button
                  type="button"
                  (click)="signOut()"
                  class="text-orange-100/50 hover:text-orange-300 text-sm transition-colors px-2"
                >Salir</button>
              </div>
            } @else {
              <!-- Sin sesión -->
              <div class="hidden sm:flex items-center gap-2">
                <a
                  routerLink="/login"
                  class="text-orange-100/70 hover:text-orange-300 text-sm font-medium transition-colors"
                >Iniciar Sesión</a>
                <a
                  routerLink="/registro"
                  class="px-4 py-1.5 text-sm font-semibold rounded-full border border-orange-500/40
                         text-orange-300 hover:bg-orange-500/10 transition-all duration-200"
                >Registrarse</a>
              </div>
            }

            <a
              href="#descarga"
              class="hidden sm:inline-flex items-center px-5 py-2 text-sm font-semibold rounded-full
                     bg-gradient-to-r from-orange-500 to-yellow-500
                     hover:from-orange-600 hover:to-yellow-600
                     text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-orange-500/20"
            >Descargar</a>

            <!-- Hamburger -->
            <button
              type="button"
              class="md:hidden p-2 text-orange-300 hover:text-orange-100 transition-colors"
              (click)="menuOpen.update(v => !v)"
              aria-label="Menú"
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

        <!-- Menú móvil -->
        @if (menuOpen()) {
          <div class="md:hidden border-t border-orange-500/20 py-4 animate-fade-in-down">
            <ul class="flex flex-col gap-3">
              @for (link of links; track link.anchor) {
                <li>
                  <a
                    [href]="'#' + link.anchor"
                    class="block text-orange-100/70 hover:text-orange-300 text-sm py-1 transition-colors"
                    (click)="menuOpen.set(false)"
                  >{{ link.label }}</a>
                </li>
              }
              <li class="pt-2 border-t border-orange-500/10 flex flex-col gap-2">
                @if (auth.user()) {
                  <a routerLink="/perfil" class="text-orange-100/70 text-sm py-1" (click)="menuOpen.set(false)">
                    Mi Perfil
                  </a>
                  <button type="button" (click)="signOut()" class="text-orange-100/50 text-sm text-left py-1">
                    Cerrar Sesión
                  </button>
                } @else {
                  <a routerLink="/login" class="text-orange-100/70 text-sm py-1" (click)="menuOpen.set(false)">
                    Iniciar Sesión
                  </a>
                  <a routerLink="/registro" class="text-orange-300 text-sm py-1" (click)="menuOpen.set(false)">
                    Registrarse
                  </a>
                }
                <a
                  href="#descarga"
                  class="inline-flex px-5 py-2 text-sm font-semibold rounded-full
                         bg-gradient-to-r from-orange-500 to-yellow-500 text-white w-fit"
                  (click)="menuOpen.set(false)"
                >Descargar</a>
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

  initial = computed(() => {
    const name = this.auth.getDisplayName();
    return name.charAt(0).toUpperCase();
  });

  links: NavLink[] = [
    { label: 'Características', anchor: 'features' },
    { label: 'Reseñas',         anchor: 'resenas'  },
    { label: 'FAQ',             anchor: 'faq'      },
    { label: 'Contacto',        anchor: 'contact'  },
  ];

  constructor(public auth: AuthService, private router: Router) {}

  navClass() {
    return this.scrolled()
      ? 'bg-black/60 backdrop-blur-md border-b border-orange-500/20'
      : 'bg-black/30 backdrop-blur-md border-b border-orange-500/20';
  }

  async signOut() {
    this.menuOpen.set(false);
    await this.auth.signOut();
    this.router.navigate(['/']);
  }

  @HostListener('window:scroll')
  onScroll() { this.scrolled.set(window.scrollY > 20); }
}
