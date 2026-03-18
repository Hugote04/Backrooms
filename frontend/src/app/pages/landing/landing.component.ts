import { Component } from '@angular/core';
import { HeroComponent } from '../../sections/hero/hero.component';
import { FeaturesComponent } from '../../sections/features/features.component';
import { ReviewsComponent } from '../../sections/reviews/reviews.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [HeroComponent, FeaturesComponent, ReviewsComponent, FooterComponent],
  template: `
    <app-hero />
    <app-features />
    <app-reviews />
    <app-footer />
  `,
})
export class LandingComponent {}
