import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro-page',
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
          <h1 class="text-2xl font-bold text-orange-100 mb-1">Crear Cuenta</h1>
          <p class="text-orange-100/50 text-sm mb-6">Únete a la comunidad de exploradores.</p>

          @if (success()) {
            <div class="text-center py-8">
              <div class="text-4xl mb-4">✉️</div>
              <h2 class="text-orange-100 font-semibold mb-2">¡Revisa tu email!</h2>
              <p class="text-orange-100/60 text-sm">Te hemos enviado un enlace de confirmación.</p>
              <a routerLink="/login" class="inline-block mt-6 text-orange-400 hover:text-orange-300 text-sm">
                Ir a Iniciar Sesión →
              </a>
            </div>
          } @else {
            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">

              <div>
                <label class="block text-orange-100/70 text-sm mb-1.5">Nombre (opcional)</label>
                <input
                  formControlName="nombre"
                  type="text"
                  placeholder="Tu nombre de jugador"
                  class="w-full bg-orange-500/10 border border-orange-500/20 rounded-md px-4 py-3
                         text-orange-100 placeholder:text-orange-100/40
                         focus:outline-none focus:border-orange-500/60 transition-all"
                />
              </div>

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
                  placeholder="Mínimo 6 caracteres"
                  class="w-full bg-orange-500/10 border border-orange-500/20 rounded-md px-4 py-3
                         text-orange-100 placeholder:text-orange-100/40
                         focus:outline-none focus:border-orange-500/60 transition-all"
                />
                @if (form.controls.password.touched && form.controls.password.hasError('minlength')) {
                  <p class="text-red-400/80 text-xs mt-1">Mínimo 6 caracteres.</p>
                }
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
                {{ loading() ? 'Creando cuenta...' : 'Crear Cuenta' }}
              </button>

            </form>

            <p class="text-orange-100/40 text-sm mt-6 text-center">
              ¿Ya tienes cuenta?
              <a routerLink="/login" class="text-orange-400 hover:text-orange-300 ml-1">Iniciar Sesión</a>
            </p>
          }
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
export class RegistroPageComponent {
  form = new FormGroup({
    nombre:   new FormControl('', { nonNullable: true }),
    email:    new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
  });

  loading = signal(false);
  error   = signal('');
  success = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

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
    if (msg.includes('Password should be')) return 'La contraseña debe tener al menos 6 caracteres.';
    return 'Error al crear la cuenta. Inténtalo de nuevo.';
  }
}
