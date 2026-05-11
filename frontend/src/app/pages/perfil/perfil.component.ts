import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { AuthService } from '../../services/auth.service';
import { ScoreService, UserStats } from '../../services/score.service';

@Component({
  selector: 'app-perfil-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-[#050500] wallpaper-bg flex items-center justify-center px-4 py-16">
      <div class="w-full max-w-md">

        <div #card>
          <!-- Logo -->
          <div class="text-center mb-10">
            <a routerLink="/" class="inline-block">
              <span class="text-2xl font-bold tracking-[0.2em] text-[#d4c87a] flicker-slow"
                    style="font-family: 'Space Mono', monospace;">
                BACKROOMS
              </span>
            </a>
          </div>

          <div class="bg-[#0e0d04] border border-[#d4c87a]/20 p-8">
            <!-- Avatar -->
            <div class="flex flex-col items-center mb-8">
              <div class="w-20 h-20 bg-[#d4c87a]/15 border-2 border-[#d4c87a]/40
                           flex items-center justify-center text-[#d4c87a] font-mono font-bold text-3xl mb-4">
                {{ initial }}
              </div>
              <h1 class="text-[#d4c87a] font-mono font-bold tracking-[0.15em] uppercase mb-1"
                  style="font-family: 'Space Mono', monospace;">
                {{ displayName }}
              </h1>
              <p class="text-[#5a5828] font-mono text-xs tracking-widest">{{ email }}</p>
            </div>

            <!-- Info cuenta -->
            <div class="space-y-3 mb-8">
              <div class="flex justify-between py-3 border-b border-[#d4c87a]/10">
                <span class="text-[#5a5828] font-mono text-xs tracking-widest uppercase">Email</span>
                <span class="text-[#b8a84a] font-mono text-xs">{{ email }}</span>
              </div>
              <div class="flex justify-between py-3 border-b border-[#d4c87a]/10">
                <span class="text-[#5a5828] font-mono text-xs tracking-widest uppercase">Nombre</span>
                <span class="text-[#b8a84a] font-mono text-xs">{{ displayName }}</span>
              </div>
              <div class="flex justify-between py-3">
                <span class="text-[#5a5828] font-mono text-xs tracking-widest uppercase">Miembro desde</span>
                <span class="text-[#b8a84a] font-mono text-xs">{{ joinedDate }}</span>
              </div>
            </div>

            <!-- Stats del juego -->
            @if (stats) {
              <div class="mb-8">
                <p class="text-[#5a5828] font-mono text-[0.65rem] tracking-widest uppercase mb-3">
                  Estadísticas de juego
                </p>
                <div class="grid grid-cols-3 gap-3">
                  <div class="bg-[#d4c87a]/05 border border-[#d4c87a]/10 p-3 text-center">
                    <p class="text-[#d4c87a] font-mono text-lg font-bold">{{ stats.totalPartidas }}</p>
                    <p class="text-[#3a3620] font-mono text-[0.6rem] tracking-widest uppercase mt-0.5">Partidas</p>
                  </div>
                  <div class="bg-[#d4c87a]/05 border border-[#d4c87a]/10 p-3 text-center">
                    <p class="text-[#d4c87a] font-mono text-lg font-bold">{{ stats.puzlesResueltos }}</p>
                    <p class="text-[#3a3620] font-mono text-[0.6rem] tracking-widest uppercase mt-0.5">Puzles</p>
                  </div>
                  <div class="bg-[#d4c87a]/05 border border-[#d4c87a]/10 p-3 text-center">
                    <p class="text-[#d4c87a] font-mono text-lg font-bold">{{ formatTime(stats.mejorTiempo) }}</p>
                    <p class="text-[#3a3620] font-mono text-[0.6rem] tracking-widest uppercase mt-0.5">Mejor tiempo</p>
                  </div>
                </div>
                <div class="mt-3 text-right">
                  <a routerLink="/leaderboard"
                     class="text-[#5a5828] hover:text-[#8b7a2e] font-mono text-[0.65rem] tracking-widest uppercase transition-colors">
                    Ver leaderboard →
                  </a>
                </div>
              </div>
            } @else if (stats === null && !loadingStats) {
              <div class="mb-8 py-4 border border-[#d4c87a]/10 text-center">
                <p class="text-[#3a3620] font-mono text-[0.65rem] tracking-widest">
                  Aún no has jugado ninguna partida.
                </p>
                <a routerLink="/descarga" class="text-[#5a5828] hover:text-[#8b7a2e] font-mono text-[0.65rem] tracking-widest uppercase transition-colors mt-1 inline-block">
                  Descargar juego →
                </a>
              </div>
            }

            <button
              type="button"
              (click)="signOut()"
              class="w-full py-3 font-mono tracking-widest uppercase text-xs text-[#8b7a2e]
                     border border-[#8b7a2e]/40 hover:border-[#d4c87a]/60 hover:text-[#d4c87a]
                     hover:bg-[#d4c87a]/[0.08] transition-all duration-200"
            >
              Cerrar Sesión
            </button>
          </div>

          <p class="text-center mt-6">
            <a routerLink="/" class="text-[#3a3620] hover:text-[#8b7a2e] font-mono text-xs tracking-widest uppercase transition-colors">
              ← Volver al inicio
            </a>
          </p>
        </div>

      </div>
    </div>
  `,
})
export class PerfilPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('card') cardRef!: ElementRef;

  displayName  = '';
  email        = '';
  initial      = '';
  joinedDate   = '';
  stats:       UserStats | null = null;
  loadingStats = true;

  private ctx!: gsap.Context;

  constructor(
    private auth: AuthService,
    private router: Router,
    private scoreService: ScoreService,
  ) {}

  async ngOnInit() {
    const user = this.auth.user();
    if (!user) { this.router.navigate(['/login']); return; }

    this.email       = user.email ?? '';
    this.displayName = this.auth.getDisplayName();
    this.initial     = this.displayName.charAt(0).toUpperCase();
    this.joinedDate  = new Date(user.created_at).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

    this.stats = await this.scoreService.getMyStats();
    this.loadingStats = false;
  }

  formatTime(s: number): string { return ScoreService.formatTime(s); }

  ngAfterViewInit() {
    this.ctx = gsap.context(() => {
      gsap.from(this.cardRef.nativeElement, {
        autoAlpha: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out',
      });
    });
  }

  ngOnDestroy() { this.ctx?.revert(); }

  async signOut() {
    await this.auth.signOut();
    this.router.navigate(['/']);
  }
}
