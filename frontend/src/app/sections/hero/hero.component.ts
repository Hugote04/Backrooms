import { Component, ElementRef, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { ShaderService } from '../../services/shader.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ButtonComponent } from '../../ui/button.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [NavbarComponent, ButtonComponent, RouterLink],
  template: `
    <canvas #shaderCanvas class="fixed inset-0 w-full h-full -z-10"></canvas>

    <div class="fixed inset-0 -z-9 pointer-events-none texture-overlay scanlines opacity-40"></div>

    <div class="relative min-h-screen flex flex-col">
      <app-navbar />

      <main class="flex-1 flex items-center justify-center pt-16">
        <div class="container mx-auto px-6 text-center">

          <!-- Badge -->
          <div #badge
            class="inline-flex items-center gap-2 px-4 py-1.5
                   border border-[#d4c87a]/40 bg-[#d4c87a]/[0.08]
                   text-[#b8a84a] text-xs font-mono tracking-[0.2em] uppercase mb-10"
          >
            <span class="w-1.5 h-1.5 bg-[#d4c87a] flicker inline-block"></span>
            SISTEMA ACTIVO · NIVEL 0 DETECTADO
          </div>

          <!-- Título -->
          <h1 #titleLine1
            class="block text-6xl md:text-8xl lg:text-9xl font-bold leading-none mb-2 tracking-tight"
            style="font-family: 'Space Mono', monospace;"
          >
            <span class="text-[#e8e6b8] glow-pulse">ENTRA EN</span>
          </h1>
          <h1 #titleLine2
            class="block text-6xl md:text-8xl lg:text-9xl font-bold leading-none mb-8 tracking-tight"
            style="font-family: 'Space Mono', monospace;"
          >
            <span class="text-[#d4c87a] flicker">LAS BACKROOMS</span>
          </h1>

          <!-- Subtítulo -->
          <p #subtitle
            class="text-sm md:text-base font-mono text-[#8b7a2e] max-w-xl mx-auto mb-12 leading-relaxed tracking-wide"
          >
            &gt; ACECHANDO EN LAS SOMBRAS_<br/>
            &gt; Explora corredores liminales infinitos.<br/>
            &gt; Sobrevive. Descubre. No salgas.
          </p>

          <!-- Botones CTA -->
          <div #ctaButtons class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a routerLink="/descarga">
              <app-button variant="cta" size="lg">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                [ DESCARGAR — GRATIS ]
              </app-button>
            </a>
            <a routerLink="/demo"
               class="flex items-center gap-2 px-6 py-3 border border-[#d4c87a]/40 text-[#d4c87a]
                      hover:bg-[#d4c87a]/10 hover:shadow-[0_0_20px_rgba(212,200,122,0.15)]
                      font-mono text-sm tracking-widest uppercase transition-all duration-200">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Jugar demo web
            </a>
          </div>

        </div>
      </main>

      <!-- Scroll indicator -->
      <div #scrollIndicator class="flex justify-center pb-10">
        <div class="flex flex-col items-center gap-2 text-[#5a5828] text-xs font-mono tracking-widest">
          <span>SCROLL PARA AVANZAR</span>
          <div class="w-px h-8 bg-gradient-to-b from-[#d4c87a]/40 to-transparent"></div>
        </div>
      </div>
    </div>
  `,
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('shaderCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('badge')          badgeRef!:          ElementRef;
  @ViewChild('titleLine1')     title1Ref!:         ElementRef;
  @ViewChild('titleLine2')     title2Ref!:         ElementRef;
  @ViewChild('subtitle')       subtitleRef!:       ElementRef;
  @ViewChild('ctaButtons')     ctaRef!:            ElementRef;
  @ViewChild('scrollIndicator') scrollRef!:        ElementRef;

  private ctx!: gsap.Context;

  constructor(private shader: ShaderService) {}

  ngAfterViewInit() {
    this.shader.init(this.canvasRef.nativeElement);

    this.ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      tl.from(this.badgeRef.nativeElement, {
        autoAlpha: 0, y: -20, duration: 0.6, delay: 0.3, immediateRender: false,
      })
      .from(this.title1Ref.nativeElement, {
        autoAlpha: 0, y: 40, skewX: -3, duration: 0.9, ease: 'power3.out', immediateRender: false,
      }, '-=0.2')
      .from(this.title2Ref.nativeElement, {
        autoAlpha: 0, y: 40, skewX: -3, duration: 0.9, ease: 'power3.out', immediateRender: false,
      }, '-=0.7')
      .from(this.subtitleRef.nativeElement, {
        autoAlpha: 0, y: 20, duration: 0.7, immediateRender: false,
      }, '-=0.4')
      .from(this.ctaRef.nativeElement, {
        autoAlpha: 0, y: 16, duration: 0.6, immediateRender: false,
      }, '-=0.3')
      .from(this.scrollRef.nativeElement, {
        autoAlpha: 0, duration: 0.5, immediateRender: false,
      }, '-=0.1');
    });
  }

  ngOnDestroy() {
    this.shader.destroy();
    this.ctx?.revert();
  }
}
