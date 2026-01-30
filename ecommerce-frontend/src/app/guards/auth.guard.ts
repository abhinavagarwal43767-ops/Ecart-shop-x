import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  const isAuthPage =
    state.url === '/login' || state.url === '/register';
  if (token && isAuthPage) {
    router.navigate(['/']);
    return false;
  }
  if (!token && !isAuthPage) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
