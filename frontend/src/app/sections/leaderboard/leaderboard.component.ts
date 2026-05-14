import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScoreService, Score } from '../../services/score.service';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section #section class="py-24 px-4 border-t border-[#d4c87a]/10">
      <div class="max-w-4xl mx-auto">

        <!-- Header -->
        <div #header class="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <div class="flex items-center gap-2 mb-3">
              <span class="h-px w-6 bg-[#d4c87a]/30"></span>
              <span class="text-[#5a5828] font-mono text-[0.6rem] tracking-[0.4em] uppercase">Ranking global</span>
            </div>
            <h2 class="text-2xl md:text-3xl font-bold tracking-[0.12em] text-[#d4c87a] uppercase"
                style="font-family: 'Space Mono', monospace;">
              Leaderboard
            </h2>
            <p class="text-[#5a5828] font-mono text-xs mt-2">
              Mejores tiempos registrados desde el juego
            </p>
          </div>
          <a routerLink="/leaderboard"
             class="text-[#5a5828] hover:text-[#d4c87a] font-mono text-[0.65rem]
                    tracking-widest uppercase transition-colors shrink-0">
            Ver ranking completo →
          </a>
        </div>

        <!-- Tabla top 5 -->
        <div #table class="bg-[#0a0900] border border-[#d4c87a]/15">

          @if (loading) {
            <div class="py-12 text-center text-[#3a3620] font-mono text-xs tracking-widest animate-pulse">
              Cargando puntuaciones...
            </div>
          } @else if (top5.length === 0) {
            <!-- Estado vacío — invita a jugar -->
            <div class="py-16 flex flex-col items-center gap-4">
              <p class="text-[#3a3620] font-mono text-xs tracking-widest text-center">
                Aún no hay puntuaciones. ¡Sé el primero en el ranking!
              </p>
              <a routerLink="/descarga"
                 class="px-6 py-2.5 font-mono tracking-widest uppercase text-xs
                        border border-[#d4c87a]/40 text-[#d4c87a]
                        hover:bg-[#d4c87a]/10 transition-all duration-200">
                Descargar el juego
              </a>
            </div>
          } @else {
            <!-- Cabecera -->
            <div class="grid grid-cols-[3rem_1fr_1fr_6rem] gap-4 px-6 py-3
                        border-b border-[#d4c87a]/10">
              <span class="text-[#3a3620] font-mono text-[0.6rem] tracking-widest uppercase">#</span>
              <span class="text-[#3a3620] font-mono text-[0.6rem] tracking-widest uppercase">Jugador</span>
              <span class="text-[#3a3620] font-mono text-[0.6rem] tracking-widest uppercase">Nivel</span>
              <span class="text-[#3a3620] font-mono text-[0.6rem] tracking-widest uppercase text-right">Tiempo</span>
            </div>

            @for (score of top5; track score.id; let i = $index) {
              <div class="grid grid-cols-[3rem_1fr_1fr_6rem] gap-4 px-6 py-4
                          border-b border-[#d4c87a]/[0.04] last:border-0
                          hover:bg-[#d4c87a]/[0.025] transition-colors duration-150">

                <!-- Posición -->
                <span class="font-mono text-sm font-bold self-center"
                      [class.text-\[#d4c87a\]]="i === 0"
                      [class.text-\[#8b7a2e\]]="i === 1"
                      [class.text-\[#5a5828\]]="i >= 2">
                  @if (i === 0) { 🥇 }
                  @else if (i === 1) { 🥈 }
                  @else if (i === 2) { 🥉 }
                  @else { {{ i + 1 }} }
                </span>

                <!-- Nombre -->
                <span class="font-mono text-xs tracking-wide truncate self-center"
                      [class.text-\[#d4c87a\]]="i === 0"
                      [class.text-\[#b8a84a\]]="i > 0">
                  {{ score.userName }}
                </span>

                <!-- Nivel -->
                <span class="text-[#5a5828] font-mono text-[0.65rem] tracking-wider truncate self-center">
                  {{ score.nivel }}
                </span>

                <!-- Tiempo -->
                <span class="font-mono text-sm text-right self-center"
                      [class.text-\[#d4c87a\]]="i === 0"
                      [class.text-\[#8b7a2e\]]="i > 0">
                  {{ formatTime(score.tiempoSegundos) }}
                </span>
              </div>
            }
          }
        </div>

        <!-- CTA -->
        @if (top5.length > 0) {
          <div #cta class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3
                           border-t border-[#d4c87a]/10 pt-6">
            <p class="text-[#3a3620] font-mono text-xs">
              ¿Puedes batir el récord?
            </p>
            <div class="flex gap-3">
              <a routerLink="/descarga"
                 class="px-5 py-2 font-mono tracking-widest uppercase text-xs
                        bg-[#d4c87a] text-[#050500] font-bold
                        hover:bg-[#f0ecc4] hover:shadow-[0_0_20px_rgba(212,200,122,0.3)]
                        transition-all duration-200">
                Descargar juego
              </a>
              <a routerLink="/leaderboard"
                 class="px-5 py-2 font-mono tracking-widest uppercase text-xs
                        border border-[#d4c87a]/40 text-[#5a5828]
                        hover:border-[#d4c87a]/70 hover:text-[#d4c87a]
                        transition-all duration-200">
                Ranking completo
              </a>
            </div>
          </div>
        }

      </div>
    </section>
  `,
})
export class LeaderboardSectionComponent implements OnInit, AfterViewInit {
  @ViewChild('section') sectionRef!: ElementRef;
  @ViewChild('header')  headerRef!:  ElementRef;
  @ViewChild('table')   tableRef!:   ElementRef;

  scores: Score[] = [];
  top5:   Score[] = [];
  loading = true;

  constructor(private scoreService: ScoreService) {}

  async ngOnInit() {
    this.scores = await this.scoreService.getLeaderboard();
    this.top5   = this.scores.slice(0, 5);
    this.loading = false;
  }

  ngAfterViewInit() {
    gsap.from([this.headerRef?.nativeElement, this.tableRef?.nativeElement], {
      autoAlpha: 0,
      y: 30,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: this.sectionRef?.nativeElement,
        start: 'top 80%',
      },
    });
  }

  formatTime(s: number): string { return ScoreService.formatTime(s); }
}
