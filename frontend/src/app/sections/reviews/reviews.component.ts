import { Component, AfterViewInit, OnDestroy, OnInit, ViewChildren, ViewChild, QueryList, ElementRef, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AuthService } from '../../services/auth.service';
import { ReviewService, Review } from '../../services/review.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <section id="resenas" class="py-24 bg-[#080700] wallpaper-bg">
      <div class="container mx-auto px-4">

        <div #heading class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold mb-4"
              style="font-family: 'Space Mono', monospace;">
            <span class="text-[#d4c87a] tracking-widest uppercase">Reseñas de Jugadores</span>
          </h2>
          <p class="text-[#8b7a2e] font-mono text-xs tracking-widest">Lo que dice la comunidad.</p>
        </div>

        <!-- Formulario (solo si hay sesión) -->
        @if (auth.user()) {
          <div class="max-w-2xl mx-auto mb-14 bg-[#0e0d04] border border-[#d4c87a]/20 p-6">
            <h3 class="text-[#d4c87a] font-mono font-bold text-sm tracking-widest uppercase mb-4">Deja tu reseña</h3>

            <div class="flex gap-1 mb-4">
              @for (n of stars; track n) {
                <button
                  type="button"
                  (click)="ratingValue.set(n)"
                  (mouseenter)="ratingHover.set(n)"
                  (mouseleave)="ratingHover.set(0)"
                  class="text-3xl transition-colors duration-100 leading-none"
                  [class.text-[#d4c87a]]="(ratingHover() || ratingValue()) >= n"
                  [class.text-[#3a3620]]="(ratingHover() || ratingValue()) < n"
                >★</button>
              }
            </div>

            <textarea
              [(ngModel)]="reviewText"
              placeholder="Cuéntanos tu experiencia..."
              rows="3"
              class="w-full bg-[#080700] border border-[#d4c87a]/20
                     text-[#d4c87a] font-mono text-sm placeholder:text-[#3a3620]
                     px-4 py-3 resize-none mb-4
                     focus:outline-none focus:border-[#d4c87a]/60 transition-all"
            ></textarea>

            @if (submitError()) {
              <p class="text-red-400 text-xs font-mono mb-3">{{ submitError() }}</p>
            }
            @if (submitSuccess()) {
              <p class="text-[#d4c87a] text-xs font-mono mb-3">¡Reseña publicada!</p>
            }

            <button
              type="button"
              (click)="submitReview()"
              [disabled]="submitting() || ratingValue() === 0"
              class="px-6 py-2.5 font-mono font-semibold text-xs tracking-widest uppercase text-[#d4c87a]
                     border border-[#d4c87a]/60 hover:bg-[#d4c87a]/10
                     hover:shadow-[0_0_16px_rgba(212,200,122,0.2)]
                     disabled:opacity-40 disabled:cursor-not-allowed
                     transition-all duration-200"
            >
              {{ submitting() ? 'Enviando...' : 'Publicar reseña' }}
            </button>
          </div>
        } @else {
          <div class="text-center mb-14">
            <p class="text-[#5a5828] font-mono text-xs tracking-widest">
              <a routerLink="/login" class="text-[#b8a84a] hover:text-[#d4c87a] underline underline-offset-2">
                Inicia sesión
              </a>
              para dejar tu reseña.
            </p>
          </div>
        }

        <!-- Lista de reseñas -->
        @if (loading()) {
          <div class="text-center text-[#5a5828] font-mono text-xs tracking-widest py-12">Cargando reseñas...</div>
        } @else if (reviews().length === 0) {
          <div class="text-center text-[#5a5828] font-mono py-12">
            <p class="text-sm tracking-widest">Sé el primero en dejar una reseña.</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            @for (review of reviews(); track review.id) {
              <div #cardRef class="bg-[#0e0d04] border border-[#d4c87a]/15 p-5 flex flex-col gap-3
                                   hover:border-[#d4c87a]/35 transition-all duration-300">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-[#d4c87a]/15 border border-[#d4c87a]/30
                               flex items-center justify-center text-[#d4c87a] font-mono font-bold text-sm shrink-0">
                    {{ review.user_name.charAt(0).toUpperCase() }}
                  </div>
                  <div class="min-w-0">
                    <p class="text-[#e8e6b8] font-mono font-bold text-xs tracking-widest uppercase truncate">{{ review.user_name }}</p>
                    <p class="text-[#5a5828] font-mono text-xs">{{ formatDate(review.created_at) }}</p>
                  </div>
                  <div class="ml-auto text-[#d4c87a] text-sm shrink-0">{{ starString(review.rating) }}</div>
                </div>
                <p class="text-[#8b7a2e] font-mono text-xs leading-relaxed">{{ review.text }}</p>
              </div>
            }
          </div>
        }

      </div>
    </section>
  `,
})
export class ReviewsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heading')    headingRef!: ElementRef;
  @ViewChildren('cardRef') cardRefs!:   QueryList<ElementRef>;

  reviews     = signal<Review[]>([]);
  loading     = signal(true);
  ratingValue = signal(0);
  ratingHover = signal(0);
  reviewText  = '';
  submitting  = signal(false);
  submitError = signal('');
  submitSuccess = signal(false);

  readonly stars = [1, 2, 3, 4, 5];

  private ctx!: gsap.Context;

  constructor(public auth: AuthService, private reviewService: ReviewService) {}

  ngOnInit() { this.loadReviews(); }

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

      gsap.to(this.headingRef.nativeElement, {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: 'section#resenas',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    });
  }

  ngOnDestroy() { this.ctx?.revert(); }

  private animateCards() {
    if (!this.cardRefs?.length) return;
    const cards = this.cardRefs.toArray().map(r => r.nativeElement);
    gsap.from(cards, {
      autoAlpha: 0,
      y: 30,
      stagger: 0.08,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: cards[0],
        start: 'top 85%',
        once: true,
      },
    });
  }

  async loadReviews() {
    this.loading.set(true);
    this.reviews.set(await this.reviewService.getAll());
    this.loading.set(false);
    setTimeout(() => this.animateCards(), 50);
  }

  async submitReview() {
    const user = this.auth.user();
    if (!user || this.ratingValue() === 0 || !this.reviewText.trim()) return;

    this.submitting.set(true);
    this.submitError.set('');

    const userName = this.auth.getDisplayName();
    const { error } = await this.reviewService.add(user.id, userName, this.ratingValue(), this.reviewText.trim());

    if (error) {
      this.submitError.set('Error al publicar la reseña. Inténtalo de nuevo.');
    } else {
      this.submitSuccess.set(true);
      this.reviewText = '';
      this.ratingValue.set(0);
      await this.loadReviews();
      setTimeout(() => this.submitSuccess.set(false), 3000);
    }
    this.submitting.set(false);
  }

  starString(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}
