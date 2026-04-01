import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { AuthService } from '../../services/auth.service';

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

            <!-- Info -->
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

  displayName = '';
  email       = '';
  initial     = '';
  joinedDate  = '';

  private ctx!: gsap.Context;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    const user = this.auth.user();
    if (!user) { this.router.navigate(['/login']); return; }

    this.email       = user.email ?? '';
    this.displayName = this.auth.getDisplayName();
    this.initial     = this.displayName.charAt(0).toUpperCase();
    this.joinedDate  = new Date(user.created_at).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  }

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
