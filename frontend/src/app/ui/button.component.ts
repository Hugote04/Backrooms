import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '../../lib/utils';

export type ButtonVariant = 'cta' | 'default' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [class]="computedClass"
      [disabled]="disabled"
      [type]="type"
    >
      <ng-content />
    </button>
  `,
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'default';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() class = '';

  get computedClass() {
    return cn(
      'inline-flex items-center justify-center font-semibold transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
      {
        'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white rounded-full hover:scale-105 shadow-lg shadow-orange-500/25':
          this.variant === 'cta',
        'bg-orange-500/10 border border-orange-500/30 text-orange-100 hover:bg-orange-500/20 hover:border-orange-500/50 rounded-md':
          this.variant === 'default',
        'border border-orange-500/40 text-orange-300 hover:bg-orange-500/10 rounded-md':
          this.variant === 'outline',
        'text-orange-300 hover:text-orange-200 hover:bg-orange-500/10 rounded-md':
          this.variant === 'ghost',
        'px-4 py-2 text-sm': this.size === 'sm',
        'px-6 py-3 text-base': this.size === 'md',
        'px-8 py-4 text-lg': this.size === 'lg',
      },
      this.class
    );
  }
}
