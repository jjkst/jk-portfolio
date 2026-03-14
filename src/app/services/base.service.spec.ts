import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { environment } from '../../../environment';

@Injectable({ providedIn: 'root' })
class TestService extends BaseService {
  testGet<T>(endpoint: string, options?: any) {
    return this.get<T>(endpoint, options);
  }
  testPost<T>(endpoint: string, data: any, options?: any) {
    return this.post<T>(endpoint, data, options);
  }
  testPut<T>(endpoint: string, data: any, options?: any) {
    return this.put<T>(endpoint, data, options);
  }
  testDelete<T>(endpoint: string, options?: any) {
    return this.delete<T>(endpoint, options);
  }
  testValidateRequiredFields(data: any, fields: string[]) {
    return this.validateRequiredFields(data, fields);
  }
  testFormatErrorMessage(error: any) {
    return this.formatErrorMessage(error);
  }
  testHandleError(error: HttpErrorResponse) {
    return this.handleError(error);
  }
}

describe('BaseService', () => {
  let service: TestService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        TestService
      ]
    });
    service = TestBed.inject(TestService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  describe('GET', () => {
    it('should make a GET request and return response', async () => {
      const mockData = [{ id: 1, name: 'test' }];
      const promise = service.testGet<any[]>('/items');

      const req = httpTesting.expectOne(`${environment.apiBaseUrl}/items`);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);

      const response = await promise;
      expect(response.body).toEqual(mockData);
      expect(response.status).toBe(200);
    });

    it('should throw on HTTP error', async () => {
      const promise = service.testGet('/items');

      const req = httpTesting.expectOne(`${environment.apiBaseUrl}/items`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });

      await expectAsync(promise).toBeRejected();
    });
  });

  describe('POST', () => {
    it('should make a POST request with data and return response', async () => {
      const payload = { name: 'new item' };
      const mockResponse = { id: 1, name: 'new item' };
      const promise = service.testPost<any>('/items', payload);

      const req = httpTesting.expectOne(`${environment.apiBaseUrl}/items`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush(mockResponse);

      const response = await promise;
      expect(response.body).toEqual(mockResponse);
    });
  });

  describe('PUT', () => {
    it('should make a PUT request with data and return response', async () => {
      const payload = { id: 1, name: 'updated' };
      const promise = service.testPut<any>('/items/1', payload);

      const req = httpTesting.expectOne(`${environment.apiBaseUrl}/items/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(payload);
      req.flush(payload);

      const response = await promise;
      expect(response.body).toEqual(payload);
    });
  });

  describe('DELETE', () => {
    it('should make a DELETE request and return response', async () => {
      const promise = service.testDelete<void>('/items/1');

      const req = httpTesting.expectOne(`${environment.apiBaseUrl}/items/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null, { status: 200, statusText: 'OK' });

      const response = await promise;
      expect(response.status).toBe(200);
    });
  });

  describe('handleError', () => {
    it('should return throwError for server-side errors', (done) => {
      const error = new HttpErrorResponse({ status: 500, statusText: 'Server Error' });
      service.testHandleError(error).subscribe({
        error: (err) => {
          expect(err.status).toBe(500);
          done();
        }
      });
    });
  });

  describe('validateRequiredFields', () => {
    it('should return true when all required fields are present', () => {
      const data = { name: 'Test', email: 'test@test.com' };
      expect(service.testValidateRequiredFields(data, ['name', 'email'])).toBeTrue();
    });

    it('should return false when a field is null', () => {
      const data = { name: null, email: 'test@test.com' };
      expect(service.testValidateRequiredFields(data, ['name', 'email'])).toBeFalse();
    });

    it('should return false when a field is undefined', () => {
      const data = { email: 'test@test.com' };
      expect(service.testValidateRequiredFields(data, ['name', 'email'])).toBeFalse();
    });

    it('should return false when a field is empty string', () => {
      const data = { name: '', email: 'test@test.com' };
      expect(service.testValidateRequiredFields(data, ['name', 'email'])).toBeFalse();
    });
  });

  describe('formatErrorMessage', () => {
    it('should return the string directly if error is a string', () => {
      expect(service.testFormatErrorMessage('Something went wrong')).toBe('Something went wrong');
    });

    it('should return error.error.message if present', () => {
      expect(service.testFormatErrorMessage({ error: { message: 'Bad request' } })).toBe('Bad request');
    });

    it('should return error.message if present', () => {
      expect(service.testFormatErrorMessage({ message: 'Network error' })).toBe('Network error');
    });

    it('should return default message for unknown errors', () => {
      expect(service.testFormatErrorMessage({})).toBe('An unexpected error occurred. Please try again.');
    });
  });
});
