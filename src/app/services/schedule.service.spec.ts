import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ScheduleService } from './schedule.service';
import { Schedule } from '../models/schedule.model';
import { environment } from '../../../environment';

describe('ScheduleService', () => {
  let service: ScheduleService;
  let httpTesting: HttpTestingController;
  const baseUrl = environment.apiBaseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ScheduleService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET all schedules', async () => {
    const mockSchedules: Schedule[] = [
      { Id: 1, ContactName: 'John', SelectedDate: new Date(), Services: ['Web'], Timeslots: ['9:00'], Uid: 'abc' }
    ];
    const promise = service.getSchedules();

    const req = httpTesting.expectOne(`${baseUrl}/schedules`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSchedules);

    const response = await promise;
    expect(response.body).toEqual(mockSchedules);
  });

  it('should POST a new schedule', async () => {
    const newSchedule: Schedule = {
      ContactName: 'Jane', SelectedDate: new Date(), Services: ['API'], Timeslots: ['10:00'], Uid: 'xyz'
    };
    const promise = service.addSchedule(newSchedule);

    const req = httpTesting.expectOne(`${baseUrl}/schedules`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newSchedule);
    req.flush({ ...newSchedule, Id: 1 });

    const response = await promise;
    expect(response.body!.Id).toBe(1);
  });

  it('should PUT to update a schedule', async () => {
    const updated: Schedule = {
      Id: 1, ContactName: 'Jane Updated', SelectedDate: new Date(), Services: ['API'], Timeslots: ['11:00'], Uid: 'xyz'
    };
    const promise = service.updateSchedule('1', updated);

    const req = httpTesting.expectOne(`${baseUrl}/schedules/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updated);

    const response = await promise;
    expect(response.body).toEqual(updated);
  });

  it('should DELETE a schedule', async () => {
    const promise = service.deleteSchedule('1');

    const req = httpTesting.expectOne(`${baseUrl}/schedules/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 200, statusText: 'OK' });

    const response = await promise;
    expect(response.status).toBe(200);
  });

  describe('validateScheduleData', () => {
    it('should return true for valid schedule data', () => {
      const data: Schedule = {
        ContactName: 'John', SelectedDate: new Date(), Services: ['Web'], Timeslots: ['9:00'], Uid: 'abc'
      };
      expect(service.validateScheduleData(data)).toBeTrue();
    });

    it('should return false when required fields are missing', () => {
      const data = { ContactName: 'John' } as Schedule;
      expect(service.validateScheduleData(data)).toBeFalse();
    });
  });
});
