import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ReviewService, Review } from '../../services/review.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <section id="resenas" class="py-24 bg-gradient-to-b from-black to-orange-950/20">
      <div class="container mx-auto px-4">

        <!-- Heading -->
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold mb-4">
            <span class="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Reseñas de Jugadores
            </span>
          </h2>
          <p class="text-orange-100/60 text-lg">Lo que dice la comunidad.</p>
        </div>

        <!-- Formulario (solo si hay sesión) -->
        @if (auth.user()) {
          <div class="max-w-2xl mx-auto mb-14 bg-orange-500/5 border border-orange-500/20 rounded-xl p-6">
            <h3 class="text-orange-100 font-semibold mb-4">Deja tu reseña</h3>

            <!-- Estrellas -->
            <div class="flex gap-1 mb-4">
              @for (n of stars; track n) {
                <button
                  type="button"
                  (click)="ratingValue.set(n)"
                  (mouseenter)="ratingHover.set(n)"
                  (mouseleave)="ratingHover.set(0)"
                  class="text-3xl cursor-pointer transition-colors duration-100 leading-none"
                  [class.text-orange-400]="(ratingHover() || ratingValue()) >= n"
                  [class.text-orange-500]="(ratingHover() || ratingValue()) < n"
                  style="opacity: {{ (ratingHover() || ratingValue()) >= n ? '1' : '0.2' }}"
                >★</button>
              }
            </div>

            <!-- Texto -->
            <textarea
              [(ngModel)]="reviewText"
              placeholder="Cuéntanos tu experiencia..."
              rows="3"
              class="w-full bg-orange-500/10 border border-orange-500/20 rounded-md px-4 py-3
                     text-orange-100 placeholder:text-orange-100/40 resize-none mb-4
                     focus:outline-none focus:border-orange-500/60 transition-all"
            ></textarea>

            @if (submitError()) {
              <p class="text-red-400 text-sm mb-3">{{ submitError() }}</p>
            }
            @if (submitSuccess()) {
              <p class="text-green-400 text-sm mb-3">¡Reseña publicada!</p>
            }

            <button
              type="button"
              (click)="submitReview()"
              [disabled]="submitting() || ratingValue() === 0"
              class="px-6 py-2.5 rounded-full font-semibold text-sm text-white
                     bg-gradient-to-r from-orange-500 to-yellow-500
                     hover:from-orange-600 hover:to-yellow-600
                     disabled:opacity-40 disabled:cursor-not-allowed
                     transition-all duration-300"
            >
              {{ submitting() ? 'Enviando...' : 'Publicar reseña' }}
            </button>
          </div>
        } @else {
          <div class="text-center mb-14">
            <p class="text-orange-100/50 text-sm">
              <a routerLink="/login" class="text-orange-400 hover:text-orange-300 underline underline-offset-2">
                Inicia sesión
              </a>
              para dejar tu reseña.
            </p>
          </div>
        }

        <!-- Lista de reseñas -->
        @if (loading()) {
          <div class="text-center text-orange-100/40 py-12">Cargando reseñas...</div>
        } @else if (reviews().length === 0) {
          <div class="text-center text-orange-100/40 py-12">
            <p class="text-lg">Sé el primero en dejar una reseña.</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            @for (review of reviews(); track review.id) {
              <div class="bg-orange-500/5 border border-orange-500/20 rounded-xl p-5 flex flex-col gap-3">
                <!-- Header -->
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/30
                               flex items-center justify-center text-orange-300 font-bold text-sm shrink-0">
                    {{ review.user_name.charAt(0).toUpperCase() }}
                  </div>
                  <div class="min-w-0">
                    <p class="text-orange-100 font-medium text-sm truncate">{{ review.user_name }}</p>
                    <p class="text-orange-100/40 text-xs">{{ formatDate(review.created_at) }}</p>
                  </div>
                  <div class="ml-auto text-orange-400 text-sm shrink-0">{{ starString(review.rating) }}</div>
                </div>
                <!-- Texto -->
                <p class="text-orange-100/70 text-sm leading-relaxed">{{ review.text }}</p>
              </div>
            }
          </div>
        }

      </div>
    </section>
  `,
})
export class ReviewsComponent implements OnInit {
  reviews = signal<Review[]>([]);
  loading = signal(true);

  ratingValue = signal(0);
  ratingHover = signal(0);
  reviewText  = '';
  submitting  = signal(false);
  submitError = signal('');
  submitSuccess = signal(false);

  readonly stars = [1, 2, 3, 4, 5];

  constructor(
    public auth: AuthService,
    private reviewService: ReviewService
  ) {}

  ngOnInit() {
    this.loadReviews();
  }

  async loadReviews() {
    this.loading.set(true);
    this.reviews.set(await this.reviewService.getAll());
    this.loading.set(false);
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
