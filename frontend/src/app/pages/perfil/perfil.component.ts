import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-perfil-page',
  standalone: true,
  imports: [RouterLink],
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
        </div>

        <div class="bg-orange-500/5 border border-orange-500/20 rounded-xl p-8">
          <!-- Avatar -->
          <div class="flex flex-col items-center mb-8">
            <div class="w-20 h-20 rounded-full bg-orange-500/20 border-2 border-orange-500/40
                         flex items-center justify-center text-orange-300 font-bold text-3xl mb-4">
              {{ initial }}
            </div>
            <h1 class="text-xl font-bold text-orange-100">{{ displayName }}</h1>
            <p class="text-orange-100/40 text-sm mt-1">{{ email }}</p>
          </div>

          <!-- Info -->
          <div class="space-y-3 mb-8">
            <div class="flex justify-between py-3 border-b border-orange-500/10">
              <span class="text-orange-100/50 text-sm">Email</span>
              <span class="text-orange-100/80 text-sm">{{ email }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-orange-500/10">
              <span class="text-orange-100/50 text-sm">Nombre</span>
              <span class="text-orange-100/80 text-sm">{{ displayName }}</span>
            </div>
            <div class="flex justify-between py-3">
              <span class="text-orange-100/50 text-sm">Miembro desde</span>
              <span class="text-orange-100/80 text-sm">{{ joinedDate }}</span>
            </div>
          </div>

          <button
            type="button"
            (click)="signOut()"
            class="w-full py-3 rounded-full font-semibold text-orange-300
                   border border-orange-500/30 hover:bg-orange-500/10 hover:border-orange-500/50
                   transition-all duration-300"
          >
            Cerrar Sesión
          </button>
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
export class PerfilPageComponent implements OnInit {
  displayName = '';
  email       = '';
  initial     = '';
  joinedDate  = '';

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

  async signOut() {
    await this.auth.signOut();
    this.router.navigate(['/']);
  }
}
