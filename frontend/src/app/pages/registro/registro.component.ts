import { Component, signal, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[#050500] wallpaper-bg flex items-center justify-center px-4 py-16">
      <div class="w-full max-w-md">

        <div #card>
          <!-- Logo -->
          <div class="text-center mb-10">
            <a routerLink="/" class="inline-flex flex-col items-center gap-2">
              <img src="logo.png" alt="Backrooms logo"
                   class="h-12 w-12 object-contain"
                   style="filter: drop-shadow(0 0 8px rgba(212,200,122,0.4));" />
              <span class="text-2xl font-bold tracking-[0.2em] text-[#d4c87a] flicker-slow"
                    style="font-family: 'Space Mono', monospace;">
                BACKROOMS
              </span>
            </a>
            <p class="text-[#5a5828] font-mono text-xs tracking-[0.3em] uppercase mt-1">Lurking In The Shadows</p>
          </div>

          <!-- Card -->
          <div class="bg-[#0e0d04] border border-[#d4c87a]/20 p-8">
            <h1 class="text-[#d4c87a] font-mono text-xl tracking-[0.2em] uppercase mb-1"
                style="font-family: 'Space Mono', monospace;">
              Crear Cuenta
            </h1>
            <p class="text-[#5a5828] font-mono text-xs tracking-widest mb-8">
              Únete a la comunidad de exploradores.
            </p>

            @if (success()) {
              <div class="text-center py-8">
                <div class="text-4xl mb-4">✉️</div>
                <h2 class="text-[#d4c87a] font-mono font-bold tracking-widest uppercase mb-2">¡Revisa tu email!</h2>
                <p class="text-[#5a5828] font-mono text-xs tracking-widest">Te hemos enviado un enlace de confirmación.</p>
                <a routerLink="/login"
                   class="inline-block mt-6 text-[#8b7a2e] hover:text-[#d4c87a] font-mono text-xs tracking-widest uppercase transition-colors">
                  Ir a Iniciar Sesión →
                </a>
              </div>
            } @else {
              <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">

                <!-- Nombre -->
                <div>
                  <label class="block text-[#8b7a2e] font-mono text-xs tracking-widest uppercase mb-1.5">
                    Nombre (opcional)
                  </label>
                  <input
                    formControlName="nombre"
                    type="text"
                    placeholder="Tu nombre de jugador"
                    class="w-full bg-[#080700] border border-[#d4c87a]/20 px-4 py-3
                           text-[#d4c87a] font-mono text-sm placeholder:text-[#3a3620]
                           focus:outline-none focus:border-[#d4c87a]/60 transition-all"
                  />
                </div>

                <!-- Email -->
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

                <!-- Contraseña -->
                <div>
                  <label class="block text-[#8b7a2e] font-mono text-xs tracking-widest uppercase mb-1.5">
                    Contraseña
                  </label>
                  <input
                    formControlName="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    class="w-full bg-[#080700] border border-[#d4c87a]/20 px-4 py-3
                           text-[#d4c87a] font-mono text-sm placeholder:text-[#3a3620]
                           focus:outline-none focus:border-[#d4c87a]/60 transition-all"
                  />
                  @if (form.controls.password.touched && form.controls.password.hasError('minlength')) {
                    <p class="text-red-400/80 font-mono text-xs mt-1">Mínimo 6 caracteres.</p>
                  }
                </div>

                <!-- ── Aceptar términos ──────────────────────────── -->
                <div class="pt-2">
                  <label class="flex items-start gap-3 cursor-pointer group">
                    <div class="relative mt-0.5 shrink-0">
                      <input
                        formControlName="terminos"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <!-- Checkbox visual personalizado -->
                      <div class="w-4 h-4 border border-[#d4c87a]/30 bg-[#080700]
                                  peer-checked:bg-[#d4c87a]/20 peer-checked:border-[#d4c87a]/70
                                  group-hover:border-[#d4c87a]/50 transition-all duration-150
                                  flex items-center justify-center">
                        @if (form.controls.terminos.value) {
                          <span class="text-[#d4c87a] text-xs leading-none select-none">✓</span>
                        }
                      </div>
                    </div>
                    <span class="text-[#5a5828] font-mono text-xs leading-relaxed">
                      He leído y acepto los
                      <a routerLink="/terminos" target="_blank"
                         class="text-[#8b7a2e] hover:text-[#d4c87a] underline underline-offset-2 transition-colors"
                         (click)="$event.stopPropagation()">
                        Términos de Servicio
                      </a>
                      y la
                      <a routerLink="/privacidad" target="_blank"
                         class="text-[#8b7a2e] hover:text-[#d4c87a] underline underline-offset-2 transition-colors"
                         (click)="$event.stopPropagation()">
                        Política de Privacidad
                      </a>
                    </span>
                  </label>
                  @if (form.controls.terminos.touched && form.controls.terminos.invalid) {
                    <p class="text-red-400/80 font-mono text-xs mt-2 ml-7">
                      Debes aceptar los términos para continuar.
                    </p>
                  }
                </div>

                <!-- Error general -->
                @if (error()) {
                  <p class="text-red-400 font-mono text-xs py-2 px-3 border border-red-500/20 bg-red-500/10">
                    {{ error() }}
                  </p>
                }

                <!-- Submit -->
                <button
                  type="submit"
                  [disabled]="loading()"
                  class="w-full py-3 font-mono tracking-widest uppercase text-xs text-[#d4c87a]
                         border border-[#d4c87a]/60 bg-[#d4c87a]/[0.08]
                         hover:bg-[#d4c87a]/[0.18] hover:shadow-[0_0_16px_rgba(212,200,122,0.2)]
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200"
                >
                  {{ loading() ? 'Creando cuenta...' : 'Crear Cuenta' }}
                </button>

              </form>

              <p class="text-[#3a3620] font-mono text-xs mt-6 text-center tracking-widest">
                ¿Ya tienes cuenta?
                <a routerLink="/login" class="text-[#8b7a2e] hover:text-[#d4c87a] ml-1 transition-colors">
                  Iniciar Sesión
                </a>
              </p>
            }
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
export class RegistroPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('card') cardRef!: ElementRef;

  form = new FormGroup({
    nombre:    new FormControl('',    { nonNullable: true }),
    email:     new FormControl('',    { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password:  new FormControl('',    { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
    terminos:  new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
  });

  loading = signal(false);
  error   = signal('');
  success = signal(false);

  private ctx!: gsap.Context;

  constructor(private auth: AuthService, private router: Router) {}

  ngAfterViewInit() {
    this.ctx = gsap.context(() => {
      gsap.from(this.cardRef.nativeElement, {
        autoAlpha: 0, y: 30, duration: 0.8, ease: 'power2.out',
      });
    });
  }

  ngOnDestroy() { this.ctx?.revert(); }

  async onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.error.set('');

    const { email, password, nombre } = this.form.getRawValue();
    const { error } = await this.auth.signUp(email, password, nombre || undefined);

    if (error) {
      this.error.set(this.translateError(error.message));
    } else {
      this.success.set(true);
    }
    this.loading.set(false);
  }

  private translateError(msg: string): string {
    if (msg.includes('already registered')) return 'Este email ya está registrado.';
    if (msg.includes('Password should be'))  return 'La contraseña debe tener al menos 6 caracteres.';
    return 'Error al crear la cuenta. Inténtalo de nuevo.';
  }
}
