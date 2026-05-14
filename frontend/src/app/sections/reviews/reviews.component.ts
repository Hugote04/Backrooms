import {
  Component, AfterViewInit, OnDestroy, OnInit,
  ViewChildren, ViewChild, QueryList, ElementRef, signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AuthService } from '../../services/auth.service';
import { ReviewService, Review } from '../../services/review.service';
import { CommentService, Comment } from '../../services/comment.service';

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

        <!-- ── Formulario nueva reseña ───────────────────────── -->
        @if (auth.user()) {
          <div class="max-w-2xl mx-auto mb-14 bg-[#0e0d04] border border-[#d4c87a]/20 p-6">
            <h3 class="text-[#d4c87a] font-mono font-bold text-sm tracking-widest uppercase mb-4">
              Deja tu reseña
            </h3>

            <!-- Estrellas nueva reseña -->
            <div class="flex gap-1 mb-4">
              @for (n of stars; track n) {
                <button type="button"
                  (click)="ratingValue.set(n)"
                  (mouseenter)="ratingHover.set(n)"
                  (mouseleave)="ratingHover.set(0)"
                  class="text-3xl transition-colors duration-100 leading-none"
                  [class.text-yellow-400]="(ratingHover() || ratingValue()) >= n"
                  [class.text-stone-700]="(ratingHover() || ratingValue()) < n"
                >★</button>
              }
            </div>

            <textarea
              [(ngModel)]="reviewText"
              placeholder="Cuéntanos tu experiencia..."
              rows="3"
              class="w-full bg-[#080700] border border-[#d4c87a]/20
                     text-[#d4c87a] font-mono text-sm placeholder:text-[#3a3620]
                     px-4 py-3 resize-none mb-1
                     focus:outline-none focus:border-[#d4c87a]/60 transition-all"
            ></textarea>
            <p class="text-[#3a3620] font-mono text-xs mb-4 text-right">
              {{ reviewText.length }}/2000
            </p>

            @if (submitError()) {
              <p class="text-red-400 text-xs font-mono mb-3">{{ submitError() }}</p>
            }
            @if (submitSuccess()) {
              <p class="text-[#d4c87a] text-xs font-mono mb-3">¡Reseña publicada!</p>
            }

            <button type="button"
              (click)="submitReview()"
              [disabled]="submitting() || ratingValue() === 0 || reviewText.trim().length < 4"
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

        <!-- ── Lista de reseñas ──────────────────────────────── -->
        @if (loading()) {
          <!-- Skeleton cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            @for (n of skeletonCards; track n) {
              <div class="bg-[#0e0d04] border border-[#d4c87a]/10 p-5 flex flex-col gap-3 animate-pulse">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-[#1a1808] shrink-0"></div>
                  <div class="flex-1 flex flex-col gap-2">
                    <div class="h-2.5 bg-[#1e1c08] rounded w-2/3"></div>
                    <div class="h-2 bg-[#1a1808] rounded w-1/3"></div>
                  </div>
                  <div class="h-3 bg-[#1a1808] rounded w-16"></div>
                </div>
                <div class="flex flex-col gap-1.5 pt-1">
                  <div class="h-2 bg-[#1a1808] rounded w-full"></div>
                  <div class="h-2 bg-[#1a1808] rounded w-4/5"></div>
                  <div class="h-2 bg-[#1a1808] rounded w-3/5"></div>
                </div>
                <div class="border-t border-[#d4c87a]/10 pt-3">
                  <div class="h-2 bg-[#1a1808] rounded w-1/3"></div>
                </div>
              </div>
            }
          </div>
          @if (slowLoad()) {
            <p class="text-center text-[#3a3620] font-mono text-xs tracking-widest mt-6">
              El servidor está arrancando, puede tardar unos segundos...
            </p>
          }
        } @else if (reviews().length === 0) {
          <div class="text-center text-[#5a5828] font-mono py-12">
            <p class="text-sm tracking-widest">Sé el primero en dejar una reseña.</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            @for (review of reviews(); track review.id) {
              <div #cardRef class="bg-[#0e0d04] border border-[#d4c87a]/15 p-5 flex flex-col gap-3
                                   hover:border-[#d4c87a]/35 transition-all duration-300">

                <!-- Cabecera reseña -->
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-[#1a1808] border border-[#d4c87a]/20
                               flex items-center justify-center text-2xl shrink-0 select-none">
                    {{ ratingEmoji(review.rating) }}
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-[#e8e6b8] font-mono font-bold text-xs tracking-widest uppercase truncate">
                      {{ review.userName }}
                    </p>
                    <p class="text-[#5a5828] font-mono text-xs">{{ formatDate(review.createdAt) }}</p>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <span class="text-[#d4c87a] text-sm">{{ starString(review.rating) }}</span>
                    @if (auth.user()?.id === review.userId) {
                      <button type="button"
                        (click)="startEdit(review)"
                        title="Editar reseña"
                        class="text-[#8b7a2e]/60 hover:text-[#d4c87a] font-mono text-xs transition-colors"
                      >✎</button>
                      <button type="button"
                        (click)="deleteReview(review.id)"
                        title="Eliminar reseña"
                        class="text-red-500/50 hover:text-red-400 font-mono text-xs transition-colors"
                      >✕</button>
                    }
                  </div>
                </div>

                <!-- Modo edición inline -->
                @if (editingId() === review.id) {
                  <div class="border-t border-[#d4c87a]/10 pt-3">
                    <!-- Estrellas edición -->
                    <div class="flex gap-1 mb-3">
                      @for (n of stars; track n) {
                        <button type="button"
                          (click)="editRating.set(n)"
                          (mouseenter)="editHover.set(n)"
                          (mouseleave)="editHover.set(0)"
                          class="text-2xl transition-colors duration-100 leading-none"
                          [class.text-yellow-400]="(editHover() || editRating()) >= n"
                          [class.text-stone-700]="(editHover() || editRating()) < n"
                        >★</button>
                      }
                    </div>
                    <textarea
                      [(ngModel)]="editText"
                      rows="3"
                      class="w-full bg-[#080700] border border-[#d4c87a]/30
                             text-[#d4c87a] font-mono text-xs px-3 py-2 resize-none mb-3
                             focus:outline-none focus:border-[#d4c87a]/60 transition-all"
                    ></textarea>
                    @if (editError()) {
                      <p class="text-red-400 text-xs font-mono mb-2">{{ editError() }}</p>
                    }
                    <div class="flex gap-2">
                      <button type="button"
                        (click)="saveEdit(review.id)"
                        [disabled]="saving() || editText.trim().length < 4 || editRating() === 0"
                        class="px-4 py-1.5 font-mono text-xs tracking-widest uppercase text-[#d4c87a]
                               border border-[#d4c87a]/60 hover:bg-[#d4c87a]/10
                               disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      >{{ saving() ? 'Guardando...' : 'Guardar' }}</button>
                      <button type="button"
                        (click)="cancelEdit()"
                        class="px-4 py-1.5 font-mono text-xs tracking-widest uppercase text-[#5a5828]
                               border border-[#5a5828]/40 hover:text-[#8b7a2e] transition-all"
                      >Cancelar</button>
                    </div>
                  </div>
                } @else {
                  <p class="text-[#8b7a2e] font-mono text-xs leading-relaxed">{{ review.text }}</p>
                }

                <!-- ── Comentarios ──────────────────────────── -->
                <div class="border-t border-[#d4c87a]/10 pt-3">
                  <button type="button"
                    (click)="toggleComments(review.id)"
                    class="text-[#5a5828] hover:text-[#8b7a2e] font-mono text-xs tracking-widest
                           uppercase transition-colors flex items-center gap-1"
                  >
                    <span>{{ openComments().has(review.id) ? '▾' : '▸' }}</span>
                    Comentarios ({{ commentCounts()[review.id] ?? 0 }})
                  </button>

                  @if (openComments().has(review.id)) {
                    <div class="mt-3 flex flex-col gap-2">

                      <!-- Lista de comentarios -->
                      @if (commentsMap()[review.id]?.length) {
                        @for (c of commentsMap()[review.id]; track c.id) {
                          <div class="flex items-start gap-2 bg-[#080700] px-3 py-2
                                       border border-[#d4c87a]/08">
                            <div class="min-w-0 flex-1">
                              <span class="text-[#b8a84a] font-mono font-bold text-xs tracking-widest uppercase">
                                {{ c.userName }}
                              </span>
                              <span class="text-[#3a3620] font-mono text-xs ml-2">
                                {{ formatDate(c.createdAt) }}
                              </span>
                              <p class="text-[#6b5e2e] font-mono text-xs mt-0.5 leading-relaxed">
                                {{ c.content }}
                              </p>
                            </div>
                            @if (auth.user()?.id === c.userId) {
                              <button type="button"
                                (click)="deleteComment(c.id, review.id)"
                                title="Eliminar comentario"
                                class="text-red-500/40 hover:text-red-400 font-mono text-xs shrink-0 transition-colors"
                              >✕</button>
                            }
                          </div>
                        }
                      } @else {
                        <p class="text-[#3a3620] font-mono text-xs">Sin comentarios aún.</p>
                      }

                      <!-- Formulario nuevo comentario -->
                      @if (auth.user()) {
                        <div class="mt-2">
                          <textarea
                            [id]="'comment-' + review.id"
                            [(ngModel)]="commentDrafts()[review.id]"
                            (ngModelChange)="setDraft(review.id, $event)"
                            placeholder="Escribe un comentario..."
                            rows="2"
                            class="w-full bg-[#080700] border border-[#d4c87a]/15
                                   text-[#d4c87a] font-mono text-xs placeholder:text-[#2a2410]
                                   px-3 py-2 resize-none mb-2
                                   focus:outline-none focus:border-[#d4c87a]/40 transition-all"
                          ></textarea>
                          <button type="button"
                            (click)="submitComment(review.id)"
                            [disabled]="(commentDrafts()[review.id] ?? '').trim().length === 0 || commentingId() === review.id"
                            class="px-3 py-1 font-mono text-xs tracking-widest uppercase text-[#8b7a2e]
                                   border border-[#8b7a2e]/40 hover:text-[#d4c87a] hover:border-[#d4c87a]/40
                                   disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                          >{{ commentingId() === review.id ? 'Enviando...' : 'Comentar' }}</button>
                        </div>
                      }

                    </div>
                  }
                </div>

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

  // ── nueva reseña ──────────────────────────────────────────────
  reviews       = signal<Review[]>([]);
  loading       = signal(true);
  ratingValue   = signal(0);
  ratingHover   = signal(0);
  reviewText    = '';
  submitting    = signal(false);
  submitError   = signal('');
  submitSuccess = signal(false);

  // ── edición inline ────────────────────────────────────────────
  editingId  = signal('');
  editText   = '';
  editRating = signal(0);
  editHover  = signal(0);
  saving     = signal(false);
  editError  = signal('');

  // ── comentarios ───────────────────────────────────────────────
  openComments  = signal<Set<string>>(new Set());
  commentsMap   = signal<Record<string, Comment[]>>({});
  commentCounts = signal<Record<string, number>>({});
  commentDrafts = signal<Record<string, string>>({});
  commentingId  = signal('');

  readonly stars        = [1, 2, 3, 4, 5];
  readonly skeletonCards = [1, 2, 3];
  slowLoad = signal(false);
  private slowTimer?: ReturnType<typeof setTimeout>;
  private ctx!: gsap.Context;

  constructor(
    public  auth:          AuthService,
    private reviewService: ReviewService,
    private commentService: CommentService,
  ) {}

  ngOnInit() { this.loadReviews(); }

  ngAfterViewInit() {
    setTimeout(() => {
      this.ctx = gsap.context(() => {
        if (this.headingRef) {
          gsap.from(this.headingRef.nativeElement, {
            autoAlpha: 0, y: 30, duration: 0.8, ease: 'power2.out',
            immediateRender: false,
            scrollTrigger: { trigger: this.headingRef.nativeElement, start: 'top 80%', once: true },
          });
        }
      });
    }, 100);
  }

  ngOnDestroy() {
    this.ctx?.revert();
    clearTimeout(this.slowTimer);
  }

  // ── carga ─────────────────────────────────────────────────────
  private animateCards() {
    if (!this.cardRefs?.length) return;
    const cards = this.cardRefs.toArray().map(r => r.nativeElement);
    setTimeout(() => {
      gsap.from(cards, {
        autoAlpha: 0, y: 24, stagger: 0.08, duration: 0.55, ease: 'power2.out',
        immediateRender: false,
        scrollTrigger: { trigger: cards[0], start: 'top 90%', once: true },
      });
      ScrollTrigger.refresh();
    }, 50);
  }

  async loadReviews() {
    this.loading.set(true);
    this.slowLoad.set(false);
    clearTimeout(this.slowTimer);

    // Mostrar aviso de arranque lento tras 3 s
    this.slowTimer = setTimeout(() => this.slowLoad.set(true), 3000);

    const data = await this.reviewService.getAll();
    clearTimeout(this.slowTimer);
    this.reviews.set(data);

    // Mostrar las cards YA — contadores se cargan en background
    this.loading.set(false);
    this.slowLoad.set(false);
    setTimeout(() => this.animateCards(), 50);

    // Cargar contadores de comentarios sin bloquear la UI
    const counts: Record<string, number> = {};
    await Promise.all(data.map(async r => {
      try {
        const cs = await this.commentService.getByReview(r.id);
        counts[r.id] = cs.length;
      } catch {
        counts[r.id] = 0;
      }
    }));
    this.commentCounts.set(counts);
  }

  // ── crear reseña ──────────────────────────────────────────────
  async submitReview() {
    const user = this.auth.user();
    if (!user || this.ratingValue() === 0 || this.reviewText.trim().length < 4) return;

    this.submitting.set(true);
    this.submitError.set('');

    const { error } = await this.reviewService.add(
      user.id, this.auth.getDisplayName(), this.ratingValue(), this.reviewText.trim()
    );

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

  // ── editar reseña ─────────────────────────────────────────────
  startEdit(review: Review) {
    this.editingId.set(review.id);
    this.editText   = review.text;
    this.editRating.set(review.rating);
    this.editError.set('');
  }

  cancelEdit() {
    this.editingId.set('');
    this.editError.set('');
  }

  async saveEdit(id: string) {
    const user = this.auth.user();
    if (!user || this.editText.trim().length < 4 || this.editRating() === 0) return;

    this.saving.set(true);
    this.editError.set('');

    const { error } = await this.reviewService.update(
      id, user.id, this.auth.getDisplayName(), this.editRating(), this.editText.trim()
    );

    if (error) {
      this.editError.set('Error al guardar los cambios. Inténtalo de nuevo.');
    } else {
      this.editingId.set('');
      await this.loadReviews();
    }
    this.saving.set(false);
  }

  // ── eliminar reseña ───────────────────────────────────────────
  async deleteReview(id: string) {
    const user = this.auth.user();
    if (!user) return;

    const { error } = await this.reviewService.delete(id, user.id);
    if (error) {
      // mostrar error brevemente en la reseña correspondiente
      this.submitError.set('No se pudo eliminar la reseña. Recarga la página e inténtalo de nuevo.');
      setTimeout(() => this.submitError.set(''), 4000);
    } else {
      await this.loadReviews();
    }
  }

  // ── comentarios ───────────────────────────────────────────────
  async toggleComments(reviewId: string) {
    const open = new Set(this.openComments());
    if (open.has(reviewId)) {
      open.delete(reviewId);
      this.openComments.set(open);
    } else {
      open.add(reviewId);
      this.openComments.set(open);
      await this.refreshComments(reviewId);
    }
  }

  private async refreshComments(reviewId: string) {
    const cs = await this.commentService.getByReview(reviewId);
    this.commentsMap.update(m => ({ ...m, [reviewId]: cs }));
    this.commentCounts.update(c => ({ ...c, [reviewId]: cs.length }));
  }

  setDraft(reviewId: string, text: string) {
    this.commentDrafts.update(d => ({ ...d, [reviewId]: text }));
  }

  async submitComment(reviewId: string) {
    const user = this.auth.user();
    const draft = (this.commentDrafts()[reviewId] ?? '').trim();
    if (!user || !draft) return;

    this.commentingId.set(reviewId);
    const { error } = await this.commentService.add(
      reviewId, user.id, this.auth.getDisplayName(), draft
    );

    if (!error) {
      this.setDraft(reviewId, '');
      await this.refreshComments(reviewId);
    }
    this.commentingId.set('');
  }

  async deleteComment(commentId: string, reviewId: string) {
    const user = this.auth.user();
    if (!user) return;
    const { error } = await this.commentService.delete(commentId, user.id);
    if (!error) await this.refreshComments(reviewId);
  }

  // ── helpers ───────────────────────────────────────────────────
  ratingEmoji(rating: number): string {
    return ({ 5:'😄', 4:'😊', 3:'🙂', 2:'😐', 1:'😠' } as Record<number,string>)[rating] ?? '🙂';
  }

  starString(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  }
}
