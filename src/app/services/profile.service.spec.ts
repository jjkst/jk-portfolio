import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProfileService } from './profile.service';

const MOCK_PROFILE = {
  Title: 'Test Engineer',
  Description: ['Description line 1'],
  SummaryTitle: 'Summary',
  Summary: ['Summary item 1']
};

describe('ProfileService', () => {
  let service: ProfileService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(ProfileService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return profile data with status 200', async () => {
    const promise = service.getProfile();
    httpTesting.expectOne('assets/data/profile.json').flush(MOCK_PROFILE);
    const response = await promise;
    expect(response.status).toBe(200);
    expect(response.body?.Title).toBe('Test Engineer');
  });

  it('should return profile with Title and Description', async () => {
    const promise = service.getProfile();
    httpTesting.expectOne('assets/data/profile.json').flush(MOCK_PROFILE);
    const response = await promise;
    expect(response.body?.Title).toBeTruthy();
    expect(response.body?.Description.length).toBeGreaterThan(0);
  });
});
