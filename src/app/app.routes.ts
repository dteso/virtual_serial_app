import { Routes } from '@angular/router';
import { LoginComponent } from './app/modules/login/login.component';
import { TerminalComponent } from './app/modules/terminal/terminal.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'terminal', component: TerminalComponent },
  { path: '**', redirectTo: 'login' }
];
