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
      'inline-flex items-center justify-center font-mono tracking-widest uppercase transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
      {
        'border border-[#d4c87a]/80 bg-[#d4c87a]/[0.08] text-[#d4c87a] hover:bg-[#d4c87a]/[0.18] hover:shadow-[0_0_16px_rgba(212,200,122,0.3)]':
          this.variant === 'cta',
        'bg-[#d4c87a]/10 border border-[#d4c87a]/20 text-[#d4c87a] hover:bg-[#d4c87a]/20 hover:border-[#d4c87a]/40':
          this.variant === 'default',
        'border border-[#8b7a2e]/60 text-[#8b7a2e] hover:border-[#d4c87a]/60 hover:text-[#d4c87a]':
          this.variant === 'outline',
        'text-[#8b7a2e] hover:text-[#d4c87a] hover:bg-[#d4c87a]/[0.08]':
          this.variant === 'ghost',
        'px-4 py-2 text-xs':  this.size === 'sm',
        'px-6 py-3 text-xs':  this.size === 'md',
        'px-8 py-4 text-sm':  this.size === 'lg',
      },
      this.class
    );
  }
}
