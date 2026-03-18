import { Routes } from '@angular/router';
import { LandingComponent }      from './pages/landing/landing.component';
import { LoginPageComponent }    from './pages/login/login.component';
import { RegistroPageComponent } from './pages/registro/registro.component';
import { PerfilPageComponent }   from './pages/perfil/perfil.component';

export const routes: Routes = [
  { path: '',         component: LandingComponent      },
  { path: 'login',    component: LoginPageComponent    },
  { path: 'registro', component: RegistroPageComponent },
  { path: 'perfil',   component: PerfilPageComponent   },
  { path: '**',       redirectTo: ''                   },
];
