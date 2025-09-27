import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { BaseService } from './base.service';
import { PROFILE } from '../models/profile.modal';

@Injectable({
  providedIn: 'root',
})
export class ProfileService extends BaseService {

  async getProfile(): Promise<HttpResponse<any>> {
    return new HttpResponse({ body: PROFILE, status: 200 });
  }
}
