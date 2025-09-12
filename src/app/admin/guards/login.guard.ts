import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../service/token.service';
export const loginGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.isLoggedIn()) {
    // If logged in, redirect to dashboard (or home)
    router.navigate(['/admin/dashboard']);
    return false;
  }
  
  // If not logged in, allow access to login page
  return true;
};
