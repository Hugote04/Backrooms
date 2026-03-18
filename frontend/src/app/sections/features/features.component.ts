import { Component, ElementRef, OnDestroy, OnInit, ViewChildren, QueryList } from '@angular/core';
import { LucideAngularModule, Gamepad2, Shield, Users, Zap } from 'lucide-angular';

interface Feature { icon: any; title: string; description: string; }

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <section id="features" class="py-24 bg-black">
      <div class="container mx-auto px-4">

        <div class="text-center mb-16 reveal" #revealEl>
          <h2 class="text-4xl md:text-5xl font-bold mb-4">
            <span class="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Características del Juego
            </span>
          </h2>
          <p class="text-orange-100/60 text-lg max-w-2xl mx-auto">
            Todo lo que necesitas para la experiencia definitiva de horror liminal.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (feature of features; track feature.title; let i = $index) {
            <div
              class="reveal bg-orange-500/5 border border-orange-500/20 rounded-xl p-6
                     hover:border-orange-500/40 hover:bg-orange-500/10
                     hover:scale-105 transition-all duration-300 group"
              #revealEl
              [style.transition-delay]="i * 100 + 'ms'"
            >
              <div class="mb-4 p-3 rounded-lg bg-orange-500/10 w-fit
                          group-hover:bg-orange-500/20 transition-colors duration-300">
                <lucide-icon [img]="feature.icon" [size]="24" class="text-orange-400"></lucide-icon>
              </div>
              <h3 class="text-lg font-bold text-orange-100 mb-2">{{ feature.title }}</h3>
              <p class="text-orange-100/60 text-sm leading-relaxed">{{ feature.description }}</p>
            </div>
          }
        </div>

      </div>
    </section>
  `,
})
export class FeaturesComponent implements OnInit, OnDestroy {
  @ViewChildren('revealEl') revealEls!: QueryList<ElementRef>;

  features: Feature[] = [
    {
      icon: Gamepad2,
      title: 'Jugabilidad Inmersiva',
      description: 'Explora espacios liminales generados proceduralmente con mecánicas de horror atmosférico y supervivencia.',
    },
    {
      icon: Shield,
      title: 'Descarga Segura',
      description: 'Instalador verificado y sin malware. Confían en nosotros miles de jugadores de todo el mundo.',
    },
    {
      icon: Users,
      title: 'Multijugador',
      description: 'Únete a tus amigos o enfréntate a lo desconocido solo. Compatible con hasta 4 jugadores en cooperativo.',
    },
    {
      icon: Zap,
      title: 'Actualizaciones Frecuentes',
      description: 'Nuevos niveles, mecánicas y lore cada mes. Siempre hay algo nuevo por descubrir.',
    },
  ];

  private observer!: IntersectionObserver;

  ngOnInit() {
    this.observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('revealed'); this.observer.unobserve(e.target); } }),
      { threshold: 0.15 }
    );
    setTimeout(() => this.revealEls.forEach((el) => this.observer.observe(el.nativeElement)), 0);
  }

  ngOnDestroy() { this.observer?.disconnect(); }
}
