import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenService } from '../admin/service/token.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private tokenService: TokenService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Only handle admin API routes
        if (error.status === 401 && req.url.includes('/api/admin/')) {
          // Remove token
          this.tokenService.removeToken();

          // Optional toast message
          this.toastr.error('Session expired. Please login again.', 'Unauthorized');

          // Redirect to admin login
          this.router.navigate(['/admin/login']);
        }

        return throwError(() => error);
      })
    );
  }
}
