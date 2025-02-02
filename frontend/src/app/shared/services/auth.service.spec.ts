import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { provideHttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockToken = 'mocked_token_123';
  const API_URL = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
  
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and store token', () => {
    service.login('test@example.com', 'password123').subscribe(response => {
      expect(response.token).toBe(mockToken);
    });

    const req = httpMock.expectOne(`${API_URL}/authenticate`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@example.com', password: 'password123' });

    req.flush({ token: mockToken });
  });

  it('should register and return token', () => {
    service.register('John', 'Doe', 'johndoe@example.com', 'password123').subscribe(response => {
      expect(response.token).toBe(mockToken);
    });

    const req = httpMock.expectOne(`${API_URL}/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      password: 'password123'
    });

    req.flush({ token: mockToken });
  });

  it('should logout and clear token', () => {
    service.setToken(mockToken);
    service.logout();
    
    service.getTokenObservable().subscribe(token => {
      expect(token).toBeNull();
    });
  });

  it('should set and retrieve token', () => {
    service.setToken(mockToken);

    service.getTokenObservable().subscribe(token => {
      expect(token).toBe(mockToken);
    });
  });

});