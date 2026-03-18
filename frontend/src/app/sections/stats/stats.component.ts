import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChildren,
  QueryList,
} from '@angular/core';

interface Stat {
  value: string;
  label: string;
  sublabel: string;
}

@Component({
  selector: 'app-stats',
  standalone: true,
  template: `
    <section
      id="stats"
      class="py-24 bg-gradient-to-b from-black to-orange-950/20"
    >
      <div class="container mx-auto px-4">

        <!-- Heading -->
        <div class="text-center mb-16 reveal" #revealEl>
          <h2 class="text-4xl md:text-5xl font-bold mb-4">
            <span class="bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Trusted by Thousands
            </span>
          </h2>
          <p class="text-orange-100/60 text-lg">
            Join the community of brave explorers venturing into the unknown.
          </p>
        </div>

        <!-- Stats row -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          @for (stat of stats; track stat.label; let i = $index) {
            <div
              class="reveal text-center p-8 rounded-xl border border-orange-500/20
                     bg-orange-500/5 hover:border-orange-500/40 hover:bg-orange-500/10
                     transition-all duration-300"
              #revealEl
              [style.transition-delay]="i * 150 + 'ms'"
            >
              <div class="text-5xl md:text-6xl font-bold mb-2
                          bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                {{ stat.value }}
              </div>
              <div class="text-orange-100 font-semibold text-lg mb-1">{{ stat.label }}</div>
              <div class="text-orange-100/50 text-sm">{{ stat.sublabel }}</div>
            </div>
          }
        </div>

      </div>
    </section>
  `,
})
export class StatsComponent implements OnInit, OnDestroy {
  @ViewChildren('revealEl') revealEls!: QueryList<ElementRef>;

  stats: Stat[] = [
    { value: '50K+',  label: 'Downloads',  sublabel: 'and growing every day'     },
    { value: '4.8',   label: 'Average Rating', sublabel: '★★★★★ from verified players' },
    { value: '1000+', label: 'Reviews',    sublabel: 'from our community'          },
  ];

  private observer!: IntersectionObserver;

  ngOnInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            this.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    setTimeout(() => this.observeAll(), 0);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private observeAll(): void {
    this.revealEls.forEach((el) => this.observer.observe(el.nativeElement));
  }
}
