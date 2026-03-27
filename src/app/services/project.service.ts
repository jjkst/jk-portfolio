import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BaseService } from './base.service';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService extends BaseService {
  private projects: Project[] | null = null;

  private async loadProjects(): Promise<Project[]> {
    if (this.projects) return this.projects;
    this.projects = await firstValueFrom(
      this.http.get<Project[]>('assets/data/projects.json')
    );
    return this.projects;
  }

  async getProjectIds(): Promise<HttpResponse<number[]>> {
    const projects = await this.loadProjects();
    return new HttpResponse({ body: projects.map(p => p.Id), status: 200 });
  }

  async getProjects(): Promise<HttpResponse<Project[]>> {
    const projects = await this.loadProjects();
    return new HttpResponse({ body: projects, status: 200 });
  }

  async getProjectById(id: number): Promise<HttpResponse<Project | undefined>> {
    const projects = await this.loadProjects();
    return new HttpResponse({ body: projects.find(p => p.Id === id), status: 200 });
  }
}
