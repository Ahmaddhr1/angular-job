import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Admins } from './pages/admins/admins';
import { authGuard } from './guards/auth.guards';
import { superAdminGuard } from './guards/role.guards';
import { Complexes } from './pages/complexes/complexes';
import { Buildings } from './pages/buildings/buildings';
import { AddAdmin } from './pages/add-admin/add-admin';
import { AddComplex } from './pages/add-complex/add-complex';
import { AddBuilding } from './pages/add-building/add-building';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'admins' , component:Admins , canActivate: [authGuard]},
    { path: 'complexes', component: Complexes, canActivate: [authGuard] },
    { path: 'buildings', component: Buildings, canActivate: [authGuard] },
    { path:'add-admin',component: AddAdmin, canActivate: [authGuard,superAdminGuard]},
    { path:'add-complex',component: AddComplex, canActivate: [authGuard]},
    { path:'add-building',component: AddBuilding, canActivate: [authGuard]},
    { path: '**', redirectTo: 'login' },
];
