import { Routes } from '@angular/router';
import { LandingComponent }           from './pages/landing/landing.component';
import { LoginPageComponent }         from './pages/login/login.component';
import { RegistroPageComponent }      from './pages/registro/registro.component';
import { PerfilPageComponent }        from './pages/perfil/perfil.component';
import { DescargaPageComponent }      from './pages/descarga/descarga.component';
import { LeaderboardPageComponent }   from './pages/leaderboard/leaderboard.component';
import { PrivacidadComponent }        from './pages/legal/privacidad.component';
import { TerminosComponent }          from './pages/legal/terminos.component';
import { CookiesComponent }           from './pages/legal/cookies.component';
import { EulaComponent }              from './pages/legal/eula.component';

export const routes: Routes = [
  { path: '',             component: LandingComponent           },
  { path: 'login',        component: LoginPageComponent         },
  { path: 'registro',     component: RegistroPageComponent      },
  { path: 'perfil',       component: PerfilPageComponent        },
  { path: 'descarga',     component: DescargaPageComponent      },
  { path: 'leaderboard',  component: LeaderboardPageComponent   },
  { path: 'privacidad',   component: PrivacidadComponent        },
  { path: 'terminos',     component: TerminosComponent          },
  { path: 'cookies',      component: CookiesComponent           },
  { path: 'eula',         component: EulaComponent              },
  { path: '**',           redirectTo: ''                        },
];
