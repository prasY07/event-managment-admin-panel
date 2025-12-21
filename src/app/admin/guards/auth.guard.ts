import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../service/token.service';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  
  // Check if user is logged in by checking token existence
  if (tokenService.isLoggedIn() && tokenService.getToken()) {
    return true;
  } else {
    // Clear any existing token to ensure clean state
    tokenService.removeToken();
    // Redirect to login page
    router.navigate(['/admin/login'], { 
      queryParams: { returnUrl: state.url } 
    });
    return false;
  }
};
