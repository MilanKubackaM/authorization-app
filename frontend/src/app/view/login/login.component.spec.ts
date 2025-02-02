import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../shared/services/auth.service';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'setToken']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClient(),
        provideToastr(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastrService, useValue: toastrSpy },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark email field as invalid if incorrect format is used', () => {
    component.loginForm.controls['email'].setValue('invalid-email');
    expect(component.loginForm.controls['email'].valid).toBeFalse();
  });

  it('should successfully submit form and call AuthService', () => {
    component.loginForm.setValue({
      email: 'johndoe@example.com',
      password: 'password123'
    });

    authServiceSpy.login.and.returnValue(of({ token: 'mocked-token' }));

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith('johndoe@example.com', 'password123');
    expect(authServiceSpy.setToken).toHaveBeenCalledWith('mocked-token');
    expect(toastrSpy.success).toHaveBeenCalledWith('Login successful', 'Success');
  });

  it('should show error message on failed login', () => {
    component.loginForm.setValue({
      email: 'wrong@example.com',
      password: 'wrongpassword'
    });

    authServiceSpy.login.and.returnValue(throwError(() => new Error('Invalid email or password')));

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith('wrong@example.com', 'wrongpassword');
    expect(toastrSpy.error).toHaveBeenCalledWith('Invalid email or password', 'Error');
  });
});