import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AvailabilityService } from './availability.service';
import { Availability } from '../models/availability.model';
import { environment } from '../../../environment';

describe('AvailabilityService', () => {
  let service: AvailabilityService;
  let httpTesting: HttpTestingController;
  const baseUrl = environment.apiBaseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AvailabilityService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET all availabilities', async () => {
    const mockData: Availability[] = [
      { Id: 1, StartDate: new Date(), EndDate: new Date(), Timeslots: ['9:00'], Services: ['Web'] }
    ];
    const promise = service.getAvailabilities();

    const req = httpTesting.expectOne(`${baseUrl}/availabilities`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);

    const response = await promise;
    expect(response.body).toEqual(mockData);
  });

  it('should GET available dates', async () => {
    const mockDates = ['2026-03-15', '2026-03-16'];
    const promise = service.getAvailableDates();

    const req = httpTesting.expectOne(`${baseUrl}/availabilities/dates`);
    expect(req.request.method).toBe('GET');
    req.flush(mockDates);

    const response = await promise;
    expect(response.body).toEqual(mockDates);
  });

  it('should GET available services by date', async () => {
    const promise = service.getAvailableServicesByDate('2026-03-15');

    const req = httpTesting.expectOne(`${baseUrl}/availabilities/services?date=2026-03-15`);
    expect(req.request.method).toBe('GET');
    req.flush(['Service A']);

    const response = await promise;
    expect(response.body).toEqual(['Service A']);
  });

  it('should POST to get timeslots by date and services', async () => {
    const date = new Date('2026-03-15');
    const services = ['Service A'];
    const promise = service.postAvailableTimeslotsByDateByServices(date, services);

    const req = httpTesting.expectOne(`${baseUrl}/availabilities/timeslots`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ date, services });
    req.flush(['9:00', '10:00']);

    const response = await promise;
    expect(response.body).toEqual(['9:00', '10:00']);
  });

  it('should POST a new availability', async () => {
    const newAvailability: Availability = {
      StartDate: new Date(), EndDate: new Date(), Timeslots: ['9:00'], Services: ['Web']
    };
    const promise = service.addAvailability(newAvailability);

    const req = httpTesting.expectOne(`${baseUrl}/availabilities`);
    expect(req.request.method).toBe('POST');
    req.flush({ ...newAvailability, Id: 1 });

    const response = await promise;
    expect(response.body!.Id).toBe(1);
  });

  it('should PUT to update an availability', async () => {
    const updated: Availability = {
      Id: 1, StartDate: new Date(), EndDate: new Date(), Timeslots: ['10:00'], Services: ['Web']
    };
    const promise = service.updateAvailability(1, updated);

    const req = httpTesting.expectOne(`${baseUrl}/availabilities/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updated);

    const response = await promise;
    expect(response.body).toEqual(updated);
  });

  it('should DELETE an availability', async () => {
    const promise = service.deleteAvailability(1);

    const req = httpTesting.expectOne(`${baseUrl}/availabilities/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 200, statusText: 'OK' });

    const response = await promise;
    expect(response.status).toBe(200);
  });

  describe('validateAvailabilityData', () => {
    it('should return true for valid data', () => {
      const data = { StartDate: new Date(), EndDate: new Date(), Timeslots: ['9:00'] } as Availability;
      expect(service.validateAvailabilityData(data)).toBeTrue();
    });

    it('should return false when required fields are missing', () => {
      const data = { StartDate: new Date() } as Availability;
      expect(service.validateAvailabilityData(data)).toBeFalse();
    });
  });
});
