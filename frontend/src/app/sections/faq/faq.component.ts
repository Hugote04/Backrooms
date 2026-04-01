import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChildren, ViewChild, QueryList } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AccordionComponent, AccordionItem } from '../../ui/accordion.component';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [AccordionComponent],
  template: `
    <section id="faq" class="py-24 bg-[#080700]">
      <div class="container mx-auto px-4 max-w-3xl">

        <div #heading class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold mb-4"
              style="font-family: 'Space Mono', monospace;">
            <span class="text-[#d4c87a] tracking-widest uppercase">Preguntas Frecuentes</span>
          </h2>
          <p class="text-[#8b7a2e] font-mono text-xs tracking-widest">Todo lo que necesitas saber antes de explorar.</p>
        </div>

        <div #accordionWrapper>
          <app-accordion [items]="faqs" />
        </div>

      </div>
    </section>
  `,
})
export class FaqComponent implements AfterViewInit, OnDestroy {
  @ViewChild('heading')         headingRef!:   ElementRef;
  @ViewChild('accordionWrapper') accordionRef!: ElementRef;

  faqs: AccordionItem[] = [
    {
      question: '¿El juego es gratuito?',
      answer: 'Sí, Lurking In The Shadows es completamente gratuito. Sin pagos ocultos ni microtransacciones.',
    },
    {
      question: '¿En qué plataformas está disponible?',
      answer: 'Actualmente disponible para Windows y Android. Estamos evaluando el soporte para otras plataformas en futuras versiones.',
    },
    {
      question: '¿Necesito una cuenta para descargar?',
      answer: 'No, la descarga es libre. Solo necesitas cuenta para dejar reseñas y comentarios en la comunidad.',
    },
    {
      question: '¿El juego tiene multijugador?',
      answer: 'De momento es single-player, pero estamos evaluando añadir modo cooperativo para futuras actualizaciones.',
    },
    {
      question: '¿Cómo reporto un bug?',
      answer: 'Puedes contactarnos a través del formulario de contacto o en nuestro Discord. Respondemos lo antes posible.',
    },
    {
      question: '¿Habrá más niveles?',
      answer: 'Sí, planeamos añadir nuevos niveles y entidades en futuras actualizaciones. Síguenos para estar al día.',
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

      gsap.from(this.accordionRef.nativeElement, {
        autoAlpha: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: this.accordionRef.nativeElement,
          start: 'top 85%',
          once: true,
        },
      });

      gsap.to(this.headingRef.nativeElement, {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: 'section#faq',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    });
  }

  ngOnDestroy() { this.ctx?.revert(); }
}
