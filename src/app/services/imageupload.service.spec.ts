import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ImageUploadService } from './imageupload.service';
import { environment } from '../../../environment';

describe('ImageUploadService', () => {
  let service: ImageUploadService;
  let httpTesting: HttpTestingController;
  const baseUrl = environment.apiBaseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ImageUploadService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should POST a single image upload with FormData', async () => {
    const file = new File(['image-data'], 'test.png', { type: 'image/png' });
    const promise = service.uploadImage(file);

    const req = httpTesting.expectOne(`${baseUrl}/uploadimage`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTrue();
    expect(req.request.body.get('file')).toBeTruthy();
    expect(req.request.body.get('folder')).toBe('uploads');
    req.flush({ url: 'uploaded/test.png' });

    const response = await promise;
    expect(response.body.url).toBe('uploaded/test.png');
  });

  it('should POST multiple images upload with FormData', async () => {
    const files = [
      new File(['img1'], 'a.png', { type: 'image/png' }),
      new File(['img2'], 'b.png', { type: 'image/png' })
    ];
    const promise = service.uploadMultipleImages(files);

    const req = httpTesting.expectOne(`${baseUrl}/uploadimage/multiple`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTrue();
    expect(req.request.body.getAll('files').length).toBe(2);
    req.flush({ urls: ['a.png', 'b.png'] });

    const response = await promise;
    expect(response.body.urls.length).toBe(2);
  });
});
