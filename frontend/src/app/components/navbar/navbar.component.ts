import { Component, computed, signal, HostListener, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { AuthService } from '../../services/auth.service';

interface NavLink { label: string; anchor: string; }

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav
      #navEl
      [class]="navClass()"
    >
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-14">

          <!-- Logo -->
          <a href="#" class="flex items-center gap-2">
            <img src="logo.png" alt="Backrooms logo"
                 class="h-8 w-8 object-contain"
                 style="filter: drop-shadow(0 0 6px rgba(212,200,122,0.35));" />
            <div class="flex flex-col leading-none">
              <span class="text-base font-bold tracking-[0.15em] text-[#d4c87a] flicker-slow"
                    style="font-family: 'Space Mono', monospace;">
                BACKROOMS
              </span>
              <span class="text-[#8b7a2e] text-[0.55rem] tracking-[0.25em] hidden sm:block"
                    style="font-family: 'Space Mono', monospace;">
                LURKING IN THE SHADOWS
              </span>
            </div>
          </a>

          <!-- Desktop links -->
          <ul class="hidden md:flex items-center gap-8">
            @for (link of links; track link.anchor) {
              <li>
                <a
                  [href]="'#' + link.anchor"
                  class="text-[#b8a84a] hover:text-[#f0ecc4] text-xs tracking-widest font-mono uppercase transition-colors duration-200"
                >{{ link.label }}</a>
              </li>
            }
            <li>
              <a
                routerLink="/leaderboard"
                class="text-[#b8a84a] hover:text-[#f0ecc4] text-xs tracking-widest font-mono uppercase transition-colors duration-200"
              >Leaderboard</a>
            </li>
            <li>
              <a
                routerLink="/demo"
                class="px-3 py-1 border border-[#d4c87a]/30 text-[#d4c87a] hover:bg-[#d4c87a]/10
                       text-xs tracking-widest font-mono uppercase transition-all duration-200"
              >▶ Demo</a>
            </li>
          </ul>

          <!-- Derecha: auth + descarga + hamburger -->
          <div class="flex items-center gap-3">

            @if (auth.user()) {
              <div class="hidden sm:flex items-center gap-2">
                <a
                  routerLink="/perfil"
                  class="flex items-center gap-2 text-[#b8a84a] hover:text-[#d4c87a] transition-colors"
                >
                  <div class="w-6 h-6 border border-[#d4c87a]/40 overflow-hidden shrink-0
                               flex items-center justify-center">
                    @if (avatarUrl()) {
                      <img [src]="avatarUrl()!" alt="avatar"
                           class="w-full h-full object-cover" />
                    } @else {
                      <span class="bg-[#d4c87a]/15 w-full h-full flex items-center justify-center
                                   text-[#d4c87a] text-xs font-mono font-bold">
                        {{ initial() }}
                      </span>
                    }
                  </div>
                  <span class="text-xs font-mono hidden lg:block">{{ auth.getDisplayName() }}</span>
                </a>
                <button
                  type="button"
                  (click)="signOut()"
                  class="text-[#8b7a2e] hover:text-[#d4c87a] text-xs font-mono tracking-widest transition-colors px-2 uppercase"
                >Salir</button>
              </div>
            } @else {
              <div class="hidden sm:flex items-center gap-2">
                <a
                  routerLink="/login"
                  class="text-[#b8a84a] hover:text-[#d4c87a] text-xs font-mono tracking-widest transition-colors uppercase"
                >Iniciar Sesión</a>
                <a
                  routerLink="/registro"
                  class="px-4 py-1.5 text-xs font-mono tracking-widest uppercase
                         border border-[#d4c87a]/40 text-[#d4c87a]
                         hover:bg-[#d4c87a]/10 transition-all duration-200"
                >Registrarse</a>
              </div>
            }

            <a
              routerLink="/descarga"
              class="hidden sm:inline-flex items-center px-5 py-2 text-xs font-mono tracking-widest uppercase
                     border border-[#d4c87a]/60 text-[#d4c87a]
                     hover:bg-[#d4c87a]/10 hover:shadow-[0_0_16px_rgba(212,200,122,0.2)]
                     transition-all duration-200"
            >Descargar</a>

            <!-- Hamburger -->
            <button
              type="button"
              class="md:hidden p-2 text-[#d4c87a] hover:text-[#f0ecc4] transition-colors"
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
          <div class="md:hidden border-t border-[#d4c87a]/15 py-4">
            <ul class="flex flex-col gap-3">
              @for (link of links; track link.anchor) {
                <li>
                  <a
                    [href]="'#' + link.anchor"
                    class="block text-[#b8a84a] hover:text-[#d4c87a] text-xs font-mono tracking-widest uppercase py-1 transition-colors"
                    (click)="menuOpen.set(false)"
                  >{{ link.label }}</a>
                </li>
              }
              <li>
                <a
                  routerLink="/leaderboard"
                  class="block text-[#b8a84a] hover:text-[#d4c87a] text-xs font-mono tracking-widest uppercase py-1 transition-colors"
                  (click)="menuOpen.set(false)"
                >Leaderboard</a>
              </li>
              <li>
                <a
                  routerLink="/demo"
                  class="block text-[#d4c87a] hover:text-[#f0ecc4] text-xs font-mono tracking-widest uppercase py-1 transition-colors"
                  (click)="menuOpen.set(false)"
                >▶ Demo</a>
              </li>
              <li class="pt-2 border-t border-[#d4c87a]/10 flex flex-col gap-2">
                @if (auth.user()) {
                  <a routerLink="/perfil" class="text-[#b8a84a] text-xs font-mono uppercase py-1" (click)="menuOpen.set(false)">
                    Mi Perfil
                  </a>
                  <button type="button" (click)="signOut()" class="text-[#8b7a2e] text-xs font-mono uppercase text-left py-1">
                    Cerrar Sesión
                  </button>
                } @else {
                  <a routerLink="/login" class="text-[#b8a84a] text-xs font-mono uppercase py-1" (click)="menuOpen.set(false)">
                    Iniciar Sesión
                  </a>
                  <a routerLink="/registro" class="text-[#d4c87a] text-xs font-mono uppercase py-1" (click)="menuOpen.set(false)">
                    Registrarse
                  </a>
                }
                <a
                  routerLink="/descarga"
                  class="inline-flex px-5 py-2 text-xs font-mono tracking-widest uppercase
                         border border-[#d4c87a]/60 text-[#d4c87a] w-fit"
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
export class NavbarComponent implements AfterViewInit, OnDestroy {
  @ViewChild('navEl') navEl!: ElementRef;

  menuOpen = signal(false);
  scrolled = signal(false);

  initial = computed(() => {
    const name = this.auth.getDisplayName();
    return name.charAt(0).toUpperCase();
  });

  avatarUrl = computed(() => {
    return (this.auth.user()?.user_metadata?.['avatarUrl'] as string) ?? null;
  });

  links: NavLink[] = [
    { label: 'Características', anchor: 'features' },
    { label: 'Reseñas',         anchor: 'resenas'  },
    { label: 'FAQ',             anchor: 'faq'      },
    { label: 'Contacto',        anchor: 'contact'  },
  ];

  readonly leaderboardRoute = '/leaderboard';

  private ctx!: gsap.Context;

  constructor(public auth: AuthService, private router: Router) {}

  ngAfterViewInit() {
    this.ctx = gsap.context(() => {
      gsap.from(this.navEl.nativeElement, {
        y: -60,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'power2.out',
        delay: 0.1,
      });
    });
  }

  ngOnDestroy() {
    this.ctx?.revert();
  }

  navClass() {
    const base = 'fixed top-0 left-0 right-0 z-50 transition-all duration-300';
    return this.scrolled()
      ? `${base} bg-[#0e0d04]/90 backdrop-blur-sm border-b border-[#d4c87a]/30 shadow-[0_2px_20px_rgba(212,200,122,0.08)]`
      : `${base} bg-[#0e0d04]/50 backdrop-blur-sm border-b border-[#d4c87a]/15`;
  }

  async signOut() {
    this.menuOpen.set(false);
    await this.auth.signOut();
    this.router.navigate(['/']);
  }

  @HostListener('window:scroll')
  onScroll() { this.scrolled.set(window.scrollY > 20); }
}
