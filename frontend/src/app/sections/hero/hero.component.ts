import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ShaderService } from '../../services/shader.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ButtonComponent } from '../../ui/button.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [NavbarComponent, ButtonComponent],
  template: `
    <!-- Shader canvas — fullscreen background -->
    <canvas
      #shaderCanvas
      class="fixed inset-0 w-full h-full -z-10"
    ></canvas>

    <!-- Page wrapper -->
    <div class="relative min-h-screen flex flex-col">

      <app-navbar />

      <!-- Hero content -->
      <main class="flex-1 flex items-center justify-center pt-16">
        <div class="container mx-auto px-4 text-center">

          <!-- Badge -->
          <div
            class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                   border border-orange-500/30 bg-orange-500/10 text-orange-300
                   text-sm font-medium mb-8
                   opacity-0 animate-fade-in-down"
            style="animation-delay: 0ms; animation-fill-mode: forwards;"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>
            Now Available — v1.0
          </div>

          <!-- Main heading -->
          <h1
            class="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6
                   opacity-0 animate-fade-in-down"
            style="animation-delay: 200ms; animation-fill-mode: forwards;"
          >
            <span class="bg-gradient-to-r from-orange-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent">
              Enter The
            </span>
            <br />
            <span class="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Backrooms
            </span>
          </h1>

          <!-- Subtitle -->
          <p
            class="text-lg md:text-xl lg:text-2xl font-light text-orange-100/70 max-w-2xl mx-auto mb-10
                   opacity-0 animate-fade-in-up"
            style="animation-delay: 400ms; animation-fill-mode: forwards;"
          >
            Lurking In The Shadows. Explore endless liminal spaces,
            survive the unknown, and uncover the secrets that dwell within.
          </p>

          <!-- CTA buttons -->
          <div
            class="flex flex-col sm:flex-row items-center justify-center gap-4
                   opacity-0 animate-fade-in-up"
            style="animation-delay: 600ms; animation-fill-mode: forwards;"
          >
            <app-button
              variant="cta"
              size="lg"
              class="w-full sm:w-auto"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Download Now — Free
            </app-button>

            <app-button
              variant="outline"
              size="lg"
              class="w-full sm:w-auto"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Watch Trailer
            </app-button>
          </div>

          <!-- Social proof -->
          <div
            class="flex flex-wrap items-center justify-center gap-6 mt-14 text-orange-100/50 text-sm
                   opacity-0 animate-fade-in-up"
            style="animation-delay: 800ms; animation-fill-mode: forwards;"
          >
            <span class="flex items-center gap-1.5">
              <span class="text-orange-400 font-semibold text-base">50K+</span> Downloads
            </span>
            <span class="w-px h-4 bg-orange-500/20"></span>
            <span class="flex items-center gap-1.5">
              <span class="text-orange-400 font-semibold text-base">4.8</span>
              <span class="text-orange-400">★★★★★</span>
            </span>
            <span class="w-px h-4 bg-orange-500/20"></span>
            <span class="flex items-center gap-1.5">
              <span class="text-orange-400 font-semibold text-base">1000+</span> Reviews
            </span>
          </div>

        </div>
      </main>

      <!-- Scroll indicator -->
      <div
        class="flex justify-center pb-8 opacity-0 animate-fade-in-up"
        style="animation-delay: 1000ms; animation-fill-mode: forwards;"
      >
        <div class="flex flex-col items-center gap-1 text-orange-500/40 text-xs">
          <span>Scroll</span>
          <svg class="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </div>

    </div>
  `,
})
export class HeroComponent implements OnInit, OnDestroy {
  @ViewChild('shaderCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  constructor(private shader: ShaderService) {}

  ngOnInit(): void {
    this.shader.init(this.canvasRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.shader.destroy();
  }
}
