import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { AccordionComponent, AccordionItem } from '../../ui/accordion.component';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [AccordionComponent],
  template: `
    <section id="faq" class="py-24 bg-black">
      <div class="container mx-auto px-4 max-w-3xl">

        <div class="text-center mb-16 reveal" #revealEl>
          <h2 class="text-4xl md:text-5xl font-bold mb-4">
            <span class="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Preguntas Frecuentes
            </span>
          </h2>
          <p class="text-orange-100/60 text-lg">Todo lo que necesitas saber antes de explorar.</p>
        </div>

        <div class="reveal" #revealEl>
          <app-accordion [items]="faqs" />
        </div>

      </div>
    </section>
  `,
})
export class FaqComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('revealEl') revealEls!: QueryList<ElementRef>;

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

  private observer!: IntersectionObserver;

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('revealed'); this.observer.unobserve(e.target); } }),
      { threshold: 0.15 }
    );
    this.revealEls.forEach((el) => this.observer.observe(el.nativeElement));
  }

  ngOnDestroy() { this.observer?.disconnect(); }
}
