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
      'w-full bg-orange-500/10 border border-orange-500/20 rounded-md px-4 py-3',
      'text-orange-100 placeholder:text-orange-100/40 resize-none',
      'focus:outline-none focus:border-orange-500/60 focus:bg-orange-500/15',
      'transition-all duration-200 disabled:opacity-50',
      this.class
    );
  }
}
