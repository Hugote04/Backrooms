import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { ScoreService, Score } from '../../services/score.service';

// Orden canónico de los tabs de nivel
const NIVEL_ORDER = [
  'Level 0 — Los Pasillos',
  'Level 1 — Los Pasillos',
  'Level 2 — Las Oficinas',
  'Level 4 — Las Oficinas',
];

@Component({
  selector: 'app-leaderboard-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-[#050500] wallpaper-bg px-4 py-16">
      <div class="max-w-4xl mx-auto">

        <!-- Header -->
        <div #header class="text-center mb-12">
          <a routerLink="/" class="inline-flex flex-col items-center gap-2 mb-8">
            <img src="logo.png" alt="Backrooms logo"
                 class="h-12 w-12 object-contain"
                 style="filter: drop-shadow(0 0 8px rgba(212,200,122,0.4));" />
            <span class="text-2xl font-bold tracking-[0.2em] text-[#d4c87a] flicker-slow"
                  style="font-family: 'Space Mono', monospace;">
              BACKROOMS
            </span>
          </a>
          <h1 class="text-4xl md:text-5xl font-bold mb-3"
              style="font-family: 'Space Mono', monospace;">
            <span class="text-[#d4c87a] tracking-widest uppercase">Leaderboard</span>
          </h1>
          <p class="text-[#5a5828] font-mono text-xs tracking-widest">
            Mejores tiempos registrados — ordenados por velocidad
          </p>
        </div>

        <!-- Filtro de nivel -->
        <div #filters class="flex flex-wrap gap-2 justify-center mb-8">
          <button
            type="button"
            (click)="setNivel(null)"
            [class]="filterClass(null)"
          >Todos</button>
          @for (n of niveles; track n) {
            <button
              type="button"
              (click)="setNivel(n)"
              [class]="filterClass(n)"
            >{{ n }}</button>
          }
        </div>

        <!-- Tabla -->
        <div #table class="bg-[#0a0900] border border-[#d4c87a]/20">

          @if (loading) {
            <div class="py-16 text-center text-[#5a5828] font-mono text-xs tracking-widest">
              Cargando puntuaciones...
            </div>
          } @else if (filtered.length === 0) {
            <div class="py-16 text-center text-[#3a3620] font-mono text-xs tracking-widest">
              Aún no hay puntuaciones registradas.
            </div>
          } @else {
            <!-- Cabecera -->
            <div class="grid grid-cols-[3rem_1fr_1fr_6rem] gap-4 px-6 py-3
                         border-b border-[#d4c87a]/10">
              <span class="text-[#5a5828] font-mono text-[0.65rem] tracking-widest uppercase">#</span>
              <span class="text-[#5a5828] font-mono text-[0.65rem] tracking-widest uppercase">Jugador</span>
              <span class="text-[#5a5828] font-mono text-[0.65rem] tracking-widest uppercase">Nivel</span>
              <span class="text-[#5a5828] font-mono text-[0.65rem] tracking-widest uppercase text-right">Tiempo</span>
            </div>

            @for (score of filtered; track score.id; let i = $index) {
              <div
                class="grid grid-cols-[3rem_1fr_1fr_6rem] gap-4 px-6 py-4
                       hover:bg-[#d4c87a]/[0.03] transition-colors"
                [style.border-bottom]="i === 0 ? '1px solid rgba(212,200,122,0.2)' : '1px solid rgba(212,200,122,0.05)'"
              >
                <!-- Posición -->
                <span class="font-mono text-sm font-bold"
                      [class.text-[#d4c87a]]="i === 0"
                      [class.text-[#8b7a2e]]="i === 1"
                      [class.text-[#5a5828]]="i >= 2">
                  @if (i === 0) { 🥇 }
                  @else if (i === 1) { 🥈 }
                  @else if (i === 2) { 🥉 }
                  @else { {{ i + 1 }} }
                </span>

                <!-- Nombre -->
                <span class="text-[#b8a84a] font-mono text-xs tracking-wide truncate self-center">
                  {{ score.userName }}
                </span>

                <!-- Nivel -->
                <span class="text-[#5a5828] font-mono text-[0.65rem] tracking-widest truncate self-center">
                  {{ score.nivel }}
                </span>

                <!-- Tiempo -->
                <span class="font-mono text-sm text-right self-center"
                      [class.text-[#d4c87a]]="i === 0"
                      [class.text-[#b8a84a]]="i > 0">
                  {{ formatTime(score.tiempoSegundos) }}
                </span>
              </div>
            }
          }
        </div>

        <!-- Footer links -->
        <div #footer class="flex justify-center gap-6 mt-10">
          <a routerLink="/" class="text-[#3a3620] hover:text-[#8b7a2e] font-mono text-xs tracking-widest uppercase transition-colors">
            ← Inicio
          </a>
          <a routerLink="/descarga" class="text-[#3a3620] hover:text-[#8b7a2e] font-mono text-xs tracking-widest uppercase transition-colors">
            Descargar juego
          </a>
        </div>

      </div>
    </div>
  `,
})
export class LeaderboardPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('header') headerRef!: ElementRef;
  @ViewChild('filters') filtersRef!: ElementRef;
  @ViewChild('table')   tableRef!:   ElementRef;
  @ViewChild('footer')  footerRef!:  ElementRef;

  scores:   Score[] = [];
  filtered: Score[] = [];
  niveles:  string[] = [];
  nivelActivo: string | null = null;
  loading = true;

  private ctx!: gsap.Context;

  constructor(private scoreService: ScoreService, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    // getLeaderboard() ya normaliza los nombres de nivel
    this.scores = await this.scoreService.getLeaderboard();
    // Tabs en orden canónico — solo aparecen los niveles con entradas en BD
    const enBD = new Set(this.scores.map(s => s.nivel));
    const ordenados = NIVEL_ORDER.filter(n => enBD.has(n));
    const desconocidos = [...enBD].filter(n => !NIVEL_ORDER.includes(n));
    this.niveles = [...ordenados, ...desconocidos];
    this.filtered = this.scores;
    this.loading = false;
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    this.ctx = gsap.context(() => {
      gsap.from([this.headerRef.nativeElement, this.filtersRef.nativeElement, this.tableRef.nativeElement, this.footerRef.nativeElement], {
        autoAlpha: 0,
        y: 24,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.12,
      });
    });
  }

  ngOnDestroy() { this.ctx?.revert(); }

  setNivel(nivel: string | null) {
    this.nivelActivo = nivel;
    this.filtered = nivel ? this.scores.filter(s => s.nivel === nivel) : this.scores;
  }

  filterClass(nivel: string | null): string {
    const active = this.nivelActivo === nivel;
    const base = 'px-4 py-1.5 font-mono text-[0.65rem] tracking-widest uppercase border transition-all duration-200';
    return active
      ? `${base} border-[#d4c87a]/60 text-[#d4c87a] bg-[#d4c87a]/10`
      : `${base} border-[#d4c87a]/20 text-[#5a5828] hover:border-[#d4c87a]/40 hover:text-[#8b7a2e]`;
  }

  formatTime(s: number): string { return ScoreService.formatTime(s); }
}
