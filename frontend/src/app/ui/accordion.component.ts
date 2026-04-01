import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

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
        <div class="border-b border-[#d4c87a]/15 last:border-0">
          <button
            type="button"
            class="w-full flex items-center justify-between py-4 text-left
                   text-[#d4c87a] font-mono text-sm tracking-wider uppercase
                   hover:text-[#f0ecc4] transition-colors duration-200"
            (click)="toggle(i)"
          >
            <span>{{ item.question }}</span>
            <span class="ml-4 shrink-0 text-[#8b7a2e] font-mono text-base transition-none">
              {{ isOpen(i) ? '[-]' : '[+]' }}
            </span>
          </button>
          @if (isOpen(i)) {
            <div class="pb-4 text-[#8b7a2e] font-mono text-xs leading-relaxed animate-fade-in-up">
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
    return `border border-[#d4c87a]/15 px-6 bg-[#0a0900] ${this.class}`;
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
