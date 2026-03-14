import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { environment } from '../../../environment';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
    localStorage.removeItem('auth_token');
  });

  it('should add Authorization header for API requests when token exists', () => {
    localStorage.setItem('auth_token', 'test-jwt-token');

    httpClient.get(`${environment.apiBaseUrl}/test`).subscribe();

    const req = httpTesting.expectOne(`${environment.apiBaseUrl}/test`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-jwt-token');
    req.flush({});
  });

  it('should not add Authorization header when no token exists', () => {
    localStorage.removeItem('auth_token');

    httpClient.get(`${environment.apiBaseUrl}/test`).subscribe();

    const req = httpTesting.expectOne(`${environment.apiBaseUrl}/test`);
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('should not add Authorization header for non-API requests', () => {
    localStorage.setItem('auth_token', 'test-jwt-token');

    httpClient.get('https://other-api.com/data').subscribe();

    const req = httpTesting.expectOne('https://other-api.com/data');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('should pass through the request unchanged for non-API URLs without token', () => {
    httpClient.get('/assets/config.json').subscribe();

    const req = httpTesting.expectOne('/assets/config.json');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });
});
