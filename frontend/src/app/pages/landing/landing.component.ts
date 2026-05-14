import { Component } from '@angular/core';
import { HeroComponent }               from '../../sections/hero/hero.component';
import { FeaturesComponent }           from '../../sections/features/features.component';
import { ReviewsComponent }            from '../../sections/reviews/reviews.component';
import { LeaderboardSectionComponent } from '../../sections/leaderboard/leaderboard.component';
import { FaqComponent }                from '../../sections/faq/faq.component';
import { ContactComponent }            from '../../sections/contact/contact.component';
import { FooterComponent }             from '../../components/footer/footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    HeroComponent,
    FeaturesComponent,
    ReviewsComponent,
    LeaderboardSectionComponent,
    FaqComponent,
    ContactComponent,
    FooterComponent,
  ],
  template: `
    <app-hero />
    <app-features />
    <app-reviews />
    <app-leaderboard />
    <app-faq />
    <app-contact />
    <app-footer />
  `,
})
export class LandingComponent {}
