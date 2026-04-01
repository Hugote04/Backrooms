import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChildren, ViewChild, QueryList } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LucideAngularModule, Gamepad2, Shield, Users, Zap } from 'lucide-angular';

gsap.registerPlugin(ScrollTrigger);

interface Feature { icon: any; title: string; description: string; }

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <section id="features" class="py-24 bg-[#0a0900] light-bar">
      <div class="container mx-auto px-4">

        <div #heading class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold mb-4"
              style="font-family: 'Space Mono', monospace;">
            <span class="text-[#d4c87a] tracking-wider uppercase">
              Características del Juego
            </span>
          </h2>
          <p class="text-[#8b7a2e] font-mono text-sm tracking-wide max-w-2xl mx-auto">
            Todo lo que necesitas para la experiencia definitiva de horror liminal.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (feature of features; track feature.title) {
            <div
              #cardRef
              class="bg-[#111005]/80 border border-[#d4c87a]/20 p-6
                     hover:border-[#d4c87a]/50 hover:bg-[#1a1808]/80
                     transition-all duration-300 group"
            >
              <div class="mb-4 p-3 bg-[#d4c87a]/10 border border-[#d4c87a]/20 w-fit
                          group-hover:bg-[#d4c87a]/20 transition-colors duration-300">
                <lucide-icon [img]="feature.icon" [size]="24" class="text-[#d4c87a]"></lucide-icon>
              </div>
              <h3 class="text-[#e8e6b8] font-mono font-bold text-sm tracking-widest uppercase mb-2">{{ feature.title }}</h3>
              <p class="text-[#8b7a2e] font-mono text-xs leading-relaxed">{{ feature.description }}</p>
            </div>
          }
        </div>

      </div>
    </section>
  `,
})
export class FeaturesComponent implements AfterViewInit, OnDestroy {
  @ViewChild('heading')        headingRef!: ElementRef;
  @ViewChildren('cardRef')     cardRefs!:   QueryList<ElementRef>;

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

  private ctx!: gsap.Context;

  ngAfterViewInit() {
    this.ctx = gsap.context(() => {
      gsap.from(this.headingRef.nativeElement, {
        autoAlpha: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: this.headingRef.nativeElement,
          start: 'top 80%',
          once: true,
        },
      });

      const cards = this.cardRefs.toArray().map(r => r.nativeElement);
      gsap.from(cards, {
        autoAlpha: 0,
        y: 40,
        stagger: 0.12,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cards[0],
          start: 'top 85%',
          once: true,
        },
      });

      gsap.to(this.headingRef.nativeElement, {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: 'section#features',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    });
  }

  ngOnDestroy() { this.ctx?.revert(); }
}
