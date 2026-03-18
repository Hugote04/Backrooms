import { Component, Input } from '@angular/core';
import { cn } from '../../lib/utils';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div [class]="computedClass">
      <ng-content />
    </div>
  `,
})
export class CardComponent {
  @Input() class = '';
  @Input() hover = false;

  get computedClass() {
    return cn(
      'bg-orange-500/5 border border-orange-500/20 rounded-xl p-6 transition-all duration-300',
      {
        'hover:border-orange-500/40 hover:bg-orange-500/10 hover:scale-105 cursor-pointer': this.hover,
      },
      this.class
    );
  }
}

@Component({
  selector: 'app-card-header',
  standalone: true,
  template: `<div [class]="computedClass"><ng-content /></div>`,
})
export class CardHeaderComponent {
  @Input() class = '';
  get computedClass() { return cn('mb-4', this.class); }
}

@Component({
  selector: 'app-card-title',
  standalone: true,
  template: `<h3 [class]="computedClass"><ng-content /></h3>`,
})
export class CardTitleComponent {
  @Input() class = '';
  get computedClass() { return cn('text-xl font-bold text-orange-100', this.class); }
}

@Component({
  selector: 'app-card-content',
  standalone: true,
  template: `<div [class]="computedClass"><ng-content /></div>`,
})
export class CardContentComponent {
  @Input() class = '';
  get computedClass() { return cn('text-orange-100/70', this.class); }
}
