import { Routes } from '@angular/router';
import { notAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canMatch: [
      notAuthenticatedGuard,
      // () => {
      //   console.log('Hola mundo');
      //   return true;
      // }
    ]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin-dashboard/admin-dashboard.routes'),
  },
  {
    path: '',
    loadChildren: () => import('./store-front/store-front.routes'),
  },

];
