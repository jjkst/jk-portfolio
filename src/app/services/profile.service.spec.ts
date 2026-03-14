import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProfileService } from './profile.service';
import { PROFILE } from '../models/profile.modal';

describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(ProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return profile data with status 200', async () => {
    const response = await service.getProfile();
    expect(response.status).toBe(200);
    expect(response.body).toEqual(PROFILE);
  });

  it('should return profile with Title and Description', async () => {
    const response = await service.getProfile();
    expect(response.body.Title).toBeTruthy();
    expect(response.body.Description.length).toBeGreaterThan(0);
  });
});
