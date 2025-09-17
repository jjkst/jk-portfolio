import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { BaseService } from './base.service';
import { PRODUCTS, Project } from '../models/project.modal';
import { SKILLS } from '../models/skill.model';

@Injectable({
  providedIn: 'root',
})
export class SkillService extends BaseService {

  async getSkills(): Promise<HttpResponse<any[]>> {
    return new HttpResponse({ body: SKILLS, status: 200 });
  }
}
