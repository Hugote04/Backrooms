import { Component, signal, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[#050500] wallpaper-bg flex items-center justify-center px-4 py-16">
      <div class="w-full max-w-md">

        <div #card>
          <!-- Logo -->
          <div class="text-center mb-10">
            <a routerLink="/" class="inline-block mb-2">
              <span class="text-2xl font-bold tracking-[0.2em] text-[#d4c87a] flicker-slow"
                    style="font-family: 'Space Mono', monospace;">
                BACKROOMS
              </span>
            </a>
            <p class="text-[#5a5828] font-mono text-xs tracking-[0.3em] uppercase">Lurking In The Shadows</p>
          </div>

          <!-- Card -->
          <div class="bg-[#0e0d04] border border-[#d4c87a]/20 p-8">
            <h1 class="text-[#d4c87a] font-mono text-xl tracking-[0.2em] uppercase mb-1"
                style="font-family: 'Space Mono', monospace;">
              Iniciar Sesión
            </h1>
            <p class="text-[#5a5828] font-mono text-xs tracking-widest mb-8">
              Accede a tu cuenta para dejar reseñas.
            </p>

            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">

              <div>
                <label class="block text-[#8b7a2e] font-mono text-xs tracking-widest uppercase mb-1.5">Email</label>
                <input
                  formControlName="email"
                  type="email"
                  placeholder="tu@email.com"
                  class="w-full bg-[#080700] border border-[#d4c87a]/20 px-4 py-3
                         text-[#d4c87a] font-mono text-sm placeholder:text-[#3a3620]
                         focus:outline-none focus:border-[#d4c87a]/60 transition-all"
                />
                @if (form.controls.email.touched && form.controls.email.invalid) {
                  <p class="text-red-400/80 font-mono text-xs mt-1">Email inválido.</p>
                }
              </div>

              <div>
                <label class="block text-[#8b7a2e] font-mono text-xs tracking-widest uppercase mb-1.5">Contraseña</label>
                <input
                  formControlName="password"
                  type="password"
                  placeholder="••••••••"
                  class="w-full bg-[#080700] border border-[#d4c87a]/20 px-4 py-3
                         text-[#d4c87a] font-mono text-sm placeholder:text-[#3a3620]
                         focus:outline-none focus:border-[#d4c87a]/60 transition-all"
                />
              </div>

              @if (error()) {
                <p class="text-red-400 font-mono text-xs py-2 px-3 border border-red-500/20 bg-red-500/10">
                  {{ error() }}
                </p>
              }

              <button
                type="submit"
                [disabled]="loading()"
                class="w-full py-3 font-mono tracking-widest uppercase text-xs text-[#d4c87a]
                       border border-[#d4c87a]/60 bg-[#d4c87a]/[0.08]
                       hover:bg-[#d4c87a]/[0.18] hover:shadow-[0_0_16px_rgba(212,200,122,0.2)]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200"
              >
                {{ loading() ? 'Entrando...' : 'Iniciar Sesión' }}
              </button>

            </form>

            <p class="text-[#3a3620] font-mono text-xs mt-6 text-center tracking-widest">
              ¿No tienes cuenta?
              <a routerLink="/registro" class="text-[#8b7a2e] hover:text-[#d4c87a] ml-1 transition-colors">
                Regístrate
              </a>
            </p>
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
export class LoginPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('card') cardRef!: ElementRef;

  form = new FormGroup({
    email:    new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  loading = signal(false);
  error   = signal('');

  private ctx!: gsap.Context;

  constructor(private auth: AuthService, private router: Router) {}

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

  async onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.error.set('');

    const { email, password } = this.form.getRawValue();
    const { error } = await this.auth.signIn(email, password);

    if (error) {
      this.error.set(this.translateError(error.message));
    } else {
      this.router.navigate(['/']);
    }
    this.loading.set(false);
  }

  private translateError(msg: string): string {
    if (msg.includes('Invalid login')) return 'Email o contraseña incorrectos.';
    if (msg.includes('Email not confirmed')) return 'Confirma tu email antes de entrar.';
    return 'Error al iniciar sesión. Inténtalo de nuevo.';
  }
}
