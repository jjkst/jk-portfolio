import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Service } from '../models/service.model';
import { environment } from '../../../environment';

describe('ProductService', () => {
  let service: ProductService;
  let httpTesting: HttpTestingController;
  const baseUrl = environment.apiBaseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ProductService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET all services', async () => {
    const mockServices: Service[] = [
      { Id: 1, Title: 'Web Dev', FileName: 'web.svg', Description: 'Web development' }
    ];
    const promise = service.getServices();

    const req = httpTesting.expectOne(`${baseUrl}/services`);
    expect(req.request.method).toBe('GET');
    req.flush(mockServices);

    const response = await promise;
    expect(response.body).toEqual(mockServices);
  });

  it('should GET ruku services', async () => {
    const promise = service.getRukuServices();

    const req = httpTesting.expectOne(`${baseUrl}/rukuservices`);
    expect(req.request.method).toBe('GET');
    req.flush([]);

    const response = await promise;
    expect(response.body).toEqual([]);
  });

  it('should GET service by id', async () => {
    const mockService: Service = { Id: 1, Title: 'Web Dev', FileName: 'web.svg', Description: 'Test' };
    const promise = service.getServicesById(1);

    const req = httpTesting.expectOne(`${baseUrl}/services/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockService);

    const response = await promise;
    expect(response.body).toEqual(mockService);
  });

  it('should GET ruku service by id', async () => {
    const promise = service.getRukuServicesById(5);

    const req = httpTesting.expectOne(`${baseUrl}/rukuservices/5`);
    expect(req.request.method).toBe('GET');
    req.flush({ Id: 5 });

    const response = await promise;
    expect(response.body!.Id).toBe(5);
  });

  it('should POST a new service', async () => {
    const newService: Service = { Id: null, Title: 'New', FileName: 'new.svg', Description: 'New service' };
    const promise = service.addService(newService);

    const req = httpTesting.expectOne(`${baseUrl}/services`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newService);
    req.flush({ ...newService, Id: 1 });

    const response = await promise;
    expect(response.body!.Id).toBe(1);
  });

  it('should PUT to update a service', async () => {
    const updated: Service = { Id: 1, Title: 'Updated', FileName: 'up.svg', Description: 'Updated' };
    const promise = service.updateService(1, updated);

    const req = httpTesting.expectOne(`${baseUrl}/services/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updated);

    const response = await promise;
    expect(response.body).toEqual(updated);
  });

  it('should DELETE a service', async () => {
    const promise = service.deleteService(1);

    const req = httpTesting.expectOne(`${baseUrl}/services/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 200, statusText: 'OK' });

    const response = await promise;
    expect(response.status).toBe(200);
  });

  describe('validateServiceData', () => {
    it('should return true for valid service data', () => {
      const data: Service = {
        Id: 1, Title: 'Test', FileName: 'test.svg', Description: 'Desc',
        Features: ['f1'], PricingPlans: [{ Name: 'Basic', InitialSetupFee: '100', MonthlySubscription: '10', Features: [] }]
      };
      expect(service.validateServiceData(data)).toBeTrue();
    });

    it('should return false when required fields are missing', () => {
      const data = { Id: 1, Title: 'Test', FileName: 'test.svg' } as Service;
      expect(service.validateServiceData(data)).toBeFalse();
    });
  });
});
