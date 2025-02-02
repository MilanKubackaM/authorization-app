import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';

describe('DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const API_URL = environment.apiUrl;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getTokenObservable']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DataService,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    service = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return secret when token is valid', () => {
    const mockToken = 'mocked_token_123';
    const mockSecret = 'This is a secret!';
    
    authServiceSpy.getTokenObservable.and.returnValue(of(mockToken));

    service.getSecret().subscribe(secret => {
      expect(secret).toBe(mockSecret);
    });

    const req = httpMock.expectOne(`${API_URL}/info`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);

    req.flush(mockSecret);
  });

  it('should handle errors and return fallback error message', () => {
    const mockToken = 'mocked_token_123';
    
    authServiceSpy.getTokenObservable.and.returnValue(of(mockToken));

    service.getSecret().subscribe(secret => {
      expect(secret).toBe('Unknown error');
    });

    const req = httpMock.expectOne(`${API_URL}/info`);
    req.flush('', { status: 500, statusText: 'Server Error' });
  });
});