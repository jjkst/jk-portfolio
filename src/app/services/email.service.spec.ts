import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { EmailService } from './email.service';
import { Contact } from '../models/contact.model';
import { environment } from '../../../environment';

describe('EmailService', () => {
  let service: EmailService;
  let httpTesting: HttpTestingController;
  const baseUrl = environment.apiBaseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(EmailService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should POST to send an email', async () => {
    const contact: Contact = {
      FirstName: 'John',
      LastName: 'Doe',
      Email: 'john@example.com',
      PhoneNumber: '1234567890',
      Questions: 'Test question'
    };
    const promise = service.sendEmail(contact);

    const req = httpTesting.expectOne(`${baseUrl}/email/send`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(contact);
    req.flush(contact);

    const response = await promise;
    expect(response.body).toEqual(contact);
  });

  describe('validateContactData', () => {
    it('should return true for valid contact data', () => {
      const contact: Contact = {
        FirstName: 'John',
        LastName: 'Doe',
        Email: 'john@example.com',
        PhoneNumber: '1234567890',
        Questions: 'Test'
      };
      expect(service.validateContactData(contact)).toBeTrue();
    });

    it('should return false when required fields are missing', () => {
      const contact = { FirstName: 'John', LastName: '' } as Contact;
      expect(service.validateContactData(contact)).toBeFalse();
    });
  });
});
