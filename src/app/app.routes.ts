import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { AdminComponent } from './admin/admin.component';
import { MainComponent } from "./main/main.component";

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/main',
    pathMatch: 'full'
  },
  {
    path: 'main',
    component: MainComponent
  },
  {
    path: 'admin',
    component: AdminComponent
  },
  {
    path: '**',
    redirectTo: '/main',
    pathMatch: 'full'
  }
];
