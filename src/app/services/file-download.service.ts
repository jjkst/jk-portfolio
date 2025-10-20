import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileDownloadService {
  constructor(private http: HttpClient) {}

  downloadFile(): Promise<HttpResponse<Blob>> {
    return lastValueFrom(
      this.http.get('assets/StaffAutomationQualityEngineer.pdf', {
        responseType: 'blob',
        observe: 'response',
      })
    );
  }
}
