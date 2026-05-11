import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { gsap } from 'gsap';
import { AuthService } from '../../services/auth.service';
import { ScoreService, UserStats } from '../../services/score.service';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-perfil-page',
  standalone: true,
  imports: [RouterLink, FormsModule],
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
              <div class="relative group mb-4">
                <!-- Imagen o inicial -->
                @if (avatarUrl) {
                  <img
                    [src]="avatarUrl"
                    alt="Avatar"
                    class="w-20 h-20 object-cover border-2 border-[#d4c87a]/40"
                  />
                } @else {
                  <div class="w-20 h-20 bg-[#d4c87a]/15 border-2 border-[#d4c87a]/40
                               flex items-center justify-center text-[#d4c87a] font-mono font-bold text-3xl">
                    {{ initial }}
                  </div>
                }

                <!-- Overlay cambiar avatar -->
                <label
                  class="absolute inset-0 flex items-center justify-center
                         bg-black/60 opacity-0 group-hover:opacity-100
                         transition-opacity cursor-pointer"
                  title="Cambiar avatar"
                >
                  <svg class="w-5 h-5 text-[#d4c87a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    (change)="onAvatarChange($event)"
                  />
                </label>
              </div>

              @if (uploadingAvatar) {
                <p class="text-[#5a5828] font-mono text-[0.65rem] tracking-widest">Subiendo...</p>
              } @else if (avatarError) {
                <p class="text-red-400/70 font-mono text-[0.65rem]">{{ avatarError }}</p>
              }

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
            <div class="mb-8">
              <p class="text-[#5a5828] font-mono text-[0.65rem] tracking-widest uppercase mb-3">
                Estadísticas de juego
              </p>

              @if (loadingStats) {
                <div class="py-4 text-center text-[#3a3620] font-mono text-[0.65rem] tracking-widest">
                  Cargando...
                </div>
              } @else if (stats && stats.totalPartidas > 0) {
                <div class="grid grid-cols-3 gap-3 mb-3">
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
                    <p class="text-[#3a3620] font-mono text-[0.6rem] tracking-widest uppercase mt-0.5">Récord</p>
                  </div>
                </div>
                <div class="text-right">
                  <a routerLink="/leaderboard"
                     class="text-[#5a5828] hover:text-[#8b7a2e] font-mono text-[0.65rem] tracking-widest uppercase transition-colors">
                    Ver leaderboard →
                  </a>
                </div>
              } @else {
                <div class="py-4 border border-[#d4c87a]/10 text-center">
                  <p class="text-[#3a3620] font-mono text-[0.65rem] tracking-widest">
                    Aún no has jugado ninguna partida.
                  </p>
                  <a routerLink="/descarga"
                     class="text-[#5a5828] hover:text-[#8b7a2e] font-mono text-[0.65rem] tracking-widest uppercase transition-colors mt-1 inline-block">
                    Descargar juego →
                  </a>
                </div>
              }
            </div>

            <!-- Editar perfil -->
            <div class="mb-6 border-t border-[#d4c87a]/10 pt-6">
              <button
                type="button"
                (click)="editMode = !editMode"
                class="w-full py-2.5 font-mono tracking-widest uppercase text-xs text-[#5a5828]
                       border border-[#5a5828]/40 hover:border-[#8b7a2e]/60 hover:text-[#8b7a2e]
                       transition-all duration-200 mb-4"
              >
                {{ editMode ? 'Cancelar' : 'Editar perfil' }}
              </button>

              @if (editMode) {
                <form (ngSubmit)="saveProfile()" class="space-y-4">

                  <!-- Nombre -->
                  <div>
                    <label class="block text-[#5a5828] font-mono text-[0.65rem] tracking-widest uppercase mb-1.5">
                      Nombre de usuario
                    </label>
                    <input
                      type="text"
                      [(ngModel)]="editName"
                      name="editName"
                      class="w-full bg-[#050500] border border-[#d4c87a]/20 px-3 py-2
                             text-[#b8a84a] font-mono text-xs tracking-wide
                             focus:outline-none focus:border-[#d4c87a]/50 transition-colors"
                      placeholder="Tu nombre"
                    />
                  </div>

                  <!-- Contraseña -->
                  <div>
                    <label class="block text-[#5a5828] font-mono text-[0.65rem] tracking-widest uppercase mb-1.5">
                      Nueva contraseña
                    </label>
                    <input
                      type="password"
                      [(ngModel)]="editPassword"
                      name="editPassword"
                      class="w-full bg-[#050500] border border-[#d4c87a]/20 px-3 py-2
                             text-[#b8a84a] font-mono text-xs tracking-wide
                             focus:outline-none focus:border-[#d4c87a]/50 transition-colors"
                      placeholder="Dejar vacío para no cambiar"
                    />
                  </div>

                  <!-- Confirmar contraseña -->
                  @if (editPassword) {
                    <div>
                      <label class="block text-[#5a5828] font-mono text-[0.65rem] tracking-widest uppercase mb-1.5">
                        Confirmar contraseña
                      </label>
                      <input
                        type="password"
                        [(ngModel)]="editPasswordConfirm"
                        name="editPasswordConfirm"
                        class="w-full bg-[#050500] border border-[#d4c87a]/20 px-3 py-2
                               text-[#b8a84a] font-mono text-xs tracking-wide
                               focus:outline-none focus:border-[#d4c87a]/50 transition-colors"
                        placeholder="Repite la contraseña"
                      />
                    </div>
                  }

                  @if (editError) {
                    <p class="text-red-400/80 font-mono text-xs">{{ editError }}</p>
                  }
                  @if (editSuccess) {
                    <p class="text-[#d4c87a]/80 font-mono text-xs">{{ editSuccess }}</p>
                  }

                  <button
                    type="submit"
                    [disabled]="savingProfile"
                    class="w-full py-2.5 font-mono tracking-widest uppercase text-xs
                           bg-[#d4c87a]/10 border border-[#d4c87a]/40 text-[#d4c87a]
                           hover:bg-[#d4c87a]/20 transition-all duration-200
                           disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {{ savingProfile ? 'Guardando...' : 'Guardar cambios' }}
                  </button>
                </form>
              }
            </div>

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

  displayName    = '';
  email          = '';
  initial        = '';
  joinedDate     = '';
  avatarUrl:     string | null = null;
  stats:         UserStats | null = null;
  loadingStats   = true;
  uploadingAvatar = false;
  avatarError    = '';

  // edición
  editMode            = false;
  editName            = '';
  editPassword        = '';
  editPasswordConfirm = '';
  editError           = '';
  editSuccess         = '';
  savingProfile       = false;

  private userId = '';
  private ctx!: gsap.Context;

  constructor(
    private auth: AuthService,
    private router: Router,
    private scoreService: ScoreService,
    private reviewService: ReviewService,
  ) {}

  async ngOnInit() {
    const user = this.auth.user();
    if (!user) { this.router.navigate(['/login']); return; }

    this.userId      = user.id;
    this.email       = user.email ?? '';
    this.displayName = this.auth.getDisplayName();
    this.initial     = this.displayName.charAt(0).toUpperCase();
    this.joinedDate  = new Date(user.created_at).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

    const [stats, avatarUrl] = await Promise.all([
      this.scoreService.getMyStats(this.userId),
      this.scoreService.getAvatarUrl(this.userId),
    ]);
    this.stats       = stats;
    this.avatarUrl   = avatarUrl;
    this.loadingStats = false;
    this.editName    = this.displayName;
  }

  ngAfterViewInit() {
    this.ctx = gsap.context(() => {
      gsap.from(this.cardRef.nativeElement, {
        autoAlpha: 0, y: 30, duration: 0.8, ease: 'power2.out',
      });
    });
  }

  ngOnDestroy() { this.ctx?.revert(); }

  async onAvatarChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.uploadingAvatar = true;
    this.avatarError = '';
    const result = await this.scoreService.uploadAvatar(this.userId, file);
    this.uploadingAvatar = false;

    if (result.error) {
      this.avatarError = result.error;
    } else {
      this.avatarUrl = result.url ?? null;
    }
  }

  formatTime(s: number): string { return ScoreService.formatTime(s); }

  async saveProfile() {
    this.editError   = '';
    this.editSuccess = '';

    if (this.editPassword && this.editPassword !== this.editPasswordConfirm) {
      this.editError = 'Las contraseñas no coinciden.';
      return;
    }
    if (this.editPassword && this.editPassword.length < 6) {
      this.editError = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    this.savingProfile = true;
    let hasError = false;

    if (this.editName.trim() && this.editName.trim() !== this.displayName) {
      const oldName = this.displayName;
      const newName = this.editName.trim();
      const { error } = await this.auth.updateName(newName);
      if (error) { this.editError = error.message; hasError = true; }
      else {
        this.displayName = newName;
        this.initial     = newName.charAt(0).toUpperCase();
        // sync nombre en reseñas, comentarios y scores (incluye reclamar huérfanas)
        await this.reviewService.syncUserName(this.userId, oldName, newName);
      }
    }

    if (!hasError && this.editPassword) {
      const { error } = await this.auth.updatePassword(this.editPassword);
      if (error) { this.editError = error.message; hasError = true; }
    }

    this.savingProfile = false;
    if (!hasError) {
      this.editSuccess         = '¡Perfil actualizado!';
      this.editPassword        = '';
      this.editPasswordConfirm = '';
      setTimeout(() => { this.editSuccess = ''; this.editMode = false; }, 1500);
    }
  }

  async signOut() {
    await this.auth.signOut();
    this.router.navigate(['/']);
  }
}
