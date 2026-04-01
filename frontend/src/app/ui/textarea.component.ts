import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { cn } from '../../lib/utils';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
  template: `
    <textarea
      [class]="computedClass"
      [placeholder]="placeholder"
      [rows]="rows"
      [disabled]="disabled"
      [(ngModel)]="value"
      (ngModelChange)="onChange($event)"
      (blur)="onTouched()"
    ></textarea>
  `,
})
export class TextareaComponent implements ControlValueAccessor {
  @Input() placeholder = '';
  @Input() rows = 4;
  @Input() disabled = false;
  @Input() class = '';

  value = '';
  onChange: (v: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(val: string) { this.value = val ?? ''; }
  registerOnChange(fn: (v: string) => void) { this.onChange = fn; }
  registerOnTouched(fn: () => void) { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean) { this.disabled = isDisabled; }

  get computedClass() {
    return cn(
      'w-full bg-[#0e0d04] border border-[#d4c87a]/20 px-4 py-3 resize-none',
      'text-[#d4c87a] font-mono text-sm placeholder:text-[#3a3620]',
      'focus:outline-none focus:border-[#d4c87a]/60 focus:ring-0',
      'transition-all duration-200 disabled:opacity-50',
      this.class
    );
  }
}
