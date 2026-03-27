import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BaseService } from './base.service';
import { Profile } from '../models/profile.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService extends BaseService {
  private profile: Profile | null = null;

  private async loadProfile(): Promise<Profile> {
    if (this.profile) return this.profile;
    this.profile = await firstValueFrom(
      this.http.get<Profile>('assets/data/profile.json')
    );
    return this.profile;
  }

  async getProfile(): Promise<HttpResponse<Profile>> {
    const profile = await this.loadProfile();
    return new HttpResponse({ body: profile, status: 200 });
  }
}
