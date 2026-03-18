import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '../../lib/utils';

export interface AccordionItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClass">
      @for (item of items; track item.question; let i = $index) {
        <div class="border-b border-orange-500/20 last:border-0">
          <button
            type="button"
            class="w-full flex items-center justify-between py-5 text-left text-orange-100 font-medium hover:text-orange-300 transition-colors duration-200"
            (click)="toggle(i)"
          >
            <span>{{ item.question }}</span>
            <span
              class="ml-4 shrink-0 text-orange-400 transition-transform duration-300"
              [class.rotate-45]="isOpen(i)"
            >+</span>
          </button>
          @if (isOpen(i)) {
            <div class="pb-5 text-orange-100/70 leading-relaxed animate-fade-in-up">
              {{ item.answer }}
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class AccordionComponent {
  @Input() items: AccordionItem[] = [];
  @Input() class = '';
  @Input() allowMultiple = false;

  private openIndexes = signal<Set<number>>(new Set());

  get containerClass() {
    return cn('border border-orange-500/20 rounded-xl overflow-hidden px-6', this.class);
  }

  isOpen(index: number): boolean {
    return this.openIndexes().has(index);
  }

  toggle(index: number) {
    this.openIndexes.update((set) => {
      const next = new Set(this.allowMultiple ? set : new Set<number>());
      if (set.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }
}
