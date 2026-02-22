import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { BaseService } from './base.service';
import { Project, PRODUCTS } from '../models/project.modal';

@Injectable({
  providedIn: 'root',
})
export class ProjectService extends BaseService {

  async getProjectIds(): Promise<HttpResponse<number[]>> {
    return new HttpResponse({ body: PRODUCTS.map(p => p.Id), status: 200 });
  }

  async getProjects(): Promise<HttpResponse<Project[]>> {
    return new HttpResponse({ body: PRODUCTS, status: 200 });
  }

  async getProjectById(id: number): Promise<HttpResponse<Project | undefined>> {
    return new HttpResponse({ body: PRODUCTS.find(p => p.Id === id), status: 200 });
  }
}
