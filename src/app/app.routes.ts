import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Admins } from './pages/admins/admins';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    {path: 'admins' , component:Admins},
];
