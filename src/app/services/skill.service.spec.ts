import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SkillService } from './skill.service';

const MOCK_SKILLS = [
  { Id: 1, Title: 'Frameworks', Items: ['Playwright', 'Cypress'] },
  { Id: 2, Title: 'Languages', Items: ['TypeScript', 'C#'] }
];

describe('SkillService', () => {
  let service: SkillService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(SkillService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return skills data with status 200', async () => {
    const promise = service.getSkills();
    httpTesting.expectOne('assets/data/skills.json').flush(MOCK_SKILLS);
    const response = await promise;
    expect(response.status).toBe(200);
    expect(response.body!.length).toBe(2);
  });

  it('should return all skill categories', async () => {
    const promise = service.getSkills();
    httpTesting.expectOne('assets/data/skills.json').flush(MOCK_SKILLS);
    const response = await promise;
    expect(response.body![0].Title).toBe('Frameworks');
  });
});
