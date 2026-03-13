import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Only attach token to API requests
  if (!req.url.startsWith(environment.apiBaseUrl)) {
    return next(req);
  }

  const token = typeof localStorage !== 'undefined'
    ? localStorage.getItem('auth_token')
    : null;

  if (token) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(authReq);
  }

  return next(req);
};
