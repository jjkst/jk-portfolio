import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProjectService } from './project.service';
import { PRODUCTS } from '../models/project.modal';

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(ProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return project IDs with status 200', async () => {
    const response = await service.getProjectIds();
    expect(response.status).toBe(200);
    expect(response.body).toEqual(PRODUCTS.map(p => p.Id));
  });

  it('should return all projects', async () => {
    const response = await service.getProjects();
    expect(response.status).toBe(200);
    expect(response.body).toEqual(PRODUCTS);
    expect(response.body!.length).toBe(PRODUCTS.length);
  });

  it('should return a project by id', async () => {
    const response = await service.getProjectById(1);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(PRODUCTS.find(p => p.Id === 1));
  });

  it('should return undefined for non-existent project id', async () => {
    const response = await service.getProjectById(999);
    expect(response.status).toBe(200);
    expect(response.body).toBeFalsy();
  });
});
