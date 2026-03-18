import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-black flex items-center justify-center px-4 py-16">
      <div class="w-full max-w-md">

        <!-- Logo -->
        <div class="text-center mb-10">
          <a routerLink="/" class="inline-block mb-2">
            <span class="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              BACKROOMS
            </span>
          </a>
          <p class="text-orange-100/40 text-xs tracking-widest">LURKING IN THE SHADOWS</p>
        </div>

        <!-- Card -->
        <div class="bg-orange-500/5 border border-orange-500/20 rounded-xl p-8">
          <h1 class="text-2xl font-bold text-orange-100 mb-1">Iniciar Sesión</h1>
          <p class="text-orange-100/50 text-sm mb-6">Accede a tu cuenta para dejar reseñas.</p>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">

            <div>
              <label class="block text-orange-100/70 text-sm mb-1.5">Email</label>
              <input
                formControlName="email"
                type="email"
                placeholder="tu@email.com"
                class="w-full bg-orange-500/10 border border-orange-500/20 rounded-md px-4 py-3
                       text-orange-100 placeholder:text-orange-100/40
                       focus:outline-none focus:border-orange-500/60 transition-all"
              />
              @if (form.controls.email.touched && form.controls.email.invalid) {
                <p class="text-red-400/80 text-xs mt-1">Email inválido.</p>
              }
            </div>

            <div>
              <label class="block text-orange-100/70 text-sm mb-1.5">Contraseña</label>
              <input
                formControlName="password"
                type="password"
                placeholder="••••••••"
                class="w-full bg-orange-500/10 border border-orange-500/20 rounded-md px-4 py-3
                       text-orange-100 placeholder:text-orange-100/40
                       focus:outline-none focus:border-orange-500/60 transition-all"
              />
            </div>

            @if (error()) {
              <p class="text-red-400 text-sm py-2 px-3 rounded-md bg-red-500/10 border border-red-500/20">
                {{ error() }}
              </p>
            }

            <button
              type="submit"
              [disabled]="loading()"
              class="w-full py-3 rounded-full font-semibold text-white
                     bg-gradient-to-r from-orange-500 to-yellow-500
                     hover:from-orange-600 hover:to-yellow-600
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-300 hover:scale-[1.02]"
            >
              {{ loading() ? 'Entrando...' : 'Iniciar Sesión' }}
            </button>

          </form>

          <p class="text-orange-100/40 text-sm mt-6 text-center">
            ¿No tienes cuenta?
            <a routerLink="/registro" class="text-orange-400 hover:text-orange-300 ml-1">Regístrate</a>
          </p>
        </div>

        <p class="text-center mt-6">
          <a routerLink="/" class="text-orange-100/30 hover:text-orange-300 text-sm transition-colors">
            ← Volver al inicio
          </a>
        </p>

      </div>
    </div>
  `,
})
export class LoginPageComponent {
  form = new FormGroup({
    email:    new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  loading = signal(false);
  error   = signal('');

  constructor(private auth: AuthService, private router: Router) {}

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
