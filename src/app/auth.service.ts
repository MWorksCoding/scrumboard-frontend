import { Injectable } from '@angular/core';
import { Observable, catchError, lastValueFrom, throwError } from 'rxjs';
import { environment } from '../environments/environments';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}
  error: string = '';

  /**
   * Logs in a user with the provided username and password.
   * @param username The username of the user.
   * @param password The password of the user.
   * @returns HTTP response after logging in.
   */
  public loginWithUsernameAndPassword(username: string, password: string) {

    const url = environment.baseUrl + '/login/';
    const body = {
      username: username,
      password: password,
    };
    return lastValueFrom(this.http.post(url, body));
  }
}

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private router: Router) {}

  /**
   * Intercepts HTTP requests and adds authorization token to the headers if available.
   * Handles HTTP errors, specifically 401 Unauthorized, by redirecting to the login page.
   * @param request The intercepted HTTP request.
   * @param next The next HTTP handler in the chain.
   * @returns An Observable of the HTTP events, including the HTTP response.
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    if (token) {
      request = request.clone({
        setHeaders: { Authorization: `Token ${token}` },
      });
    }

    return next.handle(request).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          this.router.navigateByUrl('/login');
        }
        return throwError(() => err);
      })
    );
  }
}