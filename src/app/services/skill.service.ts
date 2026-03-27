import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BaseService } from './base.service';
import { Skill } from '../models/skill.model';

@Injectable({
  providedIn: 'root',
})
export class SkillService extends BaseService {
  private skills: Skill[] | null = null;

  private async loadSkills(): Promise<Skill[]> {
    if (this.skills) return this.skills;
    this.skills = await firstValueFrom(
      this.http.get<Skill[]>('assets/data/skills.json')
    );
    return this.skills;
  }

  async getSkills(): Promise<HttpResponse<Skill[]>> {
    const skills = await this.loadSkills();
    return new HttpResponse({ body: skills, status: 200 });
  }
}
