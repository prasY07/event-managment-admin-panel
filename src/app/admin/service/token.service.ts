import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

   private tokenKey = 'token';

  setToken(token: string): void {
    if (token && token.trim().length > 0) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    // Return null if token is empty string or null
    return (token && token.trim().length > 0) ? token : null;
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
    // Also clear any other auth-related data
    localStorage.removeItem('user');
    sessionStorage.clear();
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    console.log("token", !!token);
    return !!token && token.trim().length > 0;
  }

  // Clear all auth data
  clearAuthData(): void {
    this.removeToken();
  }
}
