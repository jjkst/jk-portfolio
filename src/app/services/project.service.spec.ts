import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProjectService } from './project.service';
import { Project } from '../models/project.model';

const MOCK_PROJECTS: Project[] = [
  { Id: 1, Title: 'Project 1', Type: 'Test', FileName: 'test.svg', Github: 'https://github.com/test/1' },
  { Id: 2, Title: 'Project 2', Type: 'Dev', FileName: 'dev.svg', Github: 'https://github.com/test/2' }
];

describe('ProjectService', () => {
  let service: ProjectService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(ProjectService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return project IDs with status 200', async () => {
    const promise = service.getProjectIds();
    httpTesting.expectOne('assets/data/projects.json').flush(MOCK_PROJECTS);
    const response = await promise;
    expect(response.status).toBe(200);
    expect(response.body).toEqual([1, 2]);
  });

  it('should return all projects', async () => {
    const promise = service.getProjects();
    httpTesting.expectOne('assets/data/projects.json').flush(MOCK_PROJECTS);
    const response = await promise;
    expect(response.status).toBe(200);
    expect(response.body!.length).toBe(2);
  });

  it('should return a project by id', async () => {
    const promise = service.getProjectById(1);
    httpTesting.expectOne('assets/data/projects.json').flush(MOCK_PROJECTS);
    const response = await promise;
    expect(response.status).toBe(200);
    expect(response.body?.Title).toBe('Project 1');
  });

  it('should return undefined for non-existent project id', async () => {
    const promise = service.getProjectById(999);
    httpTesting.expectOne('assets/data/projects.json').flush(MOCK_PROJECTS);
    const response = await promise;
    expect(response.status).toBe(200);
    expect(response.body).toBeFalsy();
  });
});
