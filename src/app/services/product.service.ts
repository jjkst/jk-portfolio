import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { BaseService } from './base.service';
import { PRODUCTS, Project } from '../models/project.modal';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends BaseService {
  private readonly endpoint = '/projects';

  async getProjectIds(): Promise<HttpResponse<any[]>> {
    return new HttpResponse({ body: PRODUCTS.map(p => p.ID), status: 200 });
  }

  async getProjects(): Promise<HttpResponse<any[]>> {
    return new HttpResponse({ body: PRODUCTS, status: 200 });
  }

  async getProjectById(id: number): Promise<HttpResponse<any>> {
    return new HttpResponse({ body: PRODUCTS.find(p => p.ID == id), status: 200 });
  }
}
