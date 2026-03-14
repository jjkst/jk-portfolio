import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { SkillService } from './skill.service';
import { SKILLS } from '../models/skill.model';

describe('SkillService', () => {
  let service: SkillService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(SkillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return skills data with status 200', async () => {
    const response = await service.getSkills();
    expect(response.status).toBe(200);
    expect(response.body).toEqual(SKILLS);
  });

  it('should return all skill categories', async () => {
    const response = await service.getSkills();
    expect(response.body!.length).toBe(SKILLS.length);
  });
});
