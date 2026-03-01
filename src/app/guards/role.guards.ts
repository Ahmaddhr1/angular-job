import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../services/auth';

export const superAdminGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  const admin = auth.getAdmin();

  if (admin && admin.role === 'Super Admin') return true;

  router.navigate(['/admins']);
  return false;
};