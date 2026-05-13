import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ViewChild, ElementRef, signal, computed, ChangeDetectorRef
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';

declare function createUnityInstance(
  canvas: HTMLCanvasElement,
  config: Record<string, unknown>,
  onProgress?: (progress: number) => void
): Promise<{ SetFullscreen: (v: number) => void }>;

@Component({
  selector: 'app-demo-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-[#050500] wallpaper-bg">

      <!-- Navbar spacing -->
      <div class="h-14"></div>

      <!-- ── Hero header ── -->
      <section #heroSection class="pt-12 pb-8 text-center px-4">
        <div class="inline-flex items-center gap-2 mb-4">
          <span class="h-px w-8 bg-[#d4c87a]/30"></span>
          <span class="text-[#5a5828] font-mono text-[0.6rem] tracking-[0.4em] uppercase">Demo gratuita</span>
          <span class="h-px w-8 bg-[#d4c87a]/30"></span>
        </div>
        <h1 class="text-3xl md:text-4xl font-bold tracking-[0.15em] text-[#d4c87a] uppercase mb-2"
            style="font-family: 'Space Mono', monospace;">
          Lurking In The Shadows
        </h1>
        <p class="text-[#5a5828] font-mono text-xs tracking-widest uppercase mb-6">
          Web Demo · Backrooms
        </p>
        <p class="text-[#8b7a2e] font-mono text-sm max-w-xl mx-auto leading-relaxed">
          Explora los Backrooms directamente en tu navegador. Sin instalación.
          <br/>
          <span class="text-[#3a3620] text-xs">Requiere WebGL 2.0 · Recomendado Chrome / Firefox · Desktop</span>
        </p>
      </section>

      <!-- ── Contenedor principal del juego ── -->
      <section class="flex justify-center px-4 pb-12">
        <div class="w-full max-w-5xl">

          <!-- Marco exterior con efecto glow -->
          <div class="relative border border-[#d4c87a]/25
                      shadow-[0_0_40px_rgba(212,200,122,0.06),inset_0_0_40px_rgba(0,0,0,0.5)]">

            <!-- Esquinas decorativas -->
            <div class="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#d4c87a]/50 -translate-x-px -translate-y-px"></div>
            <div class="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#d4c87a]/50 translate-x-px -translate-y-px"></div>
            <div class="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#d4c87a]/50 -translate-x-px translate-y-px"></div>
            <div class="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#d4c87a]/50 translate-x-px translate-y-px"></div>

            <!-- Pantalla de inicio (antes de cargar) -->
            @if (phase() === 'idle') {
              <div #splashScreen
                   class="aspect-video w-full bg-[#040400] flex flex-col items-center justify-center gap-8 cursor-pointer group"
                   (click)="startLoading()">

                <!-- Logo grande -->
                <div class="flex flex-col items-center gap-4">
                  <img src="logo.png" alt="logo"
                       class="w-20 h-20 opacity-70 group-hover:opacity-100 transition-all duration-500
                              group-hover:drop-shadow-[0_0_20px_rgba(212,200,122,0.5)]"
                       style="filter: drop-shadow(0 0 12px rgba(212,200,122,0.3));" />
                  <div class="text-center">
                    <p class="text-[#d4c87a] font-mono font-bold tracking-[0.3em] uppercase text-lg flicker-slow">
                      LURKING IN THE SHADOWS
                    </p>
                    <p class="text-[#5a5828] font-mono text-[0.6rem] tracking-[0.5em] uppercase mt-1">
                      Backrooms · Web Demo
                    </p>
                  </div>
                </div>

                <!-- Botón play -->
                <div class="flex flex-col items-center gap-3">
                  <div class="relative w-20 h-20 border-2 border-[#d4c87a]/40 group-hover:border-[#d4c87a]/80
                               flex items-center justify-center transition-all duration-300
                               group-hover:shadow-[0_0_30px_rgba(212,200,122,0.2)]">
                    <svg class="w-8 h-8 text-[#d4c87a]/60 group-hover:text-[#d4c87a] transition-colors duration-300 ml-1"
                         fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <span class="text-[#8b7a2e] group-hover:text-[#d4c87a] font-mono text-xs tracking-[0.4em] uppercase transition-colors duration-300">
                    Jugar demo
                  </span>
                </div>

                <!-- Advertencia WebGL -->
                <p class="text-[#3a3620] font-mono text-[0.6rem] tracking-widest text-center max-w-xs">
                  Al iniciar se descargarán ~30 MB del juego
                </p>
              </div>
            }

            <!-- Pantalla de carga -->
            @if (phase() === 'loading') {
              <div class="aspect-video w-full bg-[#040400] flex flex-col items-center justify-center gap-6">
                <img src="logo.png" alt="logo"
                     class="w-16 h-16 opacity-60 animate-pulse"
                     style="filter: drop-shadow(0 0 10px rgba(212,200,122,0.3));" />

                <div class="text-center">
                  <p class="text-[#d4c87a] font-mono text-sm tracking-[0.3em] uppercase mb-1 flicker-slow">
                    Cargando
                  </p>
                  <p class="text-[#5a5828] font-mono text-[0.6rem] tracking-[0.4em] uppercase">
                    {{ loadingLabel() }}
                  </p>
                </div>

                <!-- Barra de progreso custom -->
                <div class="w-64">
                  <div class="h-px bg-[#d4c87a]/10 relative overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-[#5a5828] to-[#d4c87a] transition-all duration-300"
                         [style.width]="progressPct() + '%'"></div>
                  </div>
                  <div class="flex justify-between mt-1.5">
                    <span class="text-[#3a3620] font-mono text-[0.55rem] tracking-widest">BACKROOMS</span>
                    <span class="text-[#5a5828] font-mono text-[0.55rem]">{{ progressPct() }}%</span>
                  </div>
                </div>
              </div>
            }

            <!-- Canvas del juego (oculto hasta que cargue) -->
            <div [style.display]="phase() === 'playing' ? 'block' : 'none'"
                 class="relative">
              <canvas #unityCanvas
                      id="unity-canvas"
                      tabindex="-1"
                      class="w-full aspect-video block bg-[#231F20]">
              </canvas>

              <!-- Barra inferior del juego -->
              <div class="flex items-center justify-between px-4 py-2
                          bg-[#0a0900] border-t border-[#d4c87a]/10">
                <div class="flex items-center gap-2">
                  <img src="logo.png" alt="logo" class="w-5 h-5 opacity-50" />
                  <span class="text-[#3a3620] font-mono text-[0.6rem] tracking-widest uppercase">
                    Lurking In The Shadows · Demo
                  </span>
                </div>
                <div class="flex items-center gap-3">
                  <!-- Botón fullscreen -->
                  <button type="button"
                          (click)="setFullscreen()"
                          class="flex items-center gap-1.5 text-[#5a5828] hover:text-[#d4c87a]
                                 font-mono text-[0.6rem] tracking-widest uppercase transition-colors"
                          title="Pantalla completa">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                    </svg>
                    Pantalla completa
                  </button>
                </div>
              </div>
            </div>

            <!-- Error -->
            @if (phase() === 'error') {
              <div class="aspect-video w-full bg-[#040400] flex flex-col items-center justify-center gap-4">
                <p class="text-red-400/70 font-mono text-sm tracking-widest">Error al cargar el juego</p>
                <p class="text-[#3a3620] font-mono text-xs">{{ errorMsg() }}</p>
                <button type="button" (click)="retry()"
                        class="text-[#5a5828] hover:text-[#8b7a2e] font-mono text-xs tracking-widest uppercase transition-colors">
                  Reintentar →
                </button>
              </div>
            }
          </div>

          <!-- ── Controles + info ── -->
          @if (phase() === 'playing') {
            <div #controlsBar class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              @for (ctrl of controls; track ctrl.key) {
                <div class="bg-[#0a0900] border border-[#d4c87a]/10 px-4 py-3 flex items-center gap-3">
                  <kbd class="bg-[#d4c87a]/10 border border-[#d4c87a]/30 text-[#d4c87a] font-mono text-[0.65rem]
                               px-2 py-1 min-w-[2rem] text-center tracking-wider shrink-0">
                    {{ ctrl.key }}
                  </kbd>
                  <span class="text-[#5a5828] font-mono text-[0.65rem] tracking-widest uppercase">
                    {{ ctrl.action }}
                  </span>
                </div>
              }
            </div>
          }

          <!-- ── Links de descarga ── -->
          <div class="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4
                      border-t border-[#d4c87a]/10 pt-6">
            <div>
              <p class="text-[#5a5828] font-mono text-[0.65rem] tracking-widest uppercase mb-1">
                ¿Te ha gustado la demo?
              </p>
              <p class="text-[#3a3620] font-mono text-[0.6rem]">
                Descarga la versión completa para PC — totalmente gratuita
              </p>
            </div>
            <div class="flex gap-3">
              <a routerLink="/descarga"
                 class="px-6 py-2.5 font-mono tracking-widest uppercase text-xs
                        border border-[#d4c87a]/60 text-[#d4c87a]
                        hover:bg-[#d4c87a]/10 hover:shadow-[0_0_16px_rgba(212,200,122,0.15)]
                        transition-all duration-200">
                Descargar gratis
              </a>
              <a routerLink="/"
                 class="px-6 py-2.5 font-mono tracking-widest uppercase text-xs
                        border border-[#5a5828]/40 text-[#5a5828]
                        hover:border-[#8b7a2e]/60 hover:text-[#8b7a2e]
                        transition-all duration-200">
                Inicio
              </a>
            </div>
          </div>

        </div>
      </section>

    </div>
  `,
})
export class DemoPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('unityCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('heroSection') heroRef!: ElementRef;
  @ViewChild('splashScreen') splashRef!: ElementRef;

  phase    = signal<'idle' | 'loading' | 'playing' | 'error'>('idle');
  progress = signal(0);
  errorMsg = signal('');

  progressPct = computed(() => Math.round(this.progress() * 100));
  loadingLabel = computed(() => {
    const p = this.progress();
    if (p < 0.1) return 'Inicializando...';
    if (p < 0.4) return 'Cargando datos del juego...';
    if (p < 0.7) return 'Compilando shaders...';
    if (p < 0.95) return 'Preparando escena...';
    return 'Casi listo...';
  });

  controls = [
    { key: 'WASD',  action: 'Moverse'   },
    { key: 'Mouse', action: 'Mirar'     },
    { key: 'TAB',   action: 'Inventario'},
  ];

  private unityInstance: { SetFullscreen: (v: number) => void } | null = null;
  private ctx!: gsap.Context;
  private boundRefocus!: () => void;
  private boundPointerLockChange!: () => void;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.ctx = gsap.context(() => {
      gsap.from(this.heroRef?.nativeElement, {
        autoAlpha: 0, y: 20, duration: 0.8, ease: 'power2.out',
      });
    });
  }

  ngOnDestroy() {
    this.ctx?.revert();
    this.removeCanvasFocusHandlers();
  }

  startLoading() {
    this.phase.set('loading');
    this.progress.set(0);
    this.loadUnity();
  }

  retry() {
    this.phase.set('idle');
    this.errorMsg.set('');
  }

  setFullscreen() {
    this.unityInstance?.SetFullscreen(1);
  }

  /**
   * Cuando el pointer lock se libera (p.ej. al morir) el canvas pierde el foco
   * y los clics en los botones del juego no llegan a Unity.
   * Solución: re-enfocar el canvas en cualquier clic sobre él y al salir del pointer lock.
   */
  private setupCanvasFocusHandlers(canvas: HTMLCanvasElement) {
    this.boundRefocus = () => { canvas.focus(); };
    this.boundPointerLockChange = () => {
      if (!document.pointerLockElement) {
        // Pointer lock liberado: el siguiente clic debe re-enfocar el canvas
        canvas.focus();
      }
    };
    canvas.addEventListener('click',       this.boundRefocus);
    canvas.addEventListener('mousedown',   this.boundRefocus);
    document.addEventListener('pointerlockchange', this.boundPointerLockChange);
  }

  private removeCanvasFocusHandlers() {
    const canvas = this.canvasRef?.nativeElement;
    if (canvas && this.boundRefocus) {
      canvas.removeEventListener('click',     this.boundRefocus);
      canvas.removeEventListener('mousedown', this.boundRefocus);
    }
    if (this.boundPointerLockChange) {
      document.removeEventListener('pointerlockchange', this.boundPointerLockChange);
    }
  }

  private loadUnity() {
    // Evitar doble carga si el script ya existe
    const existingScript = document.getElementById('unity-loader-script');
    if (existingScript) {
      this.initUnityInstance();
      return;
    }

    const script = document.createElement('script');
    script.id  = 'unity-loader-script';
    script.src = '/game/Build/Web.loader.js';
    script.onload = () => this.initUnityInstance();
    script.onerror = () => {
      this.phase.set('error');
      this.errorMsg.set('No se pudo cargar el loader del juego.');
    };
    document.body.appendChild(script);
  }

  private initUnityInstance() {
    // Esperar a que el canvas esté visible en el DOM
    setTimeout(() => {
      const canvas = this.canvasRef?.nativeElement;
      if (!canvas) {
        this.phase.set('error');
        this.errorMsg.set('Canvas no encontrado.');
        return;
      }

      const config = {
        dataUrl:             '/game/Build/Web.data.br',
        frameworkUrl:        '/game/Build/Web.framework.js.br',
        codeUrl:             '/game/Build/Web.wasm.br',
        streamingAssetsUrl:  '/game/StreamingAssets',
        companyName:         'PFC',
        productName:         'Lurking In The Shadows',
        productVersion:      '1.0',
      };

      createUnityInstance(canvas, config, (p) => {
        this.progress.set(p);
        this.cdr.detectChanges();
      })
        .then((instance) => {
          this.unityInstance = instance;
          this.phase.set('playing');
          this.cdr.detectChanges();
          // Re-focus handlers: arregla botones de reinicio/menú tras muerte
          setTimeout(() => this.setupCanvasFocusHandlers(canvas), 100);
          // Animar controles
          setTimeout(() => {
            gsap.from('#controlsBar > *', {
              autoAlpha: 0, y: 10, stagger: 0.06, duration: 0.4, ease: 'power1.out',
            });
          }, 200);
        })
        .catch((msg: string) => {
          this.phase.set('error');
          this.errorMsg.set(msg ?? 'Error desconocido al inicializar Unity.');
          this.cdr.detectChanges();
        });
    }, 50);
  }
}
