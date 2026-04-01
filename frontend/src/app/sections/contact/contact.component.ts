import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../ui/button.component';
import { InputComponent } from '../../ui/input.component';
import { TextareaComponent } from '../../ui/textarea.component';

type SubmissionState = 'idle' | 'loading' | 'success';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent, TextareaComponent],
  template: `
    <section id="contact" class="py-24 bg-gradient-to-b from-black to-orange-950/20">
      <div class="container mx-auto px-4 max-w-5xl">

        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold mb-4">
            <span class="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Contacto
            </span>
          </h2>
          <p class="text-orange-100/60 text-lg">¿Tienes alguna pregunta? Escríbenos.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-12">

          <div class="lg:col-span-2 flex flex-col gap-6">
            <div>
              <h3 class="text-orange-100 font-semibold mb-4 text-sm uppercase tracking-wider">Información de contacto</h3>
              <ul class="space-y-4">
                <li class="flex items-start gap-3">
                  <span class="mt-0.5 text-orange-400 shrink-0">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </span>
                  <div>
                    <p class="text-orange-100/50 text-xs mb-0.5">Email de soporte</p>
                    <a href="mailto:soporte@backrooms.game"
                       class="text-orange-300 hover:text-orange-200 text-sm transition-colors">
                      soporte@backrooms.game
                    </a>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <span class="mt-0.5 text-orange-400 shrink-0">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                    </svg>
                  </span>
                  <div>
                    <p class="text-orange-100/50 text-xs mb-0.5">Discord</p>
                    <a href="#" target="_blank" rel="noopener"
                       class="text-orange-300 hover:text-orange-200 text-sm transition-colors">
                      discord.gg/backrooms
                    </a>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <span class="mt-0.5 text-orange-400 shrink-0">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </span>
                  <div>
                    <p class="text-orange-100/50 text-xs mb-0.5">Twitter / X</p>
                    <a href="#" target="_blank" rel="noopener"
                       class="text-orange-300 hover:text-orange-200 text-sm transition-colors">
                      @BackroomsGame
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <div class="border-t border-orange-500/10 pt-6">
              <p class="text-orange-100/40 text-sm leading-relaxed">
                Respondemos en un plazo de 24–48 horas. Para bugs urgentes usa Discord.
              </p>
            </div>
          </div>

          <div class="lg:col-span-3 bg-orange-500/5 border border-orange-500/20 rounded-xl p-8">
            @if (state() === 'success') {
              <div class="flex flex-col items-center justify-center py-10 text-center">
                <div class="w-14 h-14 rounded-full bg-orange-500/15 border border-orange-500/30
                             flex items-center justify-center mb-4">
                  <svg class="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <h3 class="text-orange-100 font-semibold text-lg mb-1">¡Mensaje enviado!</h3>
                <p class="text-orange-100/50 text-sm">Te responderemos lo antes posible.</p>
                <button
                  type="button"
                  (click)="reset()"
                  class="mt-6 text-orange-400 hover:text-orange-300 text-sm transition-colors"
                >Enviar otro mensaje</button>
              </div>
            } @else {
              <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label class="block text-orange-100/70 text-sm mb-1.5">Nombre</label>
                    <app-input formControlName="nombre" placeholder="Tu nombre" />
                    @if (form.controls.nombre.touched && form.controls.nombre.invalid) {
                      <p class="text-red-400/80 text-xs mt-1">El nombre es obligatorio.</p>
                    }
                  </div>
                  <div>
                    <label class="block text-orange-100/70 text-sm mb-1.5">Email</label>
                    <app-input formControlName="email" type="email" placeholder="tu@email.com" />
                    @if (form.controls.email.touched && form.controls.email.invalid) {
                      <p class="text-red-400/80 text-xs mt-1">Email inválido.</p>
                    }
                  </div>
                </div>

                <div>
                  <label class="block text-orange-100/70 text-sm mb-1.5">Asunto</label>
                  <app-input formControlName="asunto" placeholder="¿En qué podemos ayudarte?" />
                  @if (form.controls.asunto.touched && form.controls.asunto.invalid) {
                    <p class="text-red-400/80 text-xs mt-1">El asunto es obligatorio.</p>
                  }
                </div>

                <div>
                  <label class="block text-orange-100/70 text-sm mb-1.5">Mensaje</label>
                  <app-textarea formControlName="mensaje" placeholder="Cuéntanos tu consulta con detalle..." [rows]="5" />
                  @if (form.controls.mensaje.touched && form.controls.mensaje.invalid) {
                    <p class="text-red-400/80 text-xs mt-1">El mensaje es obligatorio.</p>
                  }
                </div>

                <app-button variant="cta" type="submit" [disabled]="state() === 'loading'" class="w-full">
                  {{ state() === 'loading' ? 'Enviando...' : 'Enviar Mensaje' }}
                </app-button>

              </form>
            }
          </div>

        </div>
      </div>
    </section>
  `,
})
export class ContactComponent {
  form = new FormGroup({
    nombre:  new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email:   new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    asunto:  new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    mensaje: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  state = signal<SubmissionState>('idle');

  async onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.state.set('loading');
    await new Promise((r) => setTimeout(r, 600));
    this.state.set('success');
  }

  reset() {
    this.form.reset();
    this.state.set('idle');
  }
}
